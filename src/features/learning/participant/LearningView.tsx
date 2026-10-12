"use client";
import Alert from "@/components/shared/Alert";

import LoadingState from "@/components/shared/LoadingState";

import GlassCard from "@/components/shared/GlassCard";

import TrainingJourney from "@/components/shared/TrainingJourney";
import PageHeader from "@/components/shared/PageHeader";

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
import LearningModuleCard from "@/components/shared/LearningModuleCard";

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
          activeDomains.map((domain) => getLearningModulesByDomain(domain.id)),
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
        <LoadingState label="Loading learning modules..." />
      </div>
    );
  }

  if (error) {
    return <Alert>{error}</Alert>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        tone="brand"
        title={<> Continue Your Learning </>}
        description={
          <>
            {" "}
            Continue your fleet safety training and complete your assigned
            learning modules before proceeding to the assessment.{" "}
          </>
        }
        eyebrow={<> Learning Center </>}
      />

      <TrainingJourney active={0} />

      {domains.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <p className="font-semibold text-slate-900">
            No training domains available
          </p>
          <p className="mt-1 text-sm text-slate-500">
            There are currently no active training domains.
          </p>
        </GlassCard>
      ) : modules.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <p className="font-semibold text-slate-900">
            No learning modules available
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Learning modules have not been added to this training yet.
          </p>
        </GlassCard>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {modules.map(({ module, progress }) => (
            <LearningModuleCard
              key={module.id}
              module={module}
              progress={progress}
            />
          ))}
        </div>
      )}
    </div>
  );
}
