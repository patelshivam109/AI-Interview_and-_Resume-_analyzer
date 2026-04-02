import { Mic, SendHorizontal, Sparkles, WandSparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnswerBox from "../components/AnswerBox";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import Loader from "../components/Loader";
import ProgressBar from "../components/ProgressBar";
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
  const [voiceNotice, setVoiceNotice] = useState("");

  const questionIndex = Math.min(
    state.currentQuestionIndex,
    Math.max(state.questions.length - 1, 0),
  );
  const currentQuestion = state.questions[questionIndex];
  const currentFeedback = state.feedback[questionIndex];
  const hasSubmitted = Boolean(currentFeedback);
  const completionPercent = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0;

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
    setVoiceNotice("");
  }, [hasActiveSession, isComplete, navigate, questionIndex, state.answers]);

  const qualitySummary = useMemo(() => {
    if (!currentFeedback) {
      return "Submit your response to see a live evaluation snapshot.";
    }

    if (currentFeedback.score >= 80) {
      return "This answer is landing strongly and reads as well structured.";
    }

    if (currentFeedback.score >= 65) {
      return "There is a solid foundation here with room to tighten precision.";
    }

    return "The answer has promise, but it would benefit from more structure and depth.";
  }, [currentFeedback]);

  if (!hasActiveSession) {
    return (
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center py-12">
        <Card className="w-full px-8 py-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-faint">No active session</p>
          <h1 className="mt-4 text-3xl font-semibold">Start with a resume upload first</h1>
          <p className="mt-4 text-base leading-7 text-muted">
            We need your resume to generate tailored interview questions.
          </p>
          <Button as={Link} to="/upload" className="mt-8">
            Go to Upload
          </Button>
        </Card>
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
          ? "The first evaluation can take a little longer while the model loads. Please retry in a few seconds."
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

  function handleVoiceClick() {
    setVoiceNotice("Voice capture UI is ready, but browser recording is not connected yet.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_380px]">
      <div className="space-y-6">
        <QuestionCard
          question={currentQuestion}
          currentIndex={questionIndex}
          totalQuestions={totalQuestions}
        />

        <Card className="p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-faint">Answer composer</p>
              <h2 className="mt-2 text-2xl font-semibold">Draft a clear, confident response</h2>
            </div>
            <Badge variant="neutral">
              <Mic size={12} />
              Question {questionIndex + 1}/{totalQuestions}
            </Badge>
          </div>

          <AnswerBox
            value={answer}
            onChange={setAnswer}
            disabled={isEvaluating || hasSubmitted}
            onVoiceClick={handleVoiceClick}
            voiceLabel="Voice Input"
            placeholder="Lead with your answer, then support it with specifics. Mention tradeoffs, a concrete example, or the outcome of your approach."
          />

          {voiceNotice ? (
            <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-200">
              {voiceNotice}
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={handleSubmitAnswer}
              disabled={isEvaluating || hasSubmitted}
              className="min-w-[180px]"
            >
              {isEvaluating ? (
                <Loader label="Evaluating answer" />
              ) : hasSubmitted ? (
                <>
                  <Sparkles size={16} />
                  Answer Submitted
                </>
              ) : (
                <>
                  <SendHorizontal size={16} />
                  Submit Answer
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleNextQuestion}
              disabled={!hasSubmitted}
              className="min-w-[180px]"
            >
              {questionIndex === totalQuestions - 1 ? "View Results" : "Next Question"}
            </Button>
          </div>
        </Card>

        <Card className="p-6 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="eyebrow">
                <WandSparkles size={12} />
                Live evaluation panel
              </span>
              <h2 className="mt-4 text-2xl font-semibold">Feedback after each answer</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{qualitySummary}</p>
            </div>
            <div className="rounded-[26px] bg-slate-950 px-5 py-4 text-white shadow-float dark:bg-accent-500/15 dark:text-accent-50">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70 dark:text-accent-100/70">
                Overall
              </p>
              <p className="mt-2 text-3xl font-semibold">{currentFeedback?.score ?? "--"}</p>
            </div>
          </div>

          {currentFeedback ? (
            <>
              <p className="mt-6 rounded-[24px] border border-slate-200/80 bg-white/80 px-5 py-4 text-sm leading-7 text-muted dark:border-slate-800 dark:bg-slate-950/55">
                {currentFeedback.feedback}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {currentFeedback.tags.map((tag) => (
                  <Badge key={tag} variant="accent">
                    {humanizeTag(tag)}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <ScoreCard
                  label="Technical Score"
                  value={currentFeedback.breakdown.semantic_score}
                  hint="How closely your answer matches the prompt."
                  tone="blue"
                />
                <ScoreCard
                  label="Confidence Score"
                  value={currentFeedback.breakdown.confidence_score}
                  hint={`Detected tone: ${currentFeedback.breakdown.sentiment_label.toLowerCase()}.`}
                  tone="emerald"
                />
                <ScoreCard
                  label="Filler Words"
                  value={currentFeedback.breakdown.filler_count}
                  hint={`Penalty applied: ${currentFeedback.breakdown.filler_penalty}.`}
                  tone="amber"
                  suffix="count"
                />
              </div>

              <div className="mt-6 rounded-[24px] border border-slate-200/80 bg-white/80 px-5 py-5 dark:border-slate-800 dark:bg-slate-950/55">
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Suggestions
                </p>
                <div className="mt-4 space-y-3">
                  {currentFeedback.suggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm leading-6 text-muted dark:border-slate-800 dark:bg-slate-900/70"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 px-5 py-8 text-sm text-faint dark:border-slate-700">
              Submit your answer to unlock technical scoring, confidence analysis, and tailored suggestions.
            </div>
          )}
        </Card>
      </div>

      <aside className="space-y-6">
        <Card className="p-6">
          <p className="text-sm font-semibold text-faint">Session progress</p>
          <h2 className="mt-2 text-2xl font-semibold">Stay on track</h2>

          <div className="mt-6 space-y-5">
            <ProgressBar
              value={completionPercent}
              label="Interview completion"
              hint={`${answeredCount} of ${totalQuestions} questions evaluated`}
            />
            <ProgressBar
              value={questionIndex + 1}
              max={Math.max(totalQuestions, 1)}
              label="Current position"
              hint="Moves forward after each submitted answer"
              colorClass="from-sky-400 to-cyan-500"
            />
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold text-faint">Session details</p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-faint">Resume</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {state.fileName}
              </p>
            </div>
            <div>
              <p className="text-sm text-faint">Detected skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {state.extractedSkills.length ? (
                  state.extractedSkills.map((skill) => (
                    <Badge key={skill} variant="accent">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="neutral">No extracted skills</Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold text-faint">Interview advice</p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
            <div className="muted-card px-4 py-3">Start with the direct answer before expanding.</div>
            <div className="muted-card px-4 py-3">Use one concrete example to make your reasoning credible.</div>
            <div className="muted-card px-4 py-3">If you need time to think, pause instead of filling silence.</div>
          </div>
        </Card>
      </aside>
    </div>
  );
}
