import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { InterviewProvider } from "./context/InterviewContext";
import { ThemeProvider } from "./context/ThemeContext";
import Interview from "./pages/Interview";
import Landing from "./pages/Landing";
import Result from "./pages/Result";
import Upload from "./pages/Upload";

function AppShell() {
  return (
    <div className="app-shell">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="absolute left-[-120px] top-16 h-72 w-72 rounded-full bg-accent-100/60 blur-3xl dark:bg-accent-500/15" />
        <div className="absolute right-[-140px] top-0 h-80 w-80 rounded-full bg-slate-300/70 blur-3xl dark:bg-sky-400/10" />
        <div className="absolute bottom-[-120px] left-1/3 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl dark:bg-accent-400/10" />
      </div>

      <Navbar />

      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </main>
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
