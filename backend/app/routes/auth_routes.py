from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas
from ..auth import authenticate_student, create_student, generate_access_token
from ..database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register", response_model=schemas.StudentOut, status_code=status.HTTP_201_CREATED
)
def register_student(
    student_in: schemas.StudentRegisterRequest, db: Session = Depends(get_db)
):
    student = create_student(db, student_in)
    return student


@router.post("/login")
def login_student(credentials: schemas.StudentLogin, db: Session = Depends(get_db)):
    student = authenticate_student(db, credentials.email, credentials.password)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = generate_access_token(student)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "student_id": student.id,
        "name": student.name,
        "email": student.email,
        "kyc_status": student.kyc_status,
        "face_registered": student.face_registered,
    }
