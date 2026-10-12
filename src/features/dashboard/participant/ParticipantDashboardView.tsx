"use client";
import TrainingTile from "@/components/shared/TrainingTile";
import TrainingJourney from "@/components/shared/TrainingJourney";
import { trainingImages } from "@/lib/training-visuals";
import Alert from "@/components/shared/Alert";

import LoadingState from "@/components/shared/LoadingState";

import GlassCard from "@/components/shared/GlassCard";

import PageHeader from "@/components/shared/PageHeader";

import { useEffect, useState } from "react";

import MetricCard from "@/components/shared/MetricCard";
import ProgressBar from "@/components/shared/ProgressBar";
import StatusBadge from "@/components/shared/StatusBadge";

import { getParticipantDashboard } from "@/services/dashboard.service";
import type { ParticipantDashboardResponse } from "@/types/dashboard";

export default function ParticipantDashboardView() {
  const [data, setData] = useState<ParticipantDashboardResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getParticipantDashboard();
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  if (error) {
    return <Alert>{error}</Alert>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        tone="brand"
        title={<> Training Hub </>}
        eyebrow={<> Fleet Safety Simulator </>}
        description={
          <>
            {" "}
            Build your skills, complete your training, and get ready for your
            next simulator session.{" "}
          </>
        }
      />

      <TrainingJourney />
      <div className="grid gap-5 md:grid-cols-3">
        <TrainingTile
          title="Learning Missions"
          eyebrow="01 / Build your skills"
          description="Study your assigned modules and prepare for the road ahead."
          image={trainingImages.ground}
          href="/learning"
          action="Continue learning"
        />
        <TrainingTile
          title="Theory Challenge"
          eyebrow="02 / Test your knowledge"
          description="Put your safety knowledge into practice with the theory assessment."
          image={trainingImages.background}
          href="/assessment"
          action="Open assessment"
        />
        <TrainingTile
          title="Simulator Training"
          eyebrow="03 / Get behind the wheel"
          description="Choose an operational domain and prepare your simulator session."
          image={trainingImages.ground}
          href="/simulation"
          action="Select training"
        />
      </div>
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Learning Progress"
          value={`${data.learningProgressPercentage}%`}
          description={`${data.completedLearningContents} of ${data.totalLearningContents} contents completed`}
        />

        <MetricCard
          label="Assessments Completed"
          value={data.completedAssessments}
        />

        <MetricCard
          label="Simulations Completed"
          value={data.completedSimulations}
        />

        <MetricCard
          label="Certificates Earned"
          value={data.certificatesEarned}
        />
      </div>

      {/* Learning Progress */}
      <GlassCard as="section" className="p-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 className="font-semibold text-slate-900">Learning Progress</h2>

            <p className="mt-1 text-sm text-slate-500">
              {data.completedLearningContents} of {data.totalLearningContents}{" "}
              learning contents completed
            </p>
          </div>

          <p className="text-lg font-bold text-[#006CB8]">
            {data.learningProgressPercentage}%
          </p>
        </div>

        <div className="mt-4">
          <ProgressBar value={data.learningProgressPercentage} />
        </div>
      </GlassCard>

      {/* Latest Training */}
      {data.latestTraining && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Latest Training
          </h2>

          <GlassCard className="p-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="font-semibold text-slate-900">
                  {data.latestTraining.moduleName}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {data.latestTraining.scenarioName}
                </p>
              </div>

              <div className="flex items-center gap-8">
                <div>
                  <p className="text-xs text-slate-500">Overall Score</p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {data.latestTraining.overallScore}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Result</p>

                  <div className="mt-2">
                    <StatusBadge status={data.latestTraining.result} />
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>
      )}

      {/* Recent Trainings */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Recent Trainings
        </h2>

        <GlassCard className="overflow-hidden">
          {data.recentTrainings.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No training history yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.recentTrainings.map((training) => (
                <div
                  key={training.simulationSessionId}
                  className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {training.moduleName}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {training.scenarioName}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Score</p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {training.overallScore}
                      </p>
                    </div>

                    <StatusBadge status={training.result} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </section>
    </div>
  );
}
