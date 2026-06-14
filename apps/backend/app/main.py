from __future__ import annotations
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import Base, engine
from .routes import (
    auth_routes,
    kyc_routes,
    face_routes,
    admin_routes,
    student_routes,
    blockchain_routes,
)

settings = get_settings()

_WEAK_SECRET = "CHANGE_ME_SUPER_SECRET"


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.JWT_SECRET_KEY == _WEAK_SECRET and settings.ENV != "development":
        raise RuntimeError(
            "JWT_SECRET_KEY must be set to a strong secret in non-development environments"
        )
    if settings.JWT_SECRET_KEY == _WEAK_SECRET:
        print("WARNING: using default JWT_SECRET_KEY — set JWT_SECRET_KEY env var before deploying")
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as exc:
        print(f"Warning: could not create DB tables at startup: {exc}")
    yield


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}


app.include_router(auth_routes.router)
app.include_router(kyc_routes.router)
app.include_router(face_routes.router)
app.include_router(admin_routes.router)
app.include_router(student_routes.router)
app.include_router(blockchain_routes.router)
