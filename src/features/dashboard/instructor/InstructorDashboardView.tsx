"use client";
import LoadingState from "@/components/shared/LoadingState";

import GlassCard from "@/components/shared/GlassCard";

import PageHeader from "@/components/shared/PageHeader";

import StatCard from "@/components/shared/MetricCard";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getInstructorDashboard } from "@/services/instructor-dashboard.service";
import type {
  InstructorDashboard,
  InstructorRecentSession,
} from "@/types/instructor-dashboard";

export default function InstructorDashboardView() {
  const [dashboard, setDashboard] = useState<InstructorDashboard | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getInstructorDashboard();
        setDashboard(data);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load instructor dashboard.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingState label="Loading instructor dashboard..." />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <h2 className="font-bold text-red-700">Unable to load dashboard</h2>

        <p className="mt-2 text-sm text-red-600">
          {error || "Dashboard data is unavailable."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        tone="brand"
        title={<> Instructor Dashboard </>}
        description={
          <>
            {" "}
            Monitor completed simulator training and participant evaluation
            progress.{" "}
          </>
        }
        eyebrow={<> Instructor Overview </>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Completed Simulations"
          value={dashboard.completedSimulations}
        />

        <StatCard label="Pending Feedback" value={dashboard.pendingFeedback} />

        <StatCard
          label="Evaluated Sessions"
          value={dashboard.evaluatedSessions}
        />

        <StatCard
          label="Avg. Simulator Score"
          value={formatScore(dashboard.averageSimulatorScore)}
        />
      </div>

      <GlassCard as="section" className="">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Recent Training Sessions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review recently completed simulator sessions and provide participant
            feedback.
          </p>
        </div>

        {dashboard.recentSessions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold text-slate-700">
              No completed sessions yet.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Completed participant simulations will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {dashboard.recentSessions.map((session) => (
              <RecentSession
                key={session.simulationSessionId}
                session={session}
              />
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function RecentSession({ session }: { session: InstructorRecentSession }) {
  const passed = session.result.toUpperCase() === "PASS";

  return (
    <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-slate-900">
            {session.participantName}
          </h3>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              passed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {session.result}
          </span>
        </div>

        <p className="mt-1 text-sm font-medium text-[#006CB8]">
          {session.scenarioName}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          {session.completedAt
            ? new Date(session.completedAt).toLocaleString()
            : "Completion time unavailable"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <Score label="Simulator" value={session.simulatorScore} />

        <Score label="Overall" value={session.overallScore} />

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Feedback
          </p>

          <p
            className={`mt-1 text-sm font-bold ${
              session.hasInstructorFeedback
                ? "text-emerald-600"
                : "text-amber-600"
            }`}
          >
            {session.hasInstructorFeedback ? "Evaluated" : "Pending"}
          </p>
        </div>

        {session.hasInstructorFeedback ? (
          <Link
            href={`/instructor/feedback?sessionId=${encodeURIComponent(
              session.simulationSessionId,
            )}`}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View Feedback
          </Link>
        ) : (
          <Link
            href={`/instructor/feedback?sessionId=${encodeURIComponent(
              session.simulationSessionId,
            )}`}
            className="rounded-xl bg-[#006CB8] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Evaluate
          </Link>
        )}
      </div>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>

      <p className="mt-1 font-bold text-slate-900">{formatScore(value)}</p>
    </div>
  );
}

function formatScore(value: number) {
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}
