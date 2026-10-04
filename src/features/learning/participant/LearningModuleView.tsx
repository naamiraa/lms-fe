"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getLearningContentsByModule,
  getLearningModule,
  getLearningProgress,
} from "@/services/learning.service";
import type {
  LearningContent,
  LearningModule,
  LearningProgress,
} from "@/types/learning";
import ProgressBar from "@/components/shared/ProgressBar";

interface LearningModuleViewProps {
  moduleId: string;
}

export default function LearningModuleView({
  moduleId,
}: LearningModuleViewProps) {
  const [module, setModule] = useState<LearningModule | null>(null);
  const [contents, setContents] = useState<LearningContent[]>([]);
  const [progress, setProgress] = useState<LearningProgress | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadModule() {
      try {
        setIsLoading(true);
        setError("");

        const [moduleData, contentData, progressData] = await Promise.all([
          getLearningModule(moduleId),
          getLearningContentsByModule(moduleId),
          getLearningProgress(moduleId),
        ]);

        setModule(moduleData);
        setContents(
          contentData
            .filter((content) => content.isActive)
            .sort((a, b) => a.order - b.order),
        );
        setProgress(progressData);
      } catch (err) {
        console.error(err);
        setError("Failed to load learning module.");
      } finally {
        setIsLoading(false);
      }
    }

    loadModule();
  }, [moduleId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading learning module...
        </p>
      </div>
    );
  }

  if (error || !module || !progress) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
        <p className="text-sm font-medium text-red-700">
          {error || "Learning module not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/learning"
          className="text-sm font-semibold text-[#006CB8] hover:underline"
        >
          ← Back to Learning
        </Link>

        <p className="mt-6 text-sm font-semibold text-[#006CB8]">
          {module.trainingDomainName}
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {module.name}
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          {module.description}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-900">
              Module Progress
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {progress.completedContents} of {progress.totalContents} contents
              completed
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-[#006CB8]">
              {progress.progressPercentage}%
            </p>

            {progress.isCompleted && (
              <p className="mt-1 text-xs font-semibold text-emerald-600">
                Module Completed
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar value={progress.progressPercentage} />
        </div>
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Learning Contents
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete the materials below before continuing to the assessment.
          </p>
        </div>

        {contents.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="font-semibold text-slate-900">
              No learning content available
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {contents.map((content, index) => {
              const contentProgress = progress.contents.find(
                (item) => item.learningContentId === content.id,
              );

              const isCompleted = contentProgress?.isCompleted ?? false;

              return (
                <Link
                  key={content.id}
                  href={`/learning/${module.id}/contents/${content.id}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#006CB8]/40 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-[#006CB8]">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {content.title}
                        </h3>

                        {isCompleted && (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            Completed
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {content.description}
                      </p>

                      <div className="mt-3 flex gap-3 text-xs font-medium text-slate-500">
                        <span>{content.contentType}</span>
                        <span>•</span>
                        <span>{content.estimatedMinutes} min</span>
                      </div>
                    </div>

                    <div className="text-xl text-slate-400">
                      →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}