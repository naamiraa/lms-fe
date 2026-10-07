import Icon from "@/components/ui/Icon";
export default function Brand({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 ${light ? "text-white" : "text-slate-900"}`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${light ? "border border-white/20 bg-white/15" : "bg-[#006CB8] text-white shadow-lg shadow-blue-900/10"}`}
      >
        <Icon name="shield" width={24} height={24} />
      </span>
      <div>
        <p className="text-sm font-bold tracking-tight sm:text-base">
          Fleet Safety
          <span
            className={`${compact ? "hidden min-[400px]:inline" : ""} font-normal opacity-60`}
          >
            {" "}
            / LMS
          </span>
        </p>
        <p
          className={`${compact ? "hidden sm:block" : ""} mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] ${light ? "text-blue-100" : "text-slate-500"}`}
        >
          Learn. Practice. Drive safely.
        </p>
      </div>
    </div>
  );
}
