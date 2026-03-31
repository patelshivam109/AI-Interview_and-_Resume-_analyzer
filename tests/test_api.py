from fastapi.testclient import TestClient

import backend.app as app_module

client = TestClient(app_module.app)


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_upload_resume_endpoint(monkeypatch):
    monkeypatch.setattr(app_module, "extract_text_from_pdf", lambda file: "python react fastapi")
    monkeypatch.setattr(app_module, "extract_skills", lambda text: ["python", "react", "fastapi"])
    monkeypatch.setattr(
        app_module,
        "generate_questions",
        lambda skills: [
            "Explain Python decorators.",
            "How do you optimize React rendering?",
        ],
    )

    response = client.post(
        "/upload_resume",
        files={"file": ("resume.pdf", b"%PDF-1.4 fake", "application/pdf")},
    )

    assert response.status_code == 200
    assert response.json()["extracted_skills"] == ["python", "react", "fastapi"]
    assert response.json()["interview_questions"] == [
        "Explain Python decorators.",
        "How do you optimize React rendering?",
    ]


def test_evaluate_answer_endpoint(monkeypatch):
    mocked_response = {
        "score": 81.5,
        "feedback": "Strong answer overall.",
        "suggestions": ["Lead with your strongest point first."],
        "tags": ["technical_depth_strong", "confidence_strong"],
        "breakdown": {
            "semantic_score": 85.0,
            "confidence_score": 78.0,
            "sentiment_label": "Positive",
            "filler_count": 1,
            "filler_penalty": 4.5,
        },
    }
    monkeypatch.setattr(app_module, "evaluate_answer", lambda question, answer: mocked_response)

    response = client.post(
        "/evaluate_answer",
        json={"question": "Explain Python.", "answer": "Python is a versatile language."},
    )

    assert response.status_code == 200
    assert response.json() == mocked_response
