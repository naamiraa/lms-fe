import { getTrainingImage } from "@/lib/training-visuals";
import Icon from "@/components/ui/Icon";
export default function DomainSelectionCard({
  name,
  description,
  count,
  selected,
  onSelect,
}: {
  name: string;
  description: string | null;
  count: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`training-tile group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl border-2 p-6 text-left text-white transition ${selected ? "border-[#006CB8] ring-4 ring-[#006CB8]/20" : "border-white/80 hover:border-[#006CB8]"}`}
    >
      <img
        src={getTrainingImage(name)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#051522] via-[#051522]/45 to-transparent" />
      <span
        className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/50 ${selected ? "bg-[#006CB8] text-white" : "bg-slate-950/30 text-transparent"}`}
        aria-hidden="true"
      >
        ✓
      </span>
      <div className="relative w-full">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
          Operational domain
        </p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight">{name}</h3>
        {description && (
          <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/80">
            {description}
          </p>
        )}
        <p className="mt-3 text-xs text-white/70">
          {count} training scenario{count === 1 ? "" : "s"}
        </p>
        <span
          className={`mt-4 flex min-h-11 items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold ${selected ? "bg-[#006CB8]" : "border border-white/30 bg-white/15 backdrop-blur-md"}`}
        >
          {selected ? "Domain selected" : "Select domain"}
          <Icon name="arrow" width={17} height={17} />
        </span>
      </div>
    </button>
  );
}
