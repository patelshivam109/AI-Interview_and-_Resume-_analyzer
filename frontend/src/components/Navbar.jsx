import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Bot, FileText, LayoutGrid, MessageSquareText, RotateCcw, Sparkles } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useInterview } from "../context/InterviewContext";
import Badge from "./Badge";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Upload", to: "/upload" },
  { label: "Interview", to: "/interview" },
  { label: "Results", to: "/result" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answeredCount, hasActiveSession, resetSession, totalQuestions } = useInterview();

  function handleResetSession() {
    resetSession();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <NavLink to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-slate-900 text-white shadow-float">
                <Bot size={18} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  AI Interview Simulator
                </p>
                <p className="truncate text-xs text-faint">
                  Interview prep that feels like a polished SaaS product
                </p>
              </div>
            </NavLink>
          </div>

          <nav className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-white/60 p-1 dark:border-slate-700 dark:bg-slate-900/50 md:flex">
            {navItems.map((item) => {
              const active = location.pathname === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="relative rounded-full px-4 py-2 text-sm font-medium transition"
                  style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}
                >
                  <span className="relative z-10">{item.label}</span>
                  <AnimatePresence>
                    {active ? (
                      <motion.span
                        layoutId="active-nav-pill"
                        className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-slate-800"
                      />
                    ) : null}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {hasActiveSession ? (
              <Badge variant="accent" className="hidden sm:inline-flex">
                <Sparkles size={12} />
                {answeredCount}/{totalQuestions} answered
              </Badge>
            ) : null}

            <ThemeToggle />

            <Button
              type="button"
              variant="secondary"
              onClick={handleResetSession}
              className="hidden sm:inline-flex"
            >
              <RotateCcw size={16} />
              New Session
            </Button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 md:hidden">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            const Icon =
              item.to === "/"
                ? LayoutGrid
                : item.to === "/upload"
                  ? FileText
                  : item.to === "/interview"
                    ? MessageSquareText
                    : BarChart3;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium ${
                  active ? "glass-panel" : "soft-card"
                }`}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <button
            type="button"
            onClick={handleResetSession}
            className="soft-card flex h-[52px] items-center justify-center px-4"
            aria-label="Start a new session"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
