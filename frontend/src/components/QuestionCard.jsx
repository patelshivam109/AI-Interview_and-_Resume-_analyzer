export default function QuestionCard({ question, currentIndex, totalQuestions }) {
  const progress = totalQuestions ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <section className="soft-card animate-fade-up p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-700">
            Interview Prompt
          </span>
          <h1 className="mt-4 max-w-3xl text-2xl font-semibold leading-tight sm:text-3xl">
            {question}
          </h1>
        </div>

        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
          <p className="font-semibold text-ink">
            Question {currentIndex + 1} <span className="text-slate-400">of {totalQuestions}</span>
          </p>
          <p className="mt-1">Keep your answer clear, structured, and specific.</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-500 to-slate-900 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
