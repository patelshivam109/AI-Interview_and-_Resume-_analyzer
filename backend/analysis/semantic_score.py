from functools import lru_cache

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


@lru_cache(maxsize=1)
def get_model():
    return SentenceTransformer("all-MiniLM-L6-v2")


def calculate_similarity(answer, reference):
    if not answer or not reference:
        return 0.0

    model = get_model()
    embeddings = model.encode([answer, reference])
    similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    bounded_similarity = max(0.0, min(float(similarity), 1.0))

    return round(bounded_similarity * 100, 2)
