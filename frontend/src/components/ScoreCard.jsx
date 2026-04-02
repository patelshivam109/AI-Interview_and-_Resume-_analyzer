import Card from "./Card";

const toneStyles = {
  blue: "from-accent-100/70 via-white to-white dark:from-accent-500/10 dark:via-slate-950 dark:to-slate-950",
  emerald: "from-emerald-100/70 via-white to-white dark:from-emerald-500/10 dark:via-slate-950 dark:to-slate-950",
  amber: "from-amber-100/70 via-white to-white dark:from-amber-500/10 dark:via-slate-950 dark:to-slate-950",
  slate: "from-slate-100/70 via-white to-white dark:from-slate-800 dark:via-slate-950 dark:to-slate-950",
};

export default function ScoreCard({ label, value, hint, tone = "blue", suffix }) {
  return (
    <Card className={`bg-gradient-to-br p-[1px] ${toneStyles[tone]}`}>
      <div className="h-full rounded-[23px] bg-white/95 px-5 py-5 dark:bg-slate-950/90">
        <p className="text-sm font-medium text-faint">{label}</p>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {value}
          </span>
          {typeof value === "number" && (
            <span className="pb-1 text-sm font-medium text-faint">
              {suffix || (label.toLowerCase().includes("filler") ? "count" : "/100")}
            </span>
          )}
        </div>
        <p className="mt-3 text-sm leading-6 text-faint">{hint}</p>
      </div>
    </Card>
  );
}
