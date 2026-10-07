export default function LoadingState({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div
      className="flex min-h-64 flex-col items-center justify-center gap-4"
      role="status"
    >
      <span
        className="h-8 w-8 animate-spin rounded-full border-[3px] border-blue-100 border-t-[#006CB8]"
        aria-hidden="true"
      />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
