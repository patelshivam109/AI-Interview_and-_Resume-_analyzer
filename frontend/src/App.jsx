import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { InterviewProvider } from "./context/InterviewContext";
import Interview from "./pages/Interview";
import Result from "./pages/Result";
import Upload from "./pages/Upload";

function AppShell() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white/70 to-transparent" />
      <div className="pointer-events-none absolute left-[-120px] top-24 h-72 w-72 rounded-full bg-accent-100/60 blur-3xl" />
      <div className="pointer-events-none absolute right-[-140px] top-10 h-80 w-80 rounded-full bg-slate-200/80 blur-3xl" />

      <Navbar />

      <main className="relative mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Upload />} />
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
      <InterviewProvider>
        <AppShell />
      </InterviewProvider>
    </BrowserRouter>
  );
}
