export default function Brand({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`inline-flex shrink-0 items-center rounded-xl ${
        light ? "" : "bg-[#006CB8] px-3 py-2"
      }`}
    >
      <img
        src="/images/pertamina-logo.png"
        alt="Pertamina"
        width={160}
        height={64}
        className={`object-contain ${
          compact ? "h-10 w-32" : "h-12 w-40"
        }`}
      />
    </div>
  );
}