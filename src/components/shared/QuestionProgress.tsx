export default function QuestionProgress({
  total,
  answered,
  current,
}: {
  total: number;
  answered: boolean[];
  current: number;
}) {
  return (
    <div
      className="flex gap-1.5"
      aria-label={`${answered.filter(Boolean).length} of ${total} questions answered`}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 min-w-0 flex-1 rounded-full ${answered[index] ? "bg-emerald-500" : current === index ? "bg-[#006CB8]" : "bg-slate-200"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
