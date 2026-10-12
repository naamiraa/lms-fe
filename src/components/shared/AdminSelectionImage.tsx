import { getTrainingImage } from "@/lib/training-visuals";
export default function AdminSelectionImage({
  name,
  large = false,
}: {
  name: string;
  large?: boolean;
}) {
  return (
    <img
      src={getTrainingImage(name)}
      alt=""
      loading="lazy"
      className={
        large
          ? "mb-4 h-28 w-full rounded-xl bg-[#062c49] object-cover"
          : "mb-3 h-20 w-full rounded-lg bg-[#062c49] object-cover"
      }
    />
  );
}
