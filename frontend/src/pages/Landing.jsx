import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  ChartNoAxesColumn,
  FileSearch,
  Gauge,
  MessageSquareQuote,
} from "lucide-react";
import { Link } from "react-router-dom";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";

const features = [
  {
    icon: FileSearch,
    title: "Resume-aware analysis",
    copy: "Extract relevant skills and turn a resume into focused interview prompts that feel personalized.",
  },
  {
    icon: BrainCircuit,
    title: "Live answer scoring",
    copy: "Review technical alignment, confidence, and filler usage as soon as each answer is submitted.",
  },
  {
    icon: ChartNoAxesColumn,
    title: "Structured results",
    copy: "Summarize recurring strengths, weaknesses, and suggestions in a recruiter-friendly report.",
  },
];

const proofPoints = [
  "Tailored prompt generation",
  "Evaluation snapshots per answer",
  "Clear summaries for candidates and recruiters",
];

const metrics = [
  { label: "Median prep time", value: "17m" },
  { label: "Answer turns analyzed", value: "1.2K+" },
  { label: "Bias toward clarity", value: "92%" },
];

export default function Landing() {
  return (
    <div className="space-y-10">
      <section className="glass-panel relative overflow-hidden px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        <div className="pointer-events-none absolute -top-24 right-8 h-52 w-52 rounded-full bg-accent-200/50 blur-3xl dark:bg-accent-500/15" />
        <div className="pointer-events-none absolute -bottom-14 left-16 h-52 w-52 rounded-full bg-emerald-200/45 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <BadgeCheck size={12} />
              Studio-grade interview practice
            </span>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.04] sm:text-5xl lg:text-6xl">
              Interview prep with <span className="text-accent-600 dark:text-accent-200">editorial clarity</span>,
              not generic AI noise.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              Upload a resume and run a focused simulation where each answer is scored for technical
              precision, confidence, and communication quality. The interface stays calm while the
              feedback stays sharp.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/upload" className="min-w-[190px]">
                Start Interview
                <ArrowRight size={16} />
              </Button>
              <Button as={Link} to="/upload" variant="secondary" className="min-w-[190px]">
                Upload Resume
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {proofPoints.map((point) => (
                <Badge key={point} variant="neutral">
                  {point}
                </Badge>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative"
          >
            <Card className="relative border border-white/40 p-6 sm:p-7 dark:border-white/10" accent>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-faint">Practice console</p>
                  <h2 className="mt-2 text-2xl font-semibold">Senior frontend screening</h2>
                </div>
                <Badge variant="accent">Live</Badge>
              </div>

              <div className="mt-8 grid gap-4">
                <div className="muted-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">Interview prompt</p>
                  <p className="mt-3 text-base leading-7">
                    What architecture decisions improve performance in a fast-growing React product?
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="muted-card p-4">
                    <p className="text-sm font-medium text-faint">Technical</p>
                    <div className="mt-3 flex items-end justify-between gap-2">
                      <p className="text-3xl font-semibold">84</p>
                      <Gauge size={16} className="text-accent-600 dark:text-accent-200" />
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-200/70 dark:bg-slate-800">
                      <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-accent-400 to-accent-600" />
                    </div>
                  </div>
                  <div className="muted-card p-4">
                    <p className="text-sm font-medium text-faint">Confidence</p>
                    <div className="mt-3 flex items-end justify-between gap-2">
                      <p className="text-3xl font-semibold">77</p>
                      <Gauge size={16} className="text-emerald-600 dark:text-emerald-300" />
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-200/70 dark:bg-slate-800">
                      <div className="h-full w-[77%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500" />
                    </div>
                  </div>
                </div>

                <div className="muted-card p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-faint">
                    <MessageSquareQuote size={15} />
                    Suggested revision
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    Lead with your strategy in one line, then back it up with one concrete tradeoff
                    and one measurable outcome.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.35 }}
            className="soft-card px-5 py-5"
          >
            <p className="font-display text-sm uppercase tracking-[0.2em] text-faint">{item.label}</p>
            <p className="mt-3 text-4xl font-semibold" style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
              {item.value}
            </p>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.35 }}
            >
              <Card className="h-full p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-200/70 bg-accent-50 text-accent-700 dark:border-accent-300/20 dark:bg-accent-500/10 dark:text-accent-100">
                  <Icon size={18} />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{feature.copy}</p>
              </Card>
            </motion.div>
          );
        })}
      </section>

      <footer className="flex flex-col gap-3 border-t border-slate-300/70 px-1 pt-6 text-sm text-faint dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
        <p>Built for thoughtful interview practice, not shiny dashboard theater.</p>
        <p>Resume-aware prompts, clear scoring, and a design language with intent.</p>
      </footer>
    </div>
  );
}
