from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_current_student
from ..database import get_db

router = APIRouter(prefix="/kyc", tags=["kyc"])


@router.post("/verify", response_model=schemas.KYCVerifyResponse)
def verify_kyc(
    payload: schemas.KYCVerifyRequest,
    db: Session = Depends(get_db),
    current_student: models.Student = Depends(get_current_student),
):
    if current_student.id != payload.student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot verify KYC for another student",
        )

    # Simple mocked KYC logic: Aadhaar length == 12 is "verified"
    if len(payload.aadhaar_number) == 12:
        status_str = "verified"
    else:
        status_str = "rejected"

    student = (
        db.query(models.Student).filter(models.Student.id == payload.student_id).first()
    )
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Student not found"
        )

    student.kyc_status = status_str
    db.add(student)
    db.commit()
    db.refresh(student)

    return schemas.KYCVerifyResponse(status=status_str)
