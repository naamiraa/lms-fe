import GlassCard from "./GlassCard";
export default function AdminWorkflow({
  steps,
}: {
  steps: { title: string; description: string; selection?: string | null }[];
}) {
  return (
    <GlassCard
      as="section"
      className="p-4 sm:p-5"
      aria-label="Management workflow"
    >
      <div
        className={`grid gap-4 ${steps.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}
      >
        {steps.map((step, i) => (
          <div key={step.title} className="flex min-w-0 gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-[#006CB8]">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">{step.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {step.description}
              </p>
              {step.selection && (
                <p className="mt-2 break-words text-xs font-semibold text-[#006CB8]">
                  Selected: {step.selection}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
