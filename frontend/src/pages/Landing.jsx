import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  ChartNoAxesColumn,
  FileSearch,
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

export default function Landing() {
  return (
    <div className="space-y-10">
      <section className="glass-panel overflow-hidden px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <BadgeCheck size={12} />
              Designed for candidates and recruiters
            </span>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              AI-Powered Interview Simulator
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              Practice role-relevant interviews with a calmer, more credible experience than a
              generic form. Upload a resume, answer tailored prompts, and review structured
              performance signals in minutes.
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
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-accent-100/70 via-white to-cyan-50 blur-2xl dark:from-accent-500/10 dark:via-transparent dark:to-sky-500/10" />
            <Card className="relative p-6 sm:p-7" accent>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-faint">Session preview</p>
                  <h2 className="mt-2 text-2xl font-semibold">Senior frontend screening</h2>
                </div>
                <Badge variant="accent">Live</Badge>
              </div>

              <div className="mt-8 grid gap-4">
                <div className="muted-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">
                    Interview prompt
                  </p>
                  <p className="mt-3 text-base leading-7">
                    How would you improve performance and maintainability in a growing React codebase?
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="muted-card p-4">
                    <p className="text-sm font-medium text-faint">Technical score</p>
                    <p className="mt-3 text-3xl font-semibold">84</p>
                    <p className="mt-2 text-sm text-faint">Strong alignment with the prompt and clear architecture thinking.</p>
                  </div>
                  <div className="muted-card p-4">
                    <p className="text-sm font-medium text-faint">Confidence score</p>
                    <p className="mt-3 text-3xl font-semibold">77</p>
                    <p className="mt-2 text-sm text-faint">Concise delivery with room for a more direct opening.</p>
                  </div>
                </div>

                <div className="muted-card p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-faint">
                    <MessageSquareQuote size={15} />
                    Suggested improvement
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    Lead with your strategy first, then support it with one example around rendering,
                    bundle size, or component ownership.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
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
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-100">
                  <Icon size={18} />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{feature.copy}</p>
              </Card>
            </motion.div>
          );
        })}
      </section>

      <footer className="flex flex-col gap-3 border-t border-slate-200/70 px-1 pt-6 text-sm text-faint dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p>Built for thoughtful interview practice, not noisy AI theatrics.</p>
        <p>React, Tailwind, motion, and a calm SaaS visual system.</p>
      </footer>
    </div>
  );
}
