try:
    from .analysis import (
        analyze_sentiment,
        calculate_filler_penalty,
        calculate_similarity,
        count_filler_words,
    )
except ImportError:
    from analysis import (
        analyze_sentiment,
        calculate_filler_penalty,
        calculate_similarity,
        count_filler_words,
    )

SEMANTIC_WEIGHT = 0.72
CONFIDENCE_WEIGHT = 0.28


def _build_feedback(score, semantic_score, confidence_score, filler_count):
    if score >= 80:
        tone = "Excellent answer overall."
    elif score >= 65:
        tone = "Solid answer with a good foundation."
    elif score >= 50:
        tone = "Promising answer, but it needs sharper delivery."
    else:
        tone = "The answer needs more clarity and structure."

    detail_parts = []

    if semantic_score >= 75:
        detail_parts.append("Your response stayed technically aligned with the question.")
    elif semantic_score < 55:
        detail_parts.append("It would benefit from more concrete technical depth.")

    if confidence_score >= 70:
        detail_parts.append("The tone reads as confident.")
    elif confidence_score < 55:
        detail_parts.append("The tone feels hesitant in places.")

    if filler_count >= 4:
        detail_parts.append("Too many filler words are weakening the delivery.")
    elif filler_count == 0:
        detail_parts.append("Your delivery sounds clean and composed.")

    return " ".join([tone, *detail_parts]).strip()


def _build_suggestions(semantic_score, confidence_score, filler_count):
    suggestions = []

    if semantic_score < 60:
        suggestions.append(
            "Add one concrete example or implementation detail to make the answer feel more technical."
        )

    if confidence_score < 60:
        suggestions.append(
            "Lead with a direct statement before expanding so the answer sounds more confident."
        )

    if filler_count >= 3:
        suggestions.append(
            "Pause briefly instead of filling silence with words like 'um' or 'like'."
        )

    if not suggestions:
        suggestions.append("Keep this structure: direct answer first, then support it with specifics.")

    return suggestions


def _build_tags(semantic_score, confidence_score, filler_count):
    tags = []

    if semantic_score >= 75:
        tags.append("technical_depth_strong")
    elif semantic_score < 55:
        tags.append("technical_depth_low")

    if confidence_score >= 70:
        tags.append("confidence_strong")
    elif confidence_score < 55:
        tags.append("confidence_low")

    if filler_count >= 4:
        tags.append("too_many_fillers")
    elif filler_count == 0:
        tags.append("clean_delivery")

    return tags


def evaluate_answer(question, answer):
    reference_answer = (question or "").strip()
    candidate_answer = (answer or "").strip()

    semantic_score = calculate_similarity(candidate_answer, reference_answer)
    sentiment_result = analyze_sentiment(candidate_answer)
    confidence_score = sentiment_result["confidence_score"]
    filler_count = count_filler_words(candidate_answer)
    filler_penalty = calculate_filler_penalty(filler_count)

    weighted_score = (semantic_score * SEMANTIC_WEIGHT) + (
        confidence_score * CONFIDENCE_WEIGHT
    )
    final_score = round(max(0.0, min(weighted_score - filler_penalty, 100.0)), 2)

    feedback = _build_feedback(final_score, semantic_score, confidence_score, filler_count)
    suggestions = _build_suggestions(semantic_score, confidence_score, filler_count)
    tags = _build_tags(semantic_score, confidence_score, filler_count)

    return {
        "score": final_score,
        "feedback": feedback,
        "suggestions": suggestions,
        "tags": tags,
        "breakdown": {
            "semantic_score": semantic_score,
            "confidence_score": confidence_score,
            "sentiment_label": sentiment_result["label"],
            "filler_count": filler_count,
            "filler_penalty": filler_penalty,
        },
    }
