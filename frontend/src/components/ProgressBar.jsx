import { motion } from "framer-motion";

export default function ProgressBar({
  value,
  max = 100,
  label,
  hint,
  colorClass = "from-accent-400 to-accent-600",
}) {
  const progress = Math.max(0, Math.min((value / max) * 100, 100));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {label}
          </p>
          {hint ? <p className="mt-1 text-xs text-faint">{hint}</p> : null}
        </div>
        <span className="text-sm font-semibold text-faint">{value}</span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/80">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
        />
      </div>
    </div>
  );
}
