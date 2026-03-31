import pdfplumber

SKILLS_DB = [
    "python",
    "java",
    "c++",
    "machine learning",
    "deep learning",
    "sql",
    "javascript",
    "react",
    "node",
    "tensorflow",
    "pytorch",
    "nlp",
    "data science",
    "flask",
    "fastapi"
]


def extract_text_from_pdf(file):

    text = ""

    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:

            page_text = page.extract_text()

            if page_text:
                text += page_text

    return text.lower()


def extract_skills(text):
    if not text:
        return []

    found_skills = []

    for skill in SKILLS_DB:
        if skill in text:
            found_skills.append(skill)

    return list(set(found_skills))
