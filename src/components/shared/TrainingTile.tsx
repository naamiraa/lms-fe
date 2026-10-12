import Link from "next/link";
import Icon from "@/components/ui/Icon";
export default function TrainingTile({
  title,
  description,
  image,
  href,
  action,
  eyebrow,
}: {
  title: string;
  description: string;
  image: string;
  href: string;
  action: string;
  eyebrow: string;
}) {
  return (
    <Link
      href={href}
      className="training-tile group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl border border-white/70 p-6 text-white shadow-xl shadow-slate-900/10"
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071e31] via-[#071e31]/50 to-transparent" />
      <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
        {eyebrow}
      </span>
      <div className="relative">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-200">{description}</p>
        <span className="mt-5 flex min-h-11 items-center justify-between rounded-xl border border-white/15 bg-[#006CB8] px-4 py-3 text-sm font-semibold shadow-lg">
          {action}
          <Icon name="arrow" width={18} height={18} />
        </span>
      </div>
    </Link>
  );
}
