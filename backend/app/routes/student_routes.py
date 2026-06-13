from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_current_student
from ..database import get_db

router = APIRouter(prefix="/student", tags=["student"])


@router.get("/me", response_model=schemas.StudentOut)
def get_me(current_student: models.Student = Depends(get_current_student)):
    return current_student


@router.patch("/profile", response_model=schemas.StudentOut)
def update_profile(
    payload: schemas.ProfileUpdateRequest,
    current_student: models.Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    if payload.name is not None:
        if not payload.name.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Name cannot be empty",
            )
        current_student.name = payload.name.strip()
    if payload.university is not None:
        current_student.university = payload.university.strip() or None
    if payload.student_id_str is not None:
        current_student.student_id_str = payload.student_id_str.strip() or None
    db.add(current_student)
    db.commit()
    db.refresh(current_student)
    return current_student


@router.get("/stats", response_model=schemas.StudentStats)
def get_student_stats(
    current_student: models.Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    all_logs = (
        db.query(models.AuthenticationLog)
        .filter(models.AuthenticationLog.student_id == current_student.id)
        .all()
    )

    total = len(all_logs)
    success_count = sum(1 for log in all_logs if log.success)
    success_rate = round((success_count / total * 100) if total > 0 else 0.0, 1)

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    days = []
    for offset in range(6, -1, -1):
        day = now - timedelta(days=offset)
        day_str = day.strftime("%Y-%m-%d")
        day_logs = [l for l in all_logs if l.timestamp.strftime("%Y-%m-%d") == day_str]
        days.append(
            schemas.DayStats(
                date=day_str,
                attempts=len(day_logs),
                successes=sum(1 for l in day_logs if l.success),
            )
        )

    return schemas.StudentStats(
        total_attempts=total,
        success_count=success_count,
        success_rate=success_rate,
        days=days,
    )


@router.get("/timeline")
def get_student_timeline(
    current_student: models.Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    timeline = []

    timeline.append(
        {
            "type": "registration",
            "title": "Account Created",
            "timestamp": current_student.created_at,
            "detail": "Welcome to SECUREID.",
        }
    )

    if current_student.kyc_status != "pending":
        timeline.append(
            {
                "type": "kyc",
                "title": f"KYC Status: {current_student.kyc_status.capitalize()}",
                "timestamp": current_student.kyc_verified_at or current_student.created_at,
                "detail": "Document verification process.",
            }
        )

    if current_student.face_registered:
        timeline.append(
            {
                "type": "face_enrollment",
                "title": "Face Enrolled Successfully",
                "timestamp": current_student.face_enrolled_at or current_student.created_at,
                "detail": "Facial biometrics registered securely.",
            }
        )

    logs = (
        db.query(models.AuthenticationLog)
        .filter(models.AuthenticationLog.student_id == current_student.id)
        .order_by(models.AuthenticationLog.timestamp.desc())
        .all()
    )

    for log in logs:
        status_str = "Success" if log.success else "Failed"
        timeline.append(
            {
                "type": "authentication",
                "title": f"Face Auth Attempt: {status_str}",
                "timestamp": log.timestamp,
                "detail": f"Confidence Score: {log.confidence_score:.2f}%",
            }
        )

    timeline.sort(key=lambda x: x["timestamp"], reverse=True)
    return timeline
