from __future__ import annotations

import base64
import io
import os
from typing import List

import numpy as np
from PIL import Image

try:
    from deepface import DeepFace  # type: ignore
except Exception:  # pragma: no cover - optional heavy dependency
    DeepFace = None  # type: ignore

# ~7.5 MB decoded image limit; base64 overhead is ~33%
_MAX_IMAGE_B64_BYTES = 10 * 1_024 * 1_024

FACE_MODEL = os.getenv("FACE_MODEL", "Facenet")


def _get_match_threshold() -> float:
    # Default 0.60 cosine similarity == 0.40 cosine distance, matching DeepFace's Facenet defaults
    raw = os.getenv("FACE_MATCH_THRESHOLD", "0.60")
    try:
        value = float(raw)
    except ValueError:
        return 0.60
    return max(0.0, min(1.0, value))


FACE_MATCH_THRESHOLD = _get_match_threshold()


def load_image_from_base64(image_b64: str) -> Image.Image:
    """Decode base64 string to a PIL Image."""
    # Accept both raw base64 and data URL forms from browser captures.
    normalized = image_b64.strip()
    if "," in normalized and normalized.lower().startswith("data:"):
        normalized = normalized.split(",", 1)[1]
    if len(normalized) > _MAX_IMAGE_B64_BYTES:
        raise ValueError("Image payload exceeds maximum allowed size")
    data = base64.b64decode(normalized)
    return Image.open(io.BytesIO(data)).convert("RGB")


def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    a = np.array(vec1, dtype="float32")
    b = np.array(vec2, dtype="float32")
    if a.size == 0 or b.size == 0:
        return 0.0
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)


def generate_embedding(image_b64: str) -> List[float]:
    """
    Generate a facial embedding using DeepFace.
    Raises RuntimeError if DeepFace is not installed.
    Raises ValueError if no face is detected in the image.
    """
    if DeepFace is None:
        raise RuntimeError("DeepFace is not installed; face inference is unavailable")

    img = load_image_from_base64(image_b64)
    try:
        embeddings = DeepFace.represent(
            img_path=np.array(img), model_name=FACE_MODEL, enforce_detection=True
        )
    except ValueError as exc:
        # DeepFace raises ValueError when face detection fails
        raise ValueError("No face detected in the provided image") from exc

    if not embeddings:
        return []
    # DeepFace returns a list of dicts; take the highest-confidence detection
    rep = embeddings[0]
    return list(rep.get("embedding", []))


def compare_face(stored_embedding: List[float], image_b64: str) -> tuple[bool, float]:
    new_embedding = generate_embedding(image_b64)
    if not stored_embedding or not new_embedding:
        return False, 0.0
    sim = cosine_similarity(stored_embedding, new_embedding)
    confidence = max(0.0, min(100.0, sim * 100.0))
    verified = sim >= FACE_MATCH_THRESHOLD
    return verified, confidence
