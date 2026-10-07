import GlassCard from "@/components/shared/GlassCard";
import Icon, { type IconName } from "@/components/ui/Icon";
interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  detail?: string;
  icon?: IconName;
}
export default function MetricCard({
  label,
  value,
  description,
  detail,
  icon,
}: MetricCardProps) {
  const inferred: IconName =
    icon ??
    (/learning|module|content/i.test(label)
      ? "book"
      : /participant|instructor|user/i.test(label)
        ? "users"
        : /certificate/i.test(label)
          ? "award"
          : /simulation/i.test(label)
            ? "truck"
            : /assessment|evaluation|feedback/i.test(label)
              ? "clipboard"
              : "chart");
  return (
    <GlassCard className="metric-card relative overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#006CB8]/[0.08] text-[#006CB8]">
          <Icon name={inferred} width={18} height={18} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      {(description || detail) && (
        <p className="mt-2 text-xs leading-5 text-slate-500">
          {description ?? detail}
        </p>
      )}
    </GlassCard>
  );
}
