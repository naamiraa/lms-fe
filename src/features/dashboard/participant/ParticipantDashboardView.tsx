"use client";

import { useEffect, useState } from "react";

import MetricCard from "@/components/shared/MetricCard";
import ProgressBar from "@/components/shared/ProgressBar";
import StatusBadge from "@/components/shared/StatusBadge";

import { getParticipantDashboard } from "@/services/dashboard.service";
import type { ParticipantDashboardResponse } from "@/types/dashboard";

export default function ParticipantDashboardView() {
  const [data, setData] =
    useState<ParticipantDashboardResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getParticipantDashboard();
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <p className="text-slate-500">
        Loading dashboard...
      </p>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Track your training progress and performance.
        </p>
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
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 className="font-semibold text-slate-900">
              Learning Progress
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {data.completedLearningContents} of{" "}
              {data.totalLearningContents} learning contents completed
            </p>
          </div>

          <p className="text-lg font-bold text-[#006CB8]">
            {data.learningProgressPercentage}%
          </p>
        </div>

        <div className="mt-4">
          <ProgressBar
            value={data.learningProgressPercentage}
          />
        </div>
      </section>

      {/* Latest Training */}
      {data.latestTraining && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Latest Training
          </h2>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
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
                  <p className="text-xs text-slate-500">
                    Overall Score
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {data.latestTraining.overallScore}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Result
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={data.latestTraining.result}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Trainings */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Recent Trainings
        </h2>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
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
                      <p className="text-xs text-slate-500">
                        Score
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {training.overallScore}
                      </p>
                    </div>

                    <StatusBadge
                      status={training.result}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}