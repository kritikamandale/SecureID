from __future__ import annotations

import json
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_current_student
from ..config import get_settings
from ..database import get_db

router = APIRouter(prefix="/face", tags=["face"])
settings = get_settings()


async def call_face_service_generate_embedding(image_b64: str) -> list[float]:
    url = f"{settings.FACE_SERVICE_URL}/generate-embedding"
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.post(url, json={"image": image_b64})
        if resp.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Face service unavailable",
            )
        data = resp.json()
    return data.get("embedding", [])


async def call_face_service_compare(
    stored_embedding: list[float], image_b64: str
) -> dict[str, Any]:
    url = f"{settings.FACE_SERVICE_URL}/compare-face"
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.post(
            url,
            json={"stored_embedding": stored_embedding, "new_image": image_b64},
        )
        if resp.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Face service unavailable",
            )
        return resp.json()


@router.post("/enroll", response_model=schemas.FaceAuthResponse)
async def enroll_face(
    payload: schemas.FaceEnrollRequest,
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(get_current_student),
):
    if current_student.id != payload.student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot enroll face for another student",
        )

    student = (
        db.query(models.Student).filter(models.Student.id == payload.student_id).first()
    )
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Student not found"
        )

    embedding = await call_face_service_generate_embedding(payload.selfie_image)
    if not embedding:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to generate embedding",
        )

    embedding_json = json.dumps(embedding)

    if student.face:
        student.face.face_embedding = embedding_json
    else:
        student.face = models.FaceEmbedding(face_embedding=embedding_json)

    student.face_registered = True
    db.add(student)
    db.commit()
    db.refresh(student)

    # Enrollment returns a success-style response (verified=true)
    return schemas.FaceAuthResponse(verified=True, confidence_score=100.0)


@router.post("/authenticate", response_model=schemas.FaceAuthResponse)
async def authenticate_face(
    payload: schemas.FaceAuthRequest,
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(get_current_student),
):
    if current_student.id != payload.student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot authenticate another student",
        )

    student = (
        db.query(models.Student).filter(models.Student.id == payload.student_id).first()
    )
    if not student or not student.face:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Student face not enrolled"
        )

    stored_embedding = json.loads(student.face.face_embedding)
    result = await call_face_service_compare(stored_embedding, payload.live_image)

    verified = bool(result.get("verified", False))
    confidence = float(result.get("confidence_score", 0.0))

    log = models.AuthenticationLog(
        student_id=student.id,
        confidence_score=confidence,
        success=verified,
    )
    db.add(log)
    db.commit()

    if student.student_id_str:
        from ..blockchain_service import add_verification_record

        add_verification_record(
            student_id=student.student_id_str,
            document_number=student.student_id_str,
            face_score=int(confidence),
            verified=verified,
        )

    return schemas.FaceAuthResponse(verified=verified, confidence_score=confidence)
