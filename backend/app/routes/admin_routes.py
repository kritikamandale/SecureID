from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session
import csv
import io

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/students", response_model=list[schemas.AdminStudentListItem])
def list_students(db: Session = Depends(get_db)):
    students = db.query(models.Student).filter(models.Student.role == "student").all()
    return students


@router.get("/auth-logs", response_model=list[schemas.AuthLogOut])
def list_auth_logs(db: Session = Depends(get_db)):
    logs = (
        db.query(models.AuthenticationLog)
        .order_by(models.AuthenticationLog.timestamp.desc())
        .all()
    )
    return logs


@router.post("/students/{student_id}/revoke")
def revoke_student_verification(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.kyc_status = "pending"
    student.face_registered = False

    # Optional: clear the face embedding
    if student.face:
        student.face.face_embedding = "[]"

    db.add(student)
    db.commit()
    return {"status": "success", "message": "Verification revoked"}


@router.get("/stats", response_model=schemas.AdminStats)
def admin_stats(db: Session = Depends(get_db)):
    total_students = db.query(func.count(models.Student.id)).scalar() or 0
    kyc_verified = (
        db.query(func.count(models.Student.id))
        .filter(models.Student.kyc_status == "verified")
        .scalar()
        or 0
    )
    face_enrolled = (
        db.query(func.count(models.Student.id))
        .filter(models.Student.face_registered.is_(True))
        .scalar()
        or 0
    )
    auth_attempts = db.query(func.count(models.AuthenticationLog.id)).scalar() or 0

    return schemas.AdminStats(
        total_students=total_students,
        kyc_verified=kyc_verified,
        face_enrolled=face_enrolled,
        auth_attempts=auth_attempts,
    )


@router.get("/export/students")
def export_students(db: Session = Depends(get_db)):
    students = db.query(models.Student).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(
        ["ID", "Name", "Email", "KYC Status", "Face Registered", "Created At"]
    )
    for s in students:
        writer.writerow(
            [s.id, s.name, s.email, s.kyc_status, s.face_registered, s.created_at]
        )
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=students.csv"},
    )


@router.get("/export/auth-logs")
def export_auth_logs(db: Session = Depends(get_db)):
    logs = (
        db.query(models.AuthenticationLog)
        .order_by(models.AuthenticationLog.timestamp.desc())
        .all()
    )
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Student ID", "Confidence Score", "Success", "Timestamp"])
    for log in logs:
        writer.writerow(
            [log.id, log.student_id, log.confidence_score, log.success, log.timestamp]
        )
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=auth_logs.csv"},
    )
