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
      <div className="relative flex h-28 items-center justify-between overflow-hidden bg-gradient-to-br from-[#e0f0fa] to-[#f3f8fc] px-6">
        <div
          className="absolute -right-8 -top-12 h-48 w-48 rounded-full border-[24px] border-[#006CB8]/[0.04]"
          aria-hidden="true"
        />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white bg-white/80 text-[#006CB8] shadow-sm">
          <Icon name="book" width={28} height={28} />
        </span>
        <span className="relative rounded-full border border-white bg-white/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#006CB8]">
          Learning module
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
