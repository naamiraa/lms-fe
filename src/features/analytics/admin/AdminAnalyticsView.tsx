"use client";
import Alert from "@/components/shared/Alert";

import LoadingState from "@/components/shared/LoadingState";

import DataTable from "@/components/shared/DataTable";

import GlassCard from "@/components/shared/GlassCard";

import PageHeader from "@/components/shared/PageHeader";

import MetricCard from "@/components/shared/MetricCard";

import { useEffect, useState } from "react";

import { getAdminDashboard } from "@/services/dashboard.service";
import type { AdminDashboardResponse } from "@/types/dashboard";

export default function AdminAnalyticsView() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminDashboard();
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load analytics.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadAnalytics();
  }, []);

  if (loading) {
    return <LoadingState label="Loading analytics..." />;
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error || "Analytics data is unavailable."}
      </div>
    );
  }

  const totalResults = data.passedSimulations + data.failedSimulations;

  const passedPercentage =
    totalResults === 0 ? 0 : (data.passedSimulations / totalResults) * 100;

  const failedPercentage =
    totalResults === 0 ? 0 : (data.failedSimulations / totalResults) * 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title={<> Analytics </>}
        description={
          <>
            {" "}
            Monitor training performance and simulation outcomes across the
            Fleet Safety LMS.{" "}
          </>
        }
      />

      {error && <Alert>{error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Average Score"
          value={formatNumber(data.averageOverallScore)}
          detail="Overall training score"
        />

        <MetricCard
          label="Pass Rate"
          value={`${formatNumber(data.passRate)}%`}
          detail={`${data.passedSimulations} of ${data.completedSimulations} passed`}
        />

        <MetricCard
          label="Completed Simulations"
          value={data.completedSimulations.toString()}
          detail="Completed training sessions"
        />

        <MetricCard
          label="Certificates Issued"
          value={data.certificatesIssued.toString()}
          detail="Certificates generated"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
        <GlassCard as="section" className="p-6">
          <div>
            <h2 className="font-semibold text-slate-900">
              Performance Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Overall pass and fail distribution.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center">
            <div
              className="relative flex h-44 w-44 items-center justify-center rounded-full"
              style={{
                background:
                  totalResults === 0
                    ? "#e2e8f0"
                    : `conic-gradient(#16a34a 0 ${passedPercentage}%, #ef4444 ${passedPercentage}% 100%)`,
              }}
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-3xl font-bold text-slate-900">
                  {formatNumber(data.passRate)}%
                </span>
                <span className="mt-1 text-xs font-medium text-slate-500">
                  Pass Rate
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <ResultCard
              label="Passed"
              value={data.passedSimulations}
              percentage={passedPercentage}
              variant="success"
            />

            <ResultCard
              label="Failed"
              value={data.failedSimulations}
              percentage={failedPercentage}
              variant="danger"
            />
          </div>
        </GlassCard>

        <GlassCard as="section" className="p-6">
          <div>
            <h2 className="font-semibold text-slate-900">
              Scenario Performance
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Compare performance across simulation scenarios.
            </p>
          </div>

          {data.scenarioPerformance.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-200 px-5 py-12 text-center text-sm text-slate-400">
              No completed simulation data available.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {data.scenarioPerformance.map((scenario) => (
                <div
                  key={scenario.scenarioId}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {scenario.scenarioName}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {scenario.completedSimulations} completed simulation
                        {scenario.completedSimulations === 1 ? "" : "s"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        scenario.passRate >= 80
                          ? "bg-emerald-50 text-emerald-700"
                          : scenario.passRate >= 50
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {formatNumber(scenario.passRate)}% Pass Rate
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Average Score</span>
                        <span className="font-semibold text-slate-700">
                          {formatNumber(scenario.averageOverallScore)}
                        </span>
                      </div>

                      <ProgressBar value={scenario.averageOverallScore} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Pass Rate</span>
                        <span className="font-semibold text-slate-700">
                          {formatNumber(scenario.passRate)}%
                        </span>
                      </div>

                      <ProgressBar value={scenario.passRate} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      <GlassCard as="section" className="overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="font-semibold text-slate-900">Scenario Analytics</h2>
          <p className="mt-1 text-sm text-slate-500">
            Detailed simulation performance metrics.
          </p>
        </div>

        <div className="overflow-x-auto">
          <DataTable className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Scenario</th>
                <th className="px-6 py-3 font-semibold">Completed</th>
                <th className="px-6 py-3 font-semibold">Average Score</th>
                <th className="px-6 py-3 font-semibold">Pass Rate</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {data.scenarioPerformance.map((scenario) => (
                <tr key={scenario.scenarioId}>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {scenario.scenarioName}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {scenario.completedSimulations}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatNumber(scenario.averageOverallScore)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatNumber(scenario.passRate)}%
                  </td>
                </tr>
              ))}

              {data.scenarioPerformance.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No scenario analytics available.
                  </td>
                </tr>
              )}
            </tbody>
          </DataTable>
        </div>
      </GlassCard>
    </div>
  );
}

function ResultCard({
  label,
  value,
  percentage,
  variant,
}: {
  label: string;
  value: number;
  percentage: number;
  variant: "success" | "danger";
}) {
  const styles =
    variant === "success"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-red-50 text-red-700";

  return (
    <div className={`rounded-xl p-4 ${styles}`}>
      <p className="text-xs font-semibold uppercase">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs">{formatNumber(percentage)}% of results</p>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-[#006CB8] transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

function formatNumber(value: number) {
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2).replace(/\.?0+$/, "");
}
