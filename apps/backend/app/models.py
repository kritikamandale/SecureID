from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Float,
    Text,
)
from sqlalchemy.orm import relationship

from .database import Base


def _utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(50), default="student", nullable=False)
    student_id_str = Column(String(255), unique=True, index=True, nullable=True)
    university = Column(String(255), nullable=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    kyc_status = Column(String(50), default="pending", nullable=False)
    kyc_verified_at = Column(DateTime, nullable=True)
    face_registered = Column(Boolean, default=False, nullable=False)
    face_enrolled_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=_utcnow, nullable=False)

    face = relationship("FaceEmbedding", back_populates="student", uselist=False)
    auth_logs = relationship("AuthenticationLog", back_populates="student")


class FaceEmbedding(Base):
    __tablename__ = "faces"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(
        Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False
    )
    face_embedding = Column(Text, nullable=False)  # JSON-encoded list of floats

    student = relationship("Student", back_populates="face")


class AuthenticationLog(Base):
    __tablename__ = "authentication_logs"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(
        Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False
    )
    confidence_score = Column(Float, nullable=False)
    success = Column(Boolean, default=False, nullable=False)
    timestamp = Column(DateTime, default=_utcnow, nullable=False)

    student = relationship("Student", back_populates="auth_logs")
