from __future__ import annotations

import base64
import io
from typing import List

import numpy as np
from PIL import Image

try:
    from deepface import DeepFace  # type: ignore
except Exception:  # pragma: no cover - optional heavy dependency
    DeepFace = None  # type: ignore


def load_image_from_base64(image_b64: str) -> Image.Image:
    """Decode base64 string to a PIL Image."""
    # Accept both raw base64 and data URL forms from browser captures.
    normalized = image_b64.strip()
    if "," in normalized and normalized.lower().startswith("data:"):
        normalized = normalized.split(",", 1)[1]
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
    If DeepFace is not available, return a deterministic dummy vector.
    """
    if DeepFace is None:
        # Fallback: deterministic pseudo-embedding from image bytes length
        img = load_image_from_base64(image_b64)
        size_feature = float(sum(img.size))
        return [size_feature / 1000.0] * 128

    img = load_image_from_base64(image_b64)
    embeddings = DeepFace.represent(
        img_path=np.array(img), model_name="Facenet", enforce_detection=False
    )
    if not embeddings:
        return []
    # DeepFace returns a list of dicts; we take the first embedding
    rep = embeddings[0]
    return list(rep.get("embedding", []))


def compare_face(stored_embedding: List[float], image_b64: str) -> tuple[bool, float]:
    new_embedding = generate_embedding(image_b64)
    if not stored_embedding or not new_embedding:
        return False, 0.0
    sim = cosine_similarity(stored_embedding, new_embedding)
    # Convert similarity (0-1) to confidence percentage
    confidence = max(0.0, min(1.0, sim)) * 100.0
    verified = sim >= 0.7
    return verified, confidence
