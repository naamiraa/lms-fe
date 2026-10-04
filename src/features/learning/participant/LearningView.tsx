"use client";

import { useEffect, useState } from "react";
import {
  getLearningModulesByDomain,
  getLearningProgress,
  getTrainingDomains,
} from "@/services/learning.service";
import type {
  LearningModule,
  LearningProgress,
  TrainingDomain,
} from "@/types/learning";
import ProgressBar from "@/components/shared/ProgressBar";
import Link from "next/link";



interface ModuleWithProgress {
  module: LearningModule;
  progress: LearningProgress;
}

export default function LearningView() {
  const [domains, setDomains] = useState<TrainingDomain[]>([]);
  const [modules, setModules] = useState<ModuleWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLearning() {
      try {
        setIsLoading(true);
        setError("");

        const domainData = await getTrainingDomains();
        const activeDomains = domainData.filter((domain) => domain.isActive);

        setDomains(activeDomains);

        const moduleResults = await Promise.all(
          activeDomains.map((domain) =>
            getLearningModulesByDomain(domain.id),
          ),
        );

        const activeModules = moduleResults
          .flat()
          .filter((module) => module.isActive)
          .sort((a, b) => a.order - b.order);

        const modulesWithProgress = await Promise.all(
          activeModules.map(async (module) => {
            const progress = await getLearningProgress(module.id);

            return {
              module,
              progress,
            };
          }),
        );

        setModules(modulesWithProgress);
      } catch (err) {
        console.error(err);
        setError("Failed to load learning modules.");
      } finally {
        setIsLoading(false);
      }
    }

    loadLearning();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">Loading learning modules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
        <p className="text-sm font-medium text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-[#006CB8]">
          Learning Center
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Continue Your Learning
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Continue your fleet safety training and complete your assigned
          learning modules before proceeding to the assessment.
        </p>
      </div>

      {domains.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="font-semibold text-slate-900">
            No training domains available
          </p>
          <p className="mt-1 text-sm text-slate-500">
            There are currently no active training domains.
          </p>
        </div>
      ) : modules.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="font-semibold text-slate-900">
            No learning modules available
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Learning modules have not been added to this training yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {modules.map(({ module, progress }) => (
            <div
              key={module.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#006CB8]">
                    {module.trainingDomainName}
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-slate-900">
                    {module.name}
                  </h2>
                </div>

                {progress.isCompleted && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Completed
                  </span>
                )}
              </div>

              <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                {module.description ?? "No description available."}
              </p>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    Learning progress
                  </span>

                  <span className="font-semibold text-slate-900">
                    {progress.progressPercentage}%
                  </span>
                </div>

                <ProgressBar value={progress.progressPercentage} />

                <p className="mt-2 text-xs text-slate-500">
                  {progress.completedContents} of {progress.totalContents}{" "}
                  contents completed
                </p>
              </div>

              <Link
                href={`/learning/${module.id}`}
                className="mt-6 block w-full rounded-xl bg-[#006CB8] px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
                >
                {progress.isCompleted ? "Review Module" : "Continue Learning"}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}