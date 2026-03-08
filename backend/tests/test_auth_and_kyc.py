from __future__ import annotations

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_secureid.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def register_and_login():
    reg_payload = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "StrongPass123",
    }
    r = client.post("/auth/register", json=reg_payload)
    assert r.status_code == 201
    student_id = r.json()["id"]

    login_payload = {"email": reg_payload["email"], "password": reg_payload["password"]}
    r = client.post("/auth/login", json=login_payload)
    assert r.status_code == 200
    token = r.json()["access_token"]
    return student_id, token


def test_jwt_auth_flow():
    student_id, token = register_and_login()
    assert student_id > 0
    assert isinstance(token, str) and len(token) > 10


def test_kyc_verification():
    student_id, token = register_and_login()
    headers = {"Authorization": f"Bearer {token}"}

    # Successful KYC (12-digit Aadhaar)
    payload = {
        "student_id": student_id,
        "aadhaar_number": "123456789012",
        "id_card_image": "dummy",
    }
    r = client.post("/kyc/verify", json=payload, headers=headers)
    assert r.status_code == 200
    assert r.json()["status"] == "verified"

    # Rejected KYC (wrong length)
    payload["aadhaar_number"] = "1234"
    r = client.post("/kyc/verify", json=payload, headers=headers)
    assert r.status_code == 200
    assert r.json()["status"] == "rejected"
