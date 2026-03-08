from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_current_student
from ..database import get_db

router = APIRouter(prefix="/student", tags=["student"])


@router.get("/timeline")
def get_student_timeline(
    current_student: models.Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    timeline = []

    # Registration event
    timeline.append(
        {
            "type": "registration",
            "title": "Account Created",
            "timestamp": current_student.created_at,
            "detail": "Welcome to SECUREID.",
        }
    )

    # KYC event
    if current_student.kyc_status != "pending":
        timeline.append(
            {
                "type": "kyc",
                "title": f"KYC Status: {current_student.kyc_status.capitalize()}",
                "timestamp": current_student.created_at,  # simplified, using created_at
                "detail": "Document verification process.",
            }
        )

    # Face enrollment event
    if current_student.face_registered:
        timeline.append(
            {
                "type": "face_enrollment",
                "title": "Face Enrolled Successfully",
                "timestamp": current_student.created_at,  # simplified
                "detail": "Facial biometrics registered securely.",
            }
        )

    # Auth logs
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

    # Sort timeline by timestamp desc
    timeline.sort(key=lambda x: x["timestamp"], reverse=True)
    return timeline
