import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileUp,
  FolderUp,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import Preloader from "../components/Preloader";
import { useInterview } from "../context/InterviewContext";
import { uploadResume } from "../services/api";

export default function Upload() {
  const navigate = useNavigate();
  const { answeredCount, hasActiveSession, resetSession, startSession, totalQuestions } =
    useInterview();
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const detectedSkills = analysis?.extracted_skills ?? [];
  const generatedQuestions = analysis?.interview_questions ?? [];

  const statusMessage = useMemo(() => {
    if (analysis) {
      return `${generatedQuestions.length} tailored question${generatedQuestions.length === 1 ? "" : "s"} ready`;
    }

    if (selectedFile) {
      return "Resume selected. Analyze it to extract skills and build the interview.";
    }

    return "Drag a PDF here or browse locally to start.";
  }, [analysis, generatedQuestions.length, selectedFile]);

  function handleFileSelection(file) {
    if (!file) {
      return;
    }

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Please upload a PDF resume to continue.");
      return;
    }

    setSelectedFile(file);
    setAnalysis(null);
    setError("");
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    handleFileSelection(event.dataTransfer.files?.[0]);
  }

  async function handleAnalyzeResume() {
    if (!selectedFile) {
      setError("Select a PDF resume first.");
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

      setAnalysis(data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          requestError.message ||
          "Resume analysis failed. Please confirm the backend is available.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  function handleContinue() {
    if (!analysis || !selectedFile) {
      return;
    }

    startSession({
      fileName: selectedFile.name,
      extractedSkills: analysis.extracted_skills ?? [],
      questions: analysis.interview_questions ?? [],
    });

    navigate("/interview");
  }

  return (
    <div className="space-y-8">
      <Preloader
        open={isUploading}
        title="Analyzing your resume"
        detail="Extracting skills, building question paths, and shaping the interview session."
        messages={[
          "Reading the resume structure...",
          "Extracting skills and experience...",
          "Generating tailored interview questions...",
        ]}
      />

      <section className="glass-panel overflow-hidden px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <Sparkles size={12} />
              Resume Upload
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
              Turn a resume into a tailored interview flow
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-muted">
              Upload once, review extracted skills, then move into a guided interview with
              cleaner prompts and structured scoring.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                "Analyze PDF resume",
                "Extract likely skills",
                "Generate focused questions",
              ].map((item) => (
                <div key={item} className="muted-card px-4 py-4 text-sm font-medium text-muted">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card className="p-5 sm:p-6" accent>
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`rounded-[28px] border border-dashed p-6 text-center transition duration-200 ${
                isDragging
                  ? "border-accent-400 bg-accent-50/70 dark:bg-accent-500/10"
                  : "border-slate-300/70 bg-white/65 dark:border-slate-700 dark:bg-slate-950/40"
              }`}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-slate-900 text-white shadow-float">
                <FolderUp size={18} />
              </div>
              <h2 className="mt-4 text-xl font-semibold">Upload your resume</h2>
              <p className="mt-2 text-sm leading-6 text-faint">{statusMessage}</p>

              <label className="button-secondary mt-6 cursor-pointer">
                <FileUp size={16} />
                Choose PDF
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(event) => handleFileSelection(event.target.files?.[0])}
                />
              </label>

              <div className="mt-5 rounded-[24px] border border-slate-200/80 bg-white/85 px-4 py-4 text-left dark:border-slate-700 dark:bg-slate-950/60">
                {selectedFile ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {selectedFile.name}
                      </p>
                      <p className="mt-1 text-xs text-faint">
                        {Math.max(1, Math.round(selectedFile.size / 1024))} KB uploaded
                      </p>
                    </div>
                    <Badge variant={analysis ? "success" : "neutral"}>
                      {analysis ? "Analyzed" : "Ready"}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-sm text-faint">No file selected yet.</p>
                )}
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={handleAnalyzeResume}
                disabled={!selectedFile || isUploading}
                className="min-w-[190px]"
              >
                <ScanSearch size={16} />
                {isUploading ? "Analyzing Resume" : "Analyze Resume"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleContinue}
                disabled={!analysis}
                className="min-w-[190px]"
              >
                Continue to Interview
                <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-faint">Extracted skills</p>
              <h2 className="mt-2 text-2xl font-semibold">Resume summary</h2>
            </div>
            <Badge variant={detectedSkills.length ? "accent" : "neutral"}>
              {detectedSkills.length} skills
            </Badge>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {detectedSkills.length ? (
              detectedSkills.map((skill) => (
                <Badge key={skill} variant="accent">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-faint">
                Analyze the resume to display extracted skills here.
              </p>
            )}
          </div>

          {analysis ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-[24px] border border-emerald-200 bg-emerald-50/80 px-5 py-5 dark:border-emerald-400/20 dark:bg-emerald-500/10"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 text-emerald-600 dark:text-emerald-300" size={18} />
                <div>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                    Analysis complete
                  </p>
                  <p className="mt-2 text-sm leading-7 text-emerald-700 dark:text-emerald-100/90">
                    Your interview session is ready with {generatedQuestions.length} questions based
                    on the uploaded resume.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </Card>

        <Card className="p-6 sm:p-7">
          <p className="text-sm font-semibold text-faint">Question preview</p>
          <h2 className="mt-2 text-2xl font-semibold">What the session will feel like</h2>

          <div className="mt-6 space-y-3">
            {generatedQuestions.length ? (
              generatedQuestions.slice(0, 3).map((question, index) => (
                <div
                  key={question}
                  className="rounded-[22px] border border-slate-200/80 bg-white/70 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/50"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">
                    Prompt {index + 1}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted">{question}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-slate-300 px-4 py-8 text-sm text-faint dark:border-slate-700">
                Once analyzed, your first few interview prompts will appear here.
              </div>
            )}
          </div>
        </Card>
      </div>

      {hasActiveSession ? (
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-faint">Active session</p>
              <h2 className="mt-2 text-2xl font-semibold">You already have an interview in progress</h2>
              <p className="mt-2 text-sm text-muted">
                {answeredCount} of {totalQuestions} questions completed.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button as="button" type="button" onClick={() => navigate("/interview")}>
                Resume Interview
              </Button>
              <Button type="button" variant="secondary" onClick={resetSession}>
                Discard Session
              </Button>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
