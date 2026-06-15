from __future__ import annotations

import os
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from face_utils import generate_embedding, compare_face

app = FastAPI(title="SECUREID Face Service")

_raw_origins = os.getenv(
    "FACE_SERVICE_CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)
_ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

_MAX_IMAGE_B64_LEN = 10 * 1_024 * 1_024  # 10 MB encoded


class GenerateEmbeddingRequest(BaseModel):
    image: str


class GenerateEmbeddingResponse(BaseModel):
    embedding: List[float]


class CompareFaceRequest(BaseModel):
    stored_embedding: List[float]
    new_image: str


class CompareFaceResponse(BaseModel):
    verified: bool
    confidence_score: float


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/generate-embedding", response_model=GenerateEmbeddingResponse)
def generate_embedding_endpoint(payload: GenerateEmbeddingRequest):
    if len(payload.image) > _MAX_IMAGE_B64_LEN:
        raise HTTPException(status_code=400, detail="Image payload too large")
    try:
        embedding = generate_embedding(payload.image)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Failed to process image: {exc}")
    if not embedding:
        raise HTTPException(status_code=400, detail="No face detected or embedding empty")
    return GenerateEmbeddingResponse(embedding=embedding)


@app.post("/compare-face", response_model=CompareFaceResponse)
def compare_face_endpoint(payload: CompareFaceRequest):
    if len(payload.new_image) > _MAX_IMAGE_B64_LEN:
        raise HTTPException(status_code=400, detail="Image payload too large")
    try:
        verified, confidence = compare_face(payload.stored_embedding, payload.new_image)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to compare faces")
    return CompareFaceResponse(verified=verified, confidence_score=confidence)


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("FACE_SERVICE_HOST", "0.0.0.0")
    port = int(os.getenv("FACE_SERVICE_PORT", "8001"))
    uvicorn.run(app, host=host, port=port)
