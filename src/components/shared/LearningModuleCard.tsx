import { getTrainingImage } from "@/lib/training-visuals";
import Link from "next/link";
import type { LearningModule, LearningProgress } from "@/types/learning";
import GlassCard from "@/components/shared/GlassCard";
import ProgressBar from "@/components/shared/ProgressBar";
import StatusBadge from "@/components/shared/StatusBadge";
import Icon from "@/components/ui/Icon";
export default function LearningModuleCard({
  module,
  progress,
}: {
  module: LearningModule;
  progress: LearningProgress;
}) {
  return (
    <GlassCard className="flex h-full flex-col overflow-hidden">
      <div className="relative flex h-44 items-end justify-between overflow-hidden px-5 pb-5 text-white">
        <img
          src={getTrainingImage(module.trainingDomainName)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041d31]/90 via-[#041d31]/20 to-transparent" />
        <span className="relative rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-md">
          Mission {String(module.order).padStart(2, "0")}
        </span>
        <span className="relative text-xs font-semibold">
          {progress.isCompleted
            ? "Completed"
            : progress.completedContents > 0
              ? "In progress"
              : "Not started"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-[#006CB8]">
            {module.trainingDomainName}
          </p>
          {progress.isCompleted && <StatusBadge status="Completed" />}
        </div>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
          {module.name}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {module.description ?? "No description available."}
        </p>
        <div className="mt-auto pt-6">
          <div className="mb-2 flex justify-between gap-3 text-xs">
            <span className="font-medium text-slate-500">
              Learning progress
            </span>
            <span className="font-bold text-[#006CB8]">
              {progress.progressPercentage}%
            </span>
          </div>
          <ProgressBar value={progress.progressPercentage} />
          <p className="mt-2 text-xs text-slate-500">
            {progress.completedContents} of {progress.totalContents} contents
            completed
          </p>
          <Link
            href={`/learning/${module.id}`}
            className="mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#006CB8] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-900/10 transition hover:bg-[#005a9c]"
          >
            {progress.isCompleted ? "Review Module" : "Continue Learning"}
            <Icon name="arrow" width={17} height={17} />
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
