import { BarChart3, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import ScoreCard from "../components/ScoreCard";
import { useInterview } from "../context/InterviewContext";
import { buildInterviewInsights } from "../utils/interviewInsights";

export default function Result() {
  const navigate = useNavigate();
  const { hasActiveSession, resetSession, state } = useInterview();

  if (!hasActiveSession || !state.feedback.some(Boolean)) {
    return (
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center py-12">
        <Card className="w-full px-8 py-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-faint">No results yet</p>
          <h1 className="mt-4 text-3xl font-semibold">Complete at least one answer first</h1>
          <p className="mt-4 text-base leading-7 text-muted">
            Your interview summary will appear here once an answer has been evaluated.
          </p>
          <Button as={Link} to="/upload" className="mt-8">
            Start New Interview
          </Button>
        </Card>
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
    navigate("/upload");
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_380px]">
        <Card className="px-6 py-8 sm:px-8 sm:py-9" accent>
          <span className="eyebrow">
            <Trophy size={12} />
            Interview results
          </span>
          <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">
            A clearer summary of your interview performance
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            Review technical depth, confidence, delivery quality, and repeated coaching signals
            across the full session.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <ScoreCard
              label="Avg Technical Score"
              value={averageSemantic}
              hint="Prompt alignment across submitted answers."
              tone="blue"
            />
            <ScoreCard
              label="Confidence Score"
              value={averageConfidence}
              hint="How composed and direct your tone sounded."
              tone="emerald"
            />
            <ScoreCard
              label="Avg Filler Words"
              value={averageFillers}
              hint="Lower is usually smoother."
              tone="amber"
              suffix="avg"
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={handleNewSession}>
              <RotateCcw size={16} />
              Restart Interview
            </Button>
            <Button as={Link} to="/upload" variant="secondary">
              Analyze Another Resume
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-accent-600 dark:text-accent-200" />
            <p className="text-sm font-semibold text-faint">Score profile</p>
          </div>

          <div className="mt-6 space-y-5">
            <ProgressBar
              value={averageScore}
              label="Overall average"
              hint="Combined interview score"
            />
            <ProgressBar
              value={averageSemantic}
              label="Technical depth"
              hint="Specificity and prompt relevance"
              colorClass="from-accent-400 to-accent-600"
            />
            <ProgressBar
              value={averageConfidence}
              label="Confidence"
              hint="Tone and directness"
              colorClass="from-emerald-400 to-emerald-600"
            />
            <ProgressBar
              value={Math.max(0, 100 - averageFillers * 10)}
              label="Delivery cleanliness"
              hint="Estimated from filler-word usage"
              colorClass="from-amber-400 to-orange-500"
            />
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm font-semibold text-faint">Strengths</p>
          <div className="mt-4 space-y-3">
            {strengths.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-emerald-200 bg-emerald-50/80 px-4 py-4 text-sm leading-7 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100"
              >
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold text-faint">Weaknesses</p>
          <div className="mt-4 space-y-3">
            {weaknesses.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-amber-200 bg-amber-50/80 px-4 py-4 text-sm leading-7 text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100"
              >
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold text-faint">Suggestions</p>
          <div className="mt-4 space-y-3">
            {suggestions.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-slate-200/80 bg-white/80 px-4 py-4 text-sm leading-7 text-muted dark:border-slate-800 dark:bg-slate-950/55"
              >
                {item}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-faint">Dominant tags</p>
              <h2 className="mt-2 text-2xl font-semibold">Recurring patterns</h2>
            </div>
            <Badge variant="accent">
              <Sparkles size={12} />
              {state.feedback.filter(Boolean).length} answers reviewed
            </Badge>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {topTags.length ? (
              topTags.slice(0, 6).map((item) => (
                <Badge key={item.tag} variant="accent">
                  {item.label} · {item.count}
                </Badge>
              ))
            ) : (
              <Badge variant="neutral">No recurring tags yet</Badge>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold text-faint">Session metadata</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="muted-card px-4 py-4">
              <p className="text-sm text-faint">Questions answered</p>
              <p className="mt-2 text-3xl font-semibold">{state.feedback.filter(Boolean).length}</p>
            </div>
            <div className="muted-card px-4 py-4">
              <p className="text-sm text-faint">Skills detected</p>
              <p className="mt-2 text-3xl font-semibold">{state.extractedSkills.length}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {state.extractedSkills.map((skill) => (
              <Badge key={skill} variant="neutral">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
