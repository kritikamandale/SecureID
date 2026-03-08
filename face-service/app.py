from __future__ import annotations

from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from face_utils import generate_embedding, compare_face

app = FastAPI(title="SECUREID Face Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    try:
        embedding = generate_embedding(payload.image)
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(
            status_code=400, detail=f"Failed to generate embedding: {exc}"
        )
    if not embedding:
        raise HTTPException(
            status_code=400, detail="No face detected or embedding empty"
        )
    return GenerateEmbeddingResponse(embedding=embedding)


@app.post("/compare-face", response_model=CompareFaceResponse)
def compare_face_endpoint(payload: CompareFaceRequest):
    try:
        verified, confidence = compare_face(payload.stored_embedding, payload.new_image)
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=400, detail=f"Failed to compare faces: {exc}")
    return CompareFaceResponse(verified=verified, confidence_score=confidence)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)
