import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../context/InterviewContext";
import { uploadResume } from "../services/api";

export default function Upload() {
  const navigate = useNavigate();
  const { answeredCount, hasActiveSession, resetSession, startSession, totalQuestions } =
    useInterview();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  function handleFileSelection(file) {
    if (!file) {
      return;
    }

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Please upload a PDF resume to start the interview.");
      return;
    }

    setError("");
    setSelectedFile(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    handleFileSelection(event.dataTransfer.files?.[0]);
  }

  async function handleStartInterview() {
    if (!selectedFile) {
      setError("Select a resume first so we can generate tailored questions.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const data = await uploadResume(selectedFile);
      const questions = data.interview_questions ?? [];

      if (!questions.length) {
        throw new Error("No questions were returned for this resume.");
      }

      startSession({
        fileName: selectedFile.name,
        extractedSkills: data.extracted_skills ?? [],
        questions,
      });

      navigate("/interview");
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          requestError.message ||
          "The upload failed. Please make sure the backend is running on port 8000.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl items-center py-8 sm:py-12">
      <section className="glass-panel w-full overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="animate-fade-up">
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent-700 ring-1 ring-accent-100">
              AI Practice Studio
            </span>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
              Practice smarter interviews with a polished AI coach
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Upload your resume, generate tailored interview prompts, and get structured
              feedback that feels closer to a real mock interview than a static form.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                "Resume-aware prompts",
                "Smart scoring with tags",
                "Actionable result summary",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/75 px-4 py-4 ring-1 ring-white/80">
                  <p className="text-sm font-medium text-slate-600">{item}</p>
                </div>
              ))}
            </div>

            {hasActiveSession && (
              <div className="mt-8 rounded-[28px] bg-slate-950 px-6 py-6 text-white shadow-float">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Active Session
                </p>
                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold">You already have an interview in progress.</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {answeredCount} of {totalQuestions} questions completed.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/interview")}
                      className="button-secondary border-none bg-white px-4 py-2.5 text-slate-900"
                    >
                      Continue
                    </button>
                    <button
                      type="button"
                      onClick={resetSession}
                      className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-white/85 ring-1 ring-white/20 transition hover:bg-white/10"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="soft-card animate-fade-up p-5 sm:p-6">
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`rounded-[28px] border border-dashed p-6 text-center transition duration-200 ${
                isDragging
                  ? "border-accent-500 bg-accent-50/80 shadow-float"
                  : "border-slate-300 bg-slate-50/80 hover:-translate-y-0.5 hover:border-slate-400"
              }`}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-lg font-bold text-ink shadow-sm">
                PDF
              </div>
              <h2 className="mt-4 text-xl font-semibold text-ink">Upload your resume</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Drag and drop a PDF here, or browse from your computer.
              </p>

              <label className="button-secondary mt-6 cursor-pointer">
                Choose File
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(event) => handleFileSelection(event.target.files?.[0])}
                />
              </label>

              <div className="mt-5 min-h-14 rounded-2xl bg-white/90 px-4 py-4 text-left ring-1 ring-slate-200/80">
                {selectedFile ? (
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{selectedFile.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Ready to generate a tailored interview session.
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Ready
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No file selected yet.</p>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-4 text-sm text-rose-700 ring-1 ring-rose-100">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={handleStartInterview}
                  disabled={!selectedFile || isUploading}
                  className="mt-3 font-semibold text-rose-700 underline decoration-rose-300 underline-offset-4"
                >
                  Retry upload
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleStartInterview}
              disabled={isUploading}
              className="button-primary mt-6 w-full"
            >
              {isUploading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Preparing interview...
                </span>
              ) : (
                "Start Interview"
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
