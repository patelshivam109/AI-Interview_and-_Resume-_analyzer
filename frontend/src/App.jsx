import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Preloader from "./components/Preloader";
import { InterviewProvider } from "./context/InterviewContext";
import { ThemeProvider } from "./context/ThemeContext";
import Interview from "./pages/Interview";
import Landing from "./pages/Landing";
import Result from "./pages/Result";
import Upload from "./pages/Upload";
import { useEffect, useRef, useState } from "react";

function AppShell() {
  const location = useLocation();
  const firstPaint = useRef(true);
  const [isBooting, setIsBooting] = useState(true);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsBooting(false);
    }, 720);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (firstPaint.current) {
      firstPaint.current = false;
      return undefined;
    }

    setIsRouteLoading(true);

    const timeoutId = window.setTimeout(() => {
      setIsRouteLoading(false);
    }, 420);

    return () => window.clearTimeout(timeoutId);
  }, [location.key]);

  const isLoading = isBooting || isRouteLoading;

  return (
    <div className="app-shell">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="grain-overlay" />
        <div className="absolute left-[-140px] top-20 h-72 w-[420px] rotate-[-14deg] rounded-full bg-accent-200/50 blur-3xl dark:bg-accent-500/18" />
        <div className="absolute right-[-120px] top-2 h-80 w-[380px] rotate-12 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-300/10" />
        <div className="absolute bottom-[-120px] left-1/4 h-72 w-[460px] rotate-[-8deg] rounded-full bg-amber-200/50 blur-3xl dark:bg-cyan-300/10" />
      </div>

      <Navbar />

      <main className="page-shell">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(14px)" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<Landing />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/result" element={<Result />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Preloader
        open={isLoading}
        title={isBooting ? "Booting the interview engine" : "Loading the next view"}
        detail={
          isBooting
            ? "Restoring your workspace and preparing the AI interview environment."
            : "Synchronizing route state and preparing the next screen."
        }
        messages={
          isBooting
            ? [
                "Restoring your interview workspace...",
                "Syncing theme and session state...",
                "Initializing the AI interview flow...",
              ]
            : [
                "Updating the next screen...",
                "Keeping the session in sync...",
                "Shifting to the next step...",
              ]
        }
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <InterviewProvider>
          <AppShell />
        </InterviewProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
