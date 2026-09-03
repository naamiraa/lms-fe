"use client";

import { useEffect, useState } from "react";

import { getAdminDashboard } from "@/services/dashboard.service";
import type { AdminDashboardResponse } from "@/types/dashboard";

import MetricCard from "@/components/shared/MetricCard";

export default function AdminDashboardView() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getAdminDashboard();
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Overview of Fleet Safety LMS activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Participants"
          value={data.totalParticipants}
        />

        <MetricCard
          label="Total Instructors"
          value={data.totalInstructors}
        />

        <MetricCard
          label="Completed Simulations"
          value={data.completedSimulations}
        />

        <MetricCard
          label="Certificates Issued"
          value={data.certificatesIssued}
        />

        <MetricCard
          label="Pending Approvals"
          value={data.pendingUserApprovals}
        />

        <MetricCard
          label="Pass Rate"
          value={`${data.passRate}%`}
        />

        <MetricCard
          label="Average Score"
          value={data.averageOverallScore}
        />

        <MetricCard
          label="Passed / Failed"
          value={`${data.passedSimulations} / ${data.failedSimulations}`}
        />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Scenario Performance
        </h2>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-4">
                  Scenario
                </th>
                <th className="px-5 py-4">
                  Completed
                </th>
                <th className="px-5 py-4">
                  Average Score
                </th>
                <th className="px-5 py-4">
                  Pass Rate
                </th>
              </tr>
            </thead>

            <tbody>
              {data.scenarioPerformance.map((scenario) => (
                <tr
                  key={scenario.scenarioId}
                  className="border-t border-slate-100"
                >
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {scenario.scenarioName}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {scenario.completedSimulations}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {scenario.averageOverallScore}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {scenario.passRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}