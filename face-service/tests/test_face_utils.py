from __future__ import annotations

from face_utils import cosine_similarity


def test_cosine_similarity_basic():
    v1 = [1.0, 0.0]
    v2 = [1.0, 0.0]
    assert cosine_similarity(v1, v2) == 1.0

    v3 = [0.0, 1.0]
    assert cosine_similarity(v1, v3) == 0.0
