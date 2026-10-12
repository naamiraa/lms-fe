import Link from "next/link";
import Icon, { type IconName } from "@/components/ui/Icon";
import GlassCard from "@/components/shared/GlassCard";
const steps: { label: string; icon: IconName; href?: string }[] = [
  { label: "Learning", icon: "book", href: "/learning" },
  { label: "Assessment", icon: "clipboard", href: "/assessment" },
  { label: "Simulation", icon: "truck", href: "/simulation" },
  { label: "Result", icon: "award" },
];
// Active marks the current screen, not account-wide completion or unlock status.
export default function TrainingJourney({
  active,
}: {
  active?: 0 | 1 | 2 | 3;
}) {
  return (
    <GlassCard className="p-3 sm:p-4">
      <ol
        aria-label="Training stages"
        className="grid grid-cols-4 gap-1 sm:gap-3"
      >
        {steps.map((step, index) => {
          const current = index === active;
          const content = (
            <>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${current ? "bg-[#006CB8] text-white shadow-md shadow-blue-900/15" : "bg-white/80 text-slate-400"}`}
              >
                <Icon name={step.icon} width={18} height={18} />
              </span>
              <span
                className={`text-[10px] font-semibold sm:text-xs ${current ? "text-[#006CB8]" : "text-slate-500"}`}
              >
                {step.label}
              </span>
            </>
          );
          return (
            <li key={step.label} aria-current={current ? "step" : undefined}>
              {step.href ? (
                <Link
                  href={step.href}
                  className={`flex flex-col items-center gap-2 rounded-xl p-2 transition hover:bg-white/70 sm:flex-row sm:justify-center ${current ? "bg-blue-50/90" : ""}`}
                >
                  {content}
                </Link>
              ) : (
                <div
                  className={`flex flex-col items-center gap-2 rounded-xl p-2 sm:flex-row sm:justify-center ${current ? "bg-blue-50/90" : ""}`}
                >
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </GlassCard>
  );
}
