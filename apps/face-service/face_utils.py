from __future__ import annotations

import base64
import hashlib
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

# If True, use a lightweight fallback when DeepFace is unavailable
_USE_FALLBACK = os.getenv("FACE_FALLBACK", "true").lower() == "true"

# Fallback embedding dimension (matches a plausible vector size)
_FALLBACK_DIM = 128


def _get_match_threshold() -> float:
    raw = os.getenv("FACE_MATCH_THRESHOLD", "0.60")
    try:
        value = float(raw)
    except ValueError:
        return 0.60
    return max(0.0, min(1.0, value))


FACE_MATCH_THRESHOLD = _get_match_threshold()


def load_image_from_base64(image_b64: str) -> Image.Image:
    """Decode base64 string to a PIL Image."""
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


def _fallback_embedding(img: Image.Image) -> List[float]:
    """
    Lightweight embedding when DeepFace is unavailable.
    Resizes the image to a fixed grid and uses normalised pixel intensities
    as a descriptor. Consistent enough for demo enrollment + re-authentication
    of the same person under similar lighting.
    """
    # Centre-crop to square then resize to 16x8 = 128 values
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    img_crop = img.crop((left, top, left + side, top + side))
    img_small = img_crop.resize((16, 8), Image.LANCZOS).convert("L")
    pixels = np.array(img_small, dtype="float32").flatten()
    # Normalise to unit vector
    norm = np.linalg.norm(pixels)
    if norm == 0:
        return [0.0] * _FALLBACK_DIM
    return (pixels / norm).tolist()


def generate_embedding(image_b64: str) -> List[float]:
    """
    Generate a facial embedding.
    Uses DeepFace when installed; falls back to a lightweight pixel descriptor
    controlled by the FACE_FALLBACK env var (default: true).
    Raises ValueError if the image cannot be decoded.
    """
    img = load_image_from_base64(image_b64)

    if DeepFace is not None:
        try:
            embeddings = DeepFace.represent(
                img_path=np.array(img), model_name=FACE_MODEL, enforce_detection=True
            )
        except ValueError as exc:
            raise ValueError("No face detected in the provided image") from exc
        if not embeddings:
            return []
        rep = embeddings[0]
        return list(rep.get("embedding", []))

    if not _USE_FALLBACK:
        raise RuntimeError("DeepFace is not installed; face inference is unavailable")

    return _fallback_embedding(img)


def compare_face(stored_embedding: List[float], image_b64: str) -> tuple[bool, float]:
    new_embedding = generate_embedding(image_b64)
    if not stored_embedding or not new_embedding:
        return False, 0.0
    sim = cosine_similarity(stored_embedding, new_embedding)
    confidence = max(0.0, min(100.0, sim * 100.0))
    verified = sim >= FACE_MATCH_THRESHOLD
    return verified, confidence
