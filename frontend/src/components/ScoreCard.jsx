const toneStyles = {
  blue: "from-accent-100 via-white to-white text-accent-700",
  emerald: "from-emerald-100 via-white to-white text-emerald-700",
  amber: "from-amber-100 via-white to-white text-amber-700",
  slate: "from-slate-100 via-white to-white text-slate-700",
};

export default function ScoreCard({ label, value, hint, tone = "blue" }) {
  return (
    <div
      className={`rounded-3xl bg-gradient-to-br p-[1px] shadow-sm shadow-slate-200/70 ${toneStyles[tone]}`}
    >
      <div className="h-full rounded-[23px] bg-white/95 px-5 py-5">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-3xl font-bold tracking-tight text-ink">{value}</span>
          {typeof value === "number" && (
            <span className="pb-1 text-sm font-medium text-slate-400">
              {label.toLowerCase().includes("filler") ? "count" : "/100"}
            </span>
          )}
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-500">{hint}</p>
      </div>
    </div>
  );
}
