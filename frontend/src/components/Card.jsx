import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export default function Card({ children, className = "", accent = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        accent ? "glass-panel" : "soft-card",
        "overflow-hidden",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
