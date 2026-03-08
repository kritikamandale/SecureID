import os
from functools import lru_cache

# BaseSettings moved to pydantic-settings in pydantic v2
from pydantic_settings import BaseSettings
from pydantic import AnyUrl


class Settings(BaseSettings):
    PROJECT_NAME: str = "SECUREID - Student Identity Verification"
    ENV: str = os.getenv("ENV", "development")

    # Database
    DATABASE_URL: AnyUrl | str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://secureid:secureid@db:5432/secureid",
    )

    # Security
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "CHANGE_ME_SUPER_SECRET")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"),
        os.getenv("FRONTEND_ORIGIN_DOCKER", "http://frontend:5173"),
    ]

    # Face service
    FACE_SERVICE_URL: str = os.getenv(
        "FACE_SERVICE_URL",
        "http://localhost:8001",
    )

    class Config:
        case_sensitive = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
