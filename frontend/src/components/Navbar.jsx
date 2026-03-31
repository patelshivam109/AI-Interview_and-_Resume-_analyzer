import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useInterview } from "../context/InterviewContext";

const navItems = [
  { label: "Upload", to: "/" },
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
    <header className="sticky top-0 z-40 mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <div className="glass-panel flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <NavLink to="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white shadow-float">
              AI
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">AI Interview Simulator</p>
              <p className="text-xs text-slate-500">
                Practice smarter interviews with focused feedback
              </p>
            </div>
          </NavLink>
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-slate-100/80 p-1 md:flex">
          {navItems.map((item) => {
            const active = location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-white text-ink shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {hasActiveSession && (
            <div className="hidden rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 sm:block">
              {answeredCount}/{totalQuestions} answered
            </div>
          )}
          <button
            type="button"
            onClick={handleResetSession}
            className="button-secondary px-4 py-2.5"
          >
            New Session
          </button>
        </div>
      </div>
    </header>
  );
}
