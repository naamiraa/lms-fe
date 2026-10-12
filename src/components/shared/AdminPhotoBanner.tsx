import { getTrainingImage } from "@/lib/training-visuals";
export default function AdminPhotoBanner({
  name,
  title,
  description,
}: {
  name: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#062c49] p-5 text-white sm:p-6">
      <img
        src={getTrainingImage(name)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#062c49] via-[#062c49]/85 to-[#062c49]/30" />
      <div className="relative max-w-xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
          Current workspace
        </p>
        <h2 className="mt-2 text-xl font-bold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-white/85">{description}</p>
      </div>
    </div>
  );
}
