export default function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase().replace(/ /g, "_");
  const positive = [
    "PASS",
    "PASSED",
    "COMPLETED",
    "ACTIVE",
    "APPROVED",
  ].includes(normalized);
  const negative = [
    "FAIL",
    "FAILED",
    "REJECTED",
    "INACTIVE",
    "CANCELLED",
  ].includes(normalized);
  const pending = ["PENDING", "IN_PROGRESS", "WAITING"].includes(normalized);
  const colors = positive
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : negative
      ? "border-red-200 bg-red-50 text-red-700"
      : pending
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-slate-200 bg-slate-50 text-slate-600";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${colors}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-current"
        aria-hidden="true"
      />
      {status.replace(/_/g, " ")}
    </span>
  );
}
