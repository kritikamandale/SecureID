from __future__ import annotations

from datetime import datetime
from typing import Optional, List, Annotated

from pydantic import BaseModel, EmailStr, StringConstraints


# ----- Auth & Student -----
class StudentResponse(BaseModel):
    id: int
    name: str
    email: str


# Schema for the /auth/register endpoint — field names match the frontend form
class StudentRegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=8)]
    student_id: Optional[str] = None
    university: Optional[str] = None
    role: str = "student"


class StudentBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "student"
    student_id_str: Optional[str] = None
    university: Optional[str] = None


class StudentCreate(StudentBase):
    password: Annotated[str, StringConstraints(min_length=8)]


class StudentLogin(BaseModel):
    email: EmailStr
    password: str


class StudentOut(StudentBase):
    id: int
    kyc_status: str
    face_registered: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    student_id: Optional[int] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None


# ----- KYC -----


class KYCVerifyRequest(BaseModel):
    student_id: int
    aadhaar_number: Annotated[str, StringConstraints(min_length=4, max_length=20)]
    id_card_image: str  # base64 image string (mocked)


class KYCVerifyResponse(BaseModel):
    status: str


# ----- Face -----


class FaceEnrollRequest(BaseModel):
    student_id: int
    selfie_image: str  # base64


class FaceAuthRequest(BaseModel):
    student_id: int
    live_image: str  # base64


class FaceAuthResponse(BaseModel):
    verified: bool
    confidence_score: float


class AuthLogOut(BaseModel):
    id: int
    student_id: int
    confidence_score: float
    success: bool
    timestamp: datetime

    class Config:
        from_attributes = True


# ----- Admin -----


class AdminStudentListItem(BaseModel):
    id: int
    name: str
    email: EmailStr
    university: Optional[str] = None
    kyc_status: str
    face_registered: bool
    role: str

    class Config:
        from_attributes = True


class AdminStats(BaseModel):
    total_students: int
    kyc_verified: int
    face_enrolled: int
    auth_attempts: int
