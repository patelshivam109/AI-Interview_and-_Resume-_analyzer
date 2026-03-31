import os

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from .resume_parser import extract_text_from_pdf, extract_skills
    from .interview_engine import generate_questions
    from .answer_evaluator import evaluate_answer
except ImportError:
    from resume_parser import extract_text_from_pdf, extract_skills
    from interview_engine import generate_questions
    from answer_evaluator import evaluate_answer


def _cors_origins():
    configured_origins = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    )
    return [origin.strip() for origin in configured_origins.split(",") if origin.strip()]


app = FastAPI(
    title="AI Interview Simulator API",
    version="1.0.0",
    description="Resume-tailored interview practice with structured answer evaluation.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "AI Interview Simulator Running"}


@app.get("/health")
def health():
    return {"status": "ok"}


# ---------------- RESUME UPLOAD ----------------

@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):

    text = extract_text_from_pdf(file.file)

    skills = extract_skills(text)

    questions = generate_questions(skills)

    return {
        "extracted_skills": skills,
        "interview_questions": questions
    }


# ---------------- ANSWER EVALUATION ----------------

class AnswerRequest(BaseModel):
    question: str
    answer: str


@app.post("/evaluate_answer")
def evaluate(request: AnswerRequest):

    result = evaluate_answer(request.question, request.answer)

    return result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host=os.getenv("HOST", "127.0.0.1"),
        port=int(os.getenv("PORT", "8000")),
    )
