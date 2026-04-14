## AI Interview Simulator

A portfolio-grade AI interview practice platform built with FastAPI, React, and Tailwind CSS.

It turns a resume into a tailored mock interview flow, evaluates each answer with semantic matching, confidence analysis, and filler detection, then produces structured performance insights that feel closer to a product than a demo.

## Highlights

- Resume upload and skill extraction from PDF resumes
- Resume-aware interview question generation
- Live answer evaluation with structured scoring
- Smart feedback tags like `confidence_low`, `technical_depth_strong`, and `too_many_fillers`
- Guided interview flow with progress tracking
- Result dashboard with strengths, weaknesses, and improvement suggestions
- Clean SaaS-style UI with polished states and transitions
- Pytest coverage for parser logic, evaluator behavior, and API endpoints

## Tech Stack

### Backend

- FastAPI
- pdfplumber
- sentence-transformers
- scikit-learn
- vaderSentiment
- BeautifulSoup + requests

### Frontend

- React + Vite
- Tailwind CSS
- Axios
- React Router

## Product Flow

1. Upload a PDF resume
2. Extract relevant skills
3. Generate interview questions
4. Answer one question at a time
5. Evaluate each response live
6. Review a final summary with insights and recurring tags

## Screenshots

Add polished screenshots before publishing this project publicly:

- `docs/screenshots/upload-page.png`
- `docs/screenshots/interview-page.png`
- `docs/screenshots/result-page.png`

## Project Structure

```text
backend/
  analysis/
  app.py
  answer_evaluator.py
  interview_engine.py
  interview_session.py
  question_scraper.py
  resume_parser.py
frontend/
  src/
    components/
    context/
    pages/
    services/
    utils/
tests/
requirements.txt
README.md
```

## Local Setup

### 1. Backend

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
uvicorn backend.app:app --reload
```

The backend runs on `http://127.0.0.1:8000`.

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend runs on `http://localhost:5173`.

## API Endpoints

### `POST /upload_resume`

Accepts a PDF file and returns:

```json
{
  "extracted_skills": ["python", "react"],
  "interview_questions": ["Explain Python decorators."]
}
```

### `POST /evaluate_answer`

Accepts:

```json
{
  "question": "Explain Python decorators.",
  "answer": "Decorators wrap functions to extend behavior."
}
```

Returns:

```json
{
  "score": 78.4,
  "feedback": "Solid answer with a good foundation.",
  "suggestions": [
    "Add one concrete example or implementation detail to make the answer feel more technical."
  ],
  "tags": ["technical_depth_strong", "confidence_strong"],
  "breakdown": {
    "semantic_score": 82.0,
    "confidence_score": 76.0,
    "sentiment_label": "Positive",
    "filler_count": 1,
    "filler_penalty": 4.5
  }
}
```

## Testing

Run the backend tests from the project root:

```bash
python -m pytest
```

## What Makes This Stand Out

- The UI is intentionally product-like, not tutorial-like
- Feedback is structured and explainable instead of being a single opaque score
- The result screen summarizes patterns across the whole interview, not just one answer
- The architecture is modular enough to swap in a more advanced LLM evaluator later

## Future Improvements

- LLM-generated improved answers or coaching prompts
- Voice interview mode with speech-to-text
- User auth and saved interview history
- Rich analytics and recruiter-style competency tracking
- Platform deployment on Vercel + Render/Railway
