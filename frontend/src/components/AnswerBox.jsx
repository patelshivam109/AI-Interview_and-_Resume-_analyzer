import { Mic, Type } from "lucide-react";
import Button from "./Button";

export default function AnswerBox({
  value,
  onChange,
  disabled = false,
  placeholder,
  onVoiceClick,
  voiceLabel = "Voice input",
  voiceEnabled = false,
}) {
  return (
    <div className="soft-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Your Answer
          </h2>
          <p className="mt-1 text-sm text-faint">
            Aim for a direct response with concrete examples where helpful.
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          {value.trim().length} chars
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
          <Type size={13} />
          Structured response mode
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={onVoiceClick}
          className="px-4 py-2.5"
          disabled={disabled}
        >
          <Mic size={16} />
          {voiceEnabled ? "Listening..." : voiceLabel}
        </Button>
      </div>

      <div className="field-shell mt-4 p-1.5">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          rows={10}
          placeholder={placeholder}
          className="min-h-[220px] w-full resize-none rounded-[22px] bg-transparent px-5 py-4 text-base leading-7 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-70 dark:placeholder:text-slate-500"
          style={{ color: "var(--text-primary)" }}
        />
      </div>
    </div>
  );
}
