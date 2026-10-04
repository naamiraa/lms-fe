"use client";

import { useEffect, useState } from "react";

import MetricCard from "@/components/shared/MetricCard";
import StatusBadge from "@/components/shared/StatusBadge";

import { getInstructorDashboard } from "@/services/dashboard.service";
import type {
  InstructorDashboardResponse,
} from "@/types/dashboard";

export default function InstructorDashboardView() {
  const [data, setData] =
    useState<InstructorDashboardResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getInstructorDashboard();

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
          Instructor Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor participant training sessions and evaluations.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Completed Simulations"
          value={data.completedSimulations}
        />

        <MetricCard
          label="Pending Feedback"
          value={data.pendingFeedback}
        />

        <MetricCard
          label="Evaluated Sessions"
          value={data.evaluatedSessions}
        />

        <MetricCard
          label="Average Simulator Score"
          value={data.averageSimulatorScore}
        />
      </div>

      {/* Recent Sessions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Recent Training Sessions
        </h2>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {data.recentSessions.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No training sessions yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.recentSessions.map((session) => (
                <div
                  key={session.simulationSessionId}
                  className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                >
                  {/* Participant & Scenario */}
                  <div>
                    <p className="font-medium text-slate-900">
                      {session.participantName}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {session.scenarioName}
                    </p>
                  </div>

                  {/* Score & Status */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        Simulator Score
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {session.simulatorScore}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        Overall Score
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {session.overallScore ?? "-"}
                      </p>
                    </div>

                    <div>
                      {session.result ? (
                        <StatusBadge
                          status={session.result}
                        />
                      ) : (
                        <span className="text-xs text-slate-400">
                          Not evaluated
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feedback Status */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Feedback Status
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          {data.recentSessions.length === 0 ? (
            <p className="text-sm text-slate-500">
              No sessions available.
            </p>
          ) : (
            <div className="space-y-4">
              {data.recentSessions.map((session) => (
                <div
                  key={session.simulationSessionId}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {session.participantName}
                    </p>

                    <p className="text-sm text-slate-500">
                      {session.scenarioName}
                    </p>
                  </div>

                  {session.hasInstructorFeedback ? (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Feedback Completed
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      Feedback Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}