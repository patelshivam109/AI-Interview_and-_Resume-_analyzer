import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Badge from "./Badge";

export default function QuestionCard({ question, currentIndex, totalQuestions }) {
  const progress = totalQuestions ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <section className="glass-panel p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">
            <Sparkles size={12} />
            Interview Prompt
          </span>
          <h1 className="mt-4 max-w-3xl text-2xl font-semibold leading-tight sm:text-3xl lg:text-[2.15rem]">
            {question}
          </h1>
        </div>

        <div className="muted-card px-4 py-3 text-sm">
          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Question {currentIndex + 1} <span className="text-faint">of {totalQuestions}</span>
          </p>
          <p className="mt-1 text-faint">Keep your answer clear, structured, and specific.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3 text-sm">
            <span className="text-faint">Interview progress</span>
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/80">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-accent-400 via-accent-500 to-slate-900"
            />
          </div>
        </div>

        <Badge variant="neutral" className="justify-center">
          <ArrowUpRight size={12} />
          Answer with one example and one insight
        </Badge>
      </div>
    </section>
  );
}
