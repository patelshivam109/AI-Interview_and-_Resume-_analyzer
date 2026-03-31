import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnswerBox from "../components/AnswerBox";
import QuestionCard from "../components/QuestionCard";
import ScoreCard from "../components/ScoreCard";
import { useInterview } from "../context/InterviewContext";
import { evaluateAnswer } from "../services/api";
import { humanizeTag } from "../utils/interviewInsights";

export default function Interview() {
  const navigate = useNavigate();
  const {
    answeredCount,
    hasActiveSession,
    isComplete,
    nextQuestion,
    saveEvaluation,
    state,
    totalQuestions,
  } = useInterview();
  const [answer, setAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState("");

  const questionIndex = Math.min(
    state.currentQuestionIndex,
    Math.max(state.questions.length - 1, 0),
  );
  const currentQuestion = state.questions[questionIndex];
  const currentFeedback = state.feedback[questionIndex];
  const hasSubmitted = Boolean(currentFeedback);

  useEffect(() => {
    if (!hasActiveSession) {
      return;
    }

    if (isComplete) {
      navigate("/result");
      return;
    }

    setAnswer(state.answers[questionIndex] ?? "");
    setError("");
  }, [hasActiveSession, isComplete, navigate, questionIndex, state.answers]);

  if (!hasActiveSession) {
    return (
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center py-10">
        <div className="soft-card w-full px-8 py-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            No Active Session
          </p>
          <h1 className="mt-4 text-3xl font-semibold">Start with a resume upload first</h1>
          <p className="mt-4 text-base leading-7 text-slate-500">
            We need your resume to generate tailored interview questions.
          </p>
          <Link to="/" className="button-primary mt-8">
            Go to Upload
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmitAnswer() {
    if (!answer.trim()) {
      setError("Write your answer before submitting.");
      return;
    }

    setIsEvaluating(true);
    setError("");

    try {
      const result = await evaluateAnswer({
        question: currentQuestion,
        answer: answer.trim(),
      });

      saveEvaluation({
        index: questionIndex,
        answer: answer.trim(),
        result,
      });
    } catch (requestError) {
      const timeoutMessage =
        requestError.code === "ECONNABORTED"
          ? "The first evaluation can take a little longer while the AI model loads. Please retry in a few seconds."
          : null;

      setError(
        timeoutMessage ||
        requestError.response?.data?.detail ||
          requestError.message ||
          "Evaluation failed. Please confirm the backend is available.",
      );
    } finally {
      setIsEvaluating(false);
    }
  }

  function handleNextQuestion() {
    const isLastQuestion = questionIndex === totalQuestions - 1;
    nextQuestion();

    if (isLastQuestion) {
      navigate("/result");
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const qualitySummary =
    currentFeedback?.score >= 80
      ? "This answer is landing strongly."
      : "There’s a good base here, but the answer can still be sharpened.";

  return (
    <div className="grid w-full gap-6 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="space-y-6">
        <QuestionCard
          question={currentQuestion}
          currentIndex={questionIndex}
          totalQuestions={totalQuestions}
        />

        <AnswerBox
          value={answer}
          onChange={setAnswer}
          disabled={isEvaluating || hasSubmitted}
          placeholder="Frame your answer like a polished interview response. Lead with the core idea, then add supporting detail or an example."
        />

        {error && (
          <div className="rounded-2xl bg-rose-50 px-4 py-4 text-sm text-rose-700 ring-1 ring-rose-100">
            <p>{error}</p>
            <button
              type="button"
              onClick={handleSubmitAnswer}
              disabled={isEvaluating}
              className="mt-3 font-semibold text-rose-700 underline decoration-rose-300 underline-offset-4"
            >
              Retry evaluation
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleSubmitAnswer}
            disabled={isEvaluating || hasSubmitted}
            className="button-primary min-w-[180px]"
          >
            {isEvaluating ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Evaluating...
              </span>
            ) : hasSubmitted ? (
              "Answer Submitted"
            ) : (
              "Submit Answer"
            )}
          </button>

          <button
            type="button"
            onClick={handleNextQuestion}
            disabled={!hasSubmitted}
            className={`button-secondary min-w-[180px] ${
              !hasSubmitted ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {questionIndex === totalQuestions - 1 ? "View Results" : "Next Question"}
          </button>
        </div>

        {currentFeedback && (
          <section className="soft-card animate-fade-up p-6 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Live Feedback
                </span>
                <h2 className="mt-3 text-2xl font-semibold">Evaluation snapshot</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{qualitySummary}</p>
              </div>
              <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-float">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Overall
                </p>
                <p className="mt-2 text-3xl font-bold">{currentFeedback.score}</p>
              </div>
            </div>

            <p className="mt-6 rounded-3xl bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600">
              {currentFeedback.feedback}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {currentFeedback.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700"
                >
                  {humanizeTag(tag)}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ScoreCard
                label="Semantic Match"
                value={currentFeedback.breakdown.semantic_score}
                hint="How well your response aligns with the prompt."
                tone="blue"
              />
              <ScoreCard
                label="Confidence"
                value={currentFeedback.breakdown.confidence_score}
                hint={`Tone detected as ${currentFeedback.breakdown.sentiment_label.toLowerCase()}.`}
                tone="emerald"
              />
              <ScoreCard
                label="Filler Words"
                value={currentFeedback.breakdown.filler_count}
                hint={`Penalty applied: ${currentFeedback.breakdown.filler_penalty}.`}
                tone="amber"
              />
            </div>

            <div className="mt-6 rounded-3xl bg-slate-50 px-5 py-5">
              <p className="text-sm font-semibold text-ink">Suggestions</p>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                {currentFeedback.suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200/70"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>

      <aside className="space-y-6">
        <div className="soft-card p-6">
          <p className="text-sm font-semibold text-slate-400">Session</p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-slate-500">Resume</p>
              <p className="mt-1 text-sm font-semibold text-ink">{state.fileName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Answered so far</p>
              <p className="mt-1 text-2xl font-semibold text-ink">
                {answeredCount} <span className="text-base text-slate-400">/ {totalQuestions}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Detected skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {state.extractedSkills.length ? (
                  state.extractedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                    No skills extracted
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="soft-card p-6">
          <p className="text-sm font-semibold text-slate-400">Answer Tips</p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <p className="rounded-2xl bg-slate-50 px-4 py-3">
              Start with a direct answer, then expand into the reasoning.
            </p>
            <p className="rounded-2xl bg-slate-50 px-4 py-3">
              Use one concrete example to make abstract claims believable.
            </p>
            <p className="rounded-2xl bg-slate-50 px-4 py-3">
              If you need time to think, pause instead of filling the silence.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
