import { motion } from "framer-motion";

export default function Loader({ label = "Loading", className = "" }) {
  return (
    <span className={`inline-flex items-center gap-3 text-sm font-medium text-faint ${className}`}>
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
        className="h-4 w-4 rounded-full border-2 border-accent-200 border-t-accent-500 dark:border-accent-500/30 dark:border-t-accent-200"
      />
      <span>{label}</span>
    </span>
  );
}
