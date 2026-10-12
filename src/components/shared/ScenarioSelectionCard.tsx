import type { SimulationScenario } from "@/types/simulation";
import Icon from "@/components/ui/Icon";
export default function ScenarioSelectionCard({
  scenario,
  selected,
  number,
  onSelect,
}: {
  scenario: SimulationScenario;
  selected: boolean;
  number: number;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`group relative flex w-full gap-4 rounded-2xl border p-5 text-left shadow-sm transition ${selected ? "border-[#006CB8] bg-blue-50 ring-4 ring-[#006CB8]/10" : "border-white bg-white/90 hover:border-[#006CB8]/40 hover:shadow-lg"}`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${selected ? "bg-[#006CB8] text-white" : "bg-blue-50 text-[#006CB8]"}`}
      >
        <Icon name="truck" width={24} height={24} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#006CB8]">
          Mission {String(number).padStart(2, "0")}
        </span>
        <span className="mt-1 block text-base font-bold text-slate-900">
          {scenario.name}
        </span>
        <span className="mt-2 block text-sm leading-6 text-slate-500">
          {scenario.description}
        </span>
        <span className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-700">
            {scenario.difficulty}
          </span>
          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-600">
            {scenario.estimatedMinutes} min
          </span>
          <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-[#006CB8]">
            {selected ? "✓ Selected" : "Select mission →"}
          </span>
        </span>
      </span>
    </button>
  );
}
