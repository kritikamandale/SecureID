from __future__ import annotations

from datetime import timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from . import models, schemas
from .config import get_settings
from .database import get_db
from .utils import verify_password, create_access_token, hash_password

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
settings = get_settings()


def authenticate_student(
    db: Session, email: str, password: str
) -> Optional[models.Student]:
    student = db.query(models.Student).filter(models.Student.email == email).first()
    if not student or not verify_password(password, student.password_hash):
        return None
    return student


def create_student(
    db: Session, student_in: schemas.StudentRegisterRequest
) -> models.Student:
    existing = (
        db.query(models.Student)
        .filter(models.Student.email == student_in.email)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    db_student = models.Student(
        name=student_in.full_name,
        email=student_in.email,
        role=student_in.role,
        student_id_str=student_in.student_id,
        university=student_in.university,
        password_hash=hash_password(student_in.password),
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


def generate_access_token(student: models.Student) -> str:
    token_data = {"sub": str(student.id), "email": student.email, "role": student.role}
    return create_access_token(
        token_data,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )


def get_current_student(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> models.Student:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        sub: str | None = payload.get("sub")
        if sub is None:
            raise credentials_exception
        student_id = int(sub)
    except (JWTError, ValueError):
        raise credentials_exception

    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if student is None:
        raise credentials_exception
    return student
