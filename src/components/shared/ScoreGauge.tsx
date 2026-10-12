import GlassCard from "@/components/shared/GlassCard";
export default function ScoreGauge({
  label,
  value,
  color = "blue",
}: {
  label: string;
  value: number;
  color?: "blue" | "green";
}) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  const end = (safe / 100) * Math.PI;
  const x = 30 + 90 * (1 - Math.cos(end));
  const y = 120 - 90 * Math.sin(end);
  const stroke = color === "green" ? "#0aa365" : "#006CB8";
  return (
    <GlassCard className="p-5">
      <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
      <div className="relative mx-auto mt-4 max-w-[240px]">
        <svg
          viewBox="0 0 240 145"
          className="w-full"
          role="img"
          aria-label={`${label}: ${value} out of 100`}
        >
          <path
            d="M30 120 A90 90 0 0 1 210 120"
            fill="none"
            stroke="#e8eef3"
            strokeWidth="22"
            strokeLinecap="round"
          />
          {safe > 0 && (
            <path
              d={`M30 120 A90 90 0 0 1 ${x} ${y}`}
              fill="none"
              stroke={stroke}
              strokeWidth="22"
              strokeLinecap="round"
            />
          )}
          <text
            x="120"
            y="114"
            textAnchor="middle"
            fill="#18374e"
            fontSize="34"
            fontWeight="700"
          >
            {Number.isFinite(value)
              ? value.toFixed(1).replace(/\.0$/, "")
              : "—"}
          </text>
          <text
            x="120"
            y="137"
            textAnchor="middle"
            fill="#64748b"
            fontSize="11"
          >
            / 100
          </text>
        </svg>
      </div>
    </GlassCard>
  );
}
