from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..schemas import StudentOut
from ..database import get_db
from sqlalchemy.orm import Session
from ..models import Student
from ..auth import get_current_student
from ..blockchain_service import get_student_history, add_verification_record

router = APIRouter(
    prefix="/verification",
    tags=["blockchain_verification"],
    responses={404: {"description": "Not found"}},
)


@router.get("/history/{student_id}", response_model=dict)
def get_history(
    student_id: str,
    current_user: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    """
    Fetch the verification history from the blockchain immutable ledger.
    """
    # Allow admins to view anyone's history, but students can only view their own
    if current_user.role != "admin" and current_user.student_id_str != student_id:
        # User might be passing the numeric PK ID, let's look up the student_id_str
        if str(current_user.id) != student_id:
            raise HTTPException(
                status_code=403, detail="Not authorized to view this history"
            )

    history = get_student_history(student_id)
    return {"studentId": student_id, "history": history}


# POST /api/verification/record is done internally during face auth by calling add_verification_record
