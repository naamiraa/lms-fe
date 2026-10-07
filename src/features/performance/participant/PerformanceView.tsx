"use client";
import LoadingState from "@/components/shared/LoadingState";

import GlassCard from "@/components/shared/GlassCard";

import PageHeader from "@/components/shared/PageHeader";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPerformanceEvaluation } from "@/services/performance.service";
import type { PerformanceEvaluation } from "@/types/performance";
import Link from "next/dist/client/link";

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}m ${remainingSeconds}s`;
}

function formatEventTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function PerformanceView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [performance, setPerformance] = useState<PerformanceEvaluation | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPerformance() {
      if (!sessionId) {
        setError("Simulation session was not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getPerformanceEvaluation(sessionId);

        setPerformance(data);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load performance evaluation.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPerformance();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingState label="Loading performance evaluation..." />
      </div>
    );
  }

  if (error || !performance) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
        <p className="font-semibold text-red-700">Unable to load performance</p>

        <p className="mt-1 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const passed = performance.result === "PASS";

  return (
    <div className="space-y-8">
      <PageHeader
        title={<> Performance </>}
        description={
          <>
            {" "}
            Review your theory assessment and simulator training
            performance.{" "}
          </>
        }
        eyebrow={<> Training Result </>}
      />

      <section
        className={`rounded-2xl border p-6 ${
          passed
            ? "border-emerald-100 bg-emerald-50"
            : "border-red-100 bg-red-50"
        }`}
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p
              className={`text-sm font-semibold ${
                passed ? "text-emerald-700" : "text-red-700"
              }`}
            >
              Final Result
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              {performance.overallScore.toFixed(2)}
              <span className="text-lg text-slate-400">/100</span>
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              {performance.domainName} · {performance.scenarioName}
            </p>
          </div>

          <div
            className={`rounded-full px-5 py-2 text-sm font-bold ${
              passed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {performance.result}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Score Summary</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard label="Theory Score" value={performance.theoryScore} />

          <ScoreCard
            label="Simulator Score"
            value={performance.simulatorScore}
          />

          <ScoreCard
            label="Safety Score"
            value={performance.breakdown.safetyScore}
          />

          <ScoreCard
            label="Total Violations"
            value={performance.totalViolations}
            suffix=""
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">
          Performance Breakdown
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <ScoreCard label="Safety" value={performance.breakdown.safetyScore} />

          <ScoreCard
            label="Vehicle Control"
            value={performance.breakdown.vehicleControlScore}
          />

          <ScoreCard
            label="Emergency Response"
            value={performance.breakdown.emergencyResponseScore}
          />
        </div>

        <GlassCard className="mt-4  p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Completion Time
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatDuration(performance.completionTimeSeconds)}
          </p>
        </GlassCard>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Violation Timeline</h2>

        <p className="mt-1 text-sm text-slate-500">
          Events recorded during your simulator session.
        </p>

        {performance.events.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="font-semibold text-emerald-700">
              No violations recorded
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {performance.events.map((event) => (
              <GlassCard key={event.eventId} className="p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate-900">
                        {event.eventType.replaceAll("_", " ")}
                      </p>

                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        {event.severity}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {event.description}
                    </p>
                  </div>

                  <div className="shrink-0 text-left sm:text-right">
                    <p className="font-semibold text-slate-900">
                      {formatEventTime(event.occurredAtSeconds)}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-red-600">
                      -{event.penaltyPoints} points
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </section>

      <div className="flex justify-end">
        <Link
          href={`/feedback?sessionId=${encodeURIComponent(
            performance.simulationSessionId,
          )}`}
          className="rounded-xl bg-[#006CB8] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          View Instructor Feedback →
        </Link>
      </div>
    </div>
  );
}

interface ScoreCardProps {
  label: string;
  value: number;
  suffix?: string;
}

function ScoreCard({ label, value, suffix = "/100" }: ScoreCardProps) {
  return (
    <GlassCard className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
        {suffix && (
          <span className="ml-1 text-sm font-medium text-slate-400">
            {suffix}
          </span>
        )}
      </p>
    </GlassCard>
  );
}
