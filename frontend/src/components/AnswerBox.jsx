export default function AnswerBox({
  value,
  onChange,
  disabled = false,
  placeholder,
}) {
  return (
    <div className="soft-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Your Answer</h2>
          <p className="mt-1 text-sm text-slate-500">
            Aim for a direct response with concrete examples where helpful.
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          {value.trim().length} chars
        </div>
      </div>

      <div className="field-shell mt-5 p-1.5">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          rows={10}
          placeholder={placeholder}
          className="min-h-[220px] w-full resize-none rounded-[22px] bg-transparent px-5 py-4 text-base leading-7 text-slate-700 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>
    </div>
  );
}
