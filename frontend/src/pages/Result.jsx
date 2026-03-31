import { Link, useNavigate } from "react-router-dom";
import ScoreCard from "../components/ScoreCard";
import { useInterview } from "../context/InterviewContext";
import { buildInterviewInsights } from "../utils/interviewInsights";

export default function Result() {
  const navigate = useNavigate();
  const { hasActiveSession, resetSession, state } = useInterview();

  if (!hasActiveSession || !state.feedback.some(Boolean)) {
    return (
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center py-10">
        <div className="soft-card w-full px-8 py-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            No Results Yet
          </p>
          <h1 className="mt-4 text-3xl font-semibold">Complete at least one answer first</h1>
          <p className="mt-4 text-base leading-7 text-slate-500">
            Your session summary will appear here once an answer has been evaluated.
          </p>
          <Link to="/" className="button-primary mt-8">
            Start New Interview
          </Link>
        </div>
      </div>
    );
  }

  const {
    averageConfidence,
    averageFillers,
    averageScore,
    averageSemantic,
    strengths,
    suggestions,
    topTags,
    weaknesses,
  } = buildInterviewInsights(state);

  function handleNewSession() {
    resetSession();
    navigate("/");
  }

  return (
    <div className="mx-auto w-full max-w-6xl py-4">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-panel overflow-hidden px-6 py-8 sm:px-8 sm:py-9">
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-700 ring-1 ring-accent-100">
            Session Summary
          </span>
          <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">Interview results</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            A polished view of your interview performance across technical depth,
            confidence, and communication quality.
          </p>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-white shadow-lg shadow-slate-200/70">
              <div className="text-center">
                <p className="text-4xl font-bold text-ink">{averageScore}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Average Score
                </p>
              </div>
            </div>

            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <ScoreCard
                label="Semantic Average"
                value={averageSemantic}
                hint="How consistently your answers matched the prompt intent."
                tone="blue"
              />
              <ScoreCard
                label="Confidence Average"
                value={averageConfidence}
                hint="How composed and direct your tone sounded overall."
                tone="emerald"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={handleNewSession} className="button-primary">
              Start New Interview
            </button>
          </div>
        </section>

        <section className="soft-card p-6 sm:p-7">
          <p className="text-sm font-semibold text-slate-400">At a glance</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <ScoreCard
              label="Questions Answered"
              value={state.feedback.filter(Boolean).length}
              hint="Completed prompts in this interview run."
              tone="slate"
            />
            <ScoreCard
              label="Avg Filler Words"
              value={averageFillers}
              hint="Lower values usually sound more polished."
              tone="amber"
            />
            <ScoreCard
              label="Skills Detected"
              value={state.extractedSkills.length}
              hint="Pulled from your uploaded resume."
              tone="blue"
            />
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-500">Dominant feedback tags</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {topTags.length ? (
                topTags.slice(0, 5).map((item) => (
                  <span
                    key={item.tag}
                    className="rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700"
                  >
                    {item.label} · {item.count}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  No tags yet
                </span>
              )}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-500">Skills focus</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {state.extractedSkills.length ? (
                state.extractedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  No extracted skills available
                </span>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="soft-card p-6">
          <h2 className="text-xl font-semibold">Strengths</h2>
          <div className="mt-4 space-y-3">
            {strengths.map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="soft-card p-6">
          <h2 className="text-xl font-semibold">Weaknesses</h2>
          <div className="mt-4 space-y-3">
            {weaknesses.map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="soft-card p-6">
          <h2 className="text-xl font-semibold">Suggestions</h2>
          <div className="mt-4 space-y-3">
            {suggestions.map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
