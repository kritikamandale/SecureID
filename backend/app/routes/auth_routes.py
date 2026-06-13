from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import authenticate_student, create_student, generate_access_token, get_current_student
from ..database import get_db
from ..utils import hash_password, verify_password

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


@router.post("/change-password")
def change_password(
    payload: schemas.ChangePasswordRequest,
    current_student: models.Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    if not verify_password(payload.current_password, current_student.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    current_student.password_hash = hash_password(payload.new_password)
    db.add(current_student)
    db.commit()
    return {"message": "Password updated successfully"}
