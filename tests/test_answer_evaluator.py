import pytest

import backend.answer_evaluator as answer_evaluator


def test_evaluate_answer_returns_structured_payload(monkeypatch):
    monkeypatch.setattr(answer_evaluator, "calculate_similarity", lambda answer, ref: 82.0)
    monkeypatch.setattr(
        answer_evaluator,
        "analyze_sentiment",
        lambda answer: {
            "label": "Positive",
            "compound": 0.6,
            "confidence_score": 80.0,
        },
    )
    monkeypatch.setattr(answer_evaluator, "count_filler_words", lambda answer: 1)
    monkeypatch.setattr(answer_evaluator, "calculate_filler_penalty", lambda count: 4.5)

    result = answer_evaluator.evaluate_answer(
        "Explain REST APIs.",
        "REST APIs use stateless requests and predictable resource endpoints.",
    )

    assert result["score"] == pytest.approx(76.94)
    assert "feedback" in result
    assert result["tags"] == ["technical_depth_strong", "confidence_strong"]
    assert result["breakdown"]["semantic_score"] == 82.0
    assert result["breakdown"]["confidence_score"] == 80.0
    assert result["breakdown"]["filler_count"] == 1
    assert result["suggestions"]


def test_evaluate_answer_flags_low_quality_response(monkeypatch):
    monkeypatch.setattr(answer_evaluator, "calculate_similarity", lambda answer, ref: 28.0)
    monkeypatch.setattr(
        answer_evaluator,
        "analyze_sentiment",
        lambda answer: {
            "label": "Negative",
            "compound": -0.5,
            "confidence_score": 25.0,
        },
    )
    monkeypatch.setattr(answer_evaluator, "count_filler_words", lambda answer: 5)
    monkeypatch.setattr(answer_evaluator, "calculate_filler_penalty", lambda count: 18.0)

    result = answer_evaluator.evaluate_answer("What is Python?", "um like maybe coding")

    assert result["score"] < 20
    assert "technical_depth_low" in result["tags"]
    assert "confidence_low" in result["tags"]
    assert "too_many_fillers" in result["tags"]
