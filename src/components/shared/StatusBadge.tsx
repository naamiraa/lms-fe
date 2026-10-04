interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  const style =
    normalized === "PASS"
      ? "bg-emerald-50 text-emerald-700"
      : normalized === "FAIL"
        ? "bg-red-50 text-red-700"
        : "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
}