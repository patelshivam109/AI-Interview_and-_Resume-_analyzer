from io import BytesIO

from backend import resume_parser


class DummyPage:
    def __init__(self, text):
        self._text = text

    def extract_text(self):
        return self._text


class DummyPDF:
    def __init__(self, pages):
        self.pages = pages

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, traceback):
        return False


def test_extract_text_from_pdf_collects_page_text(monkeypatch):
    monkeypatch.setattr(
        resume_parser.pdfplumber,
        "open",
        lambda file: DummyPDF([DummyPage("Python "), DummyPage("React")]),
    )

    extracted_text = resume_parser.extract_text_from_pdf(BytesIO(b"fake pdf bytes"))

    assert extracted_text == "python react"


def test_extract_skills_returns_known_skills():
    text = "Built python APIs with fastapi and shipped a react dashboard with sql."

    skills = resume_parser.extract_skills(text)

    assert set(skills) >= {"python", "fastapi", "react", "sql"}
