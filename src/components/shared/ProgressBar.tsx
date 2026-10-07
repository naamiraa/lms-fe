interface ProgressBarProps {
  value: number;
}
export default function ProgressBar({ value }: ProgressBarProps) {
  const safeValue = Number.isFinite(value)
    ? Math.min(100, Math.max(0, value))
    : 0;
  return (
    <div
      role="progressbar"
      aria-label="Learning progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#006CB8] to-[#36a7dc] transition-all duration-500"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
