import { cn } from "../utils/cn";

const variants = {
  accent: "bg-accent-50/80 text-accent-700 ring-accent-100 dark:bg-accent-500/10 dark:text-accent-100 dark:ring-accent-400/20",
  neutral: "bg-slate-100/80 text-slate-700 ring-slate-200 dark:bg-slate-800/80 dark:text-slate-200 dark:ring-slate-700",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-400/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-400/20",
};

export default function Badge({ children, variant = "neutral", className = "" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1",
        variants[variant] ?? variants.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}
