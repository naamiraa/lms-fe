"use client";
import LoadingState from "@/components/shared/LoadingState";

import GlassCard from "@/components/shared/GlassCard";

import PageHeader from "@/components/shared/PageHeader";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getMyTrainingHistory } from "@/services/history.service";
import type { TrainingHistoryItem } from "@/types/history";

export default function HistoryView() {
  const [history, setHistory] = useState<TrainingHistoryItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyTrainingHistory();

        setHistory(data);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load training history.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingState label="Loading training history..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <h2 className="font-bold text-red-700">
          Unable to load training history
        </h2>

        <p className="mt-2 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={<> Training History </>}
        description={
          <>
            {" "}
            Review your completed fleet safety training sessions and previous
            results.{" "}
          </>
        }
        eyebrow={<> Training Records </>}
      />

      {history.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <div className="text-3xl">⌛</div>

          <h2 className="mt-4 font-bold text-slate-900">
            No Training History Yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Complete your theory assessment and simulator training to see your
            results here.
          </p>

          <Link
            href="/learning"
            className="mt-5 inline-flex rounded-xl bg-[#006CB8] px-5 py-3 text-sm font-semibold text-white"
          >
            Start Learning →
          </Link>
        </GlassCard>
      ) : (
        <div className="space-y-5">
          {history.map((item) => (
            <HistoryCard key={item.simulationSessionId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function HistoryCard({ item }: { item: TrainingHistoryItem }) {
  const passed = item.result.toUpperCase() === "PASS";

  const completedDate = new Date(item.completedAt).toLocaleString();

  return (
    <GlassCard as="section" className="overflow-hidden">
      <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                passed
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.result}
            </span>

            <span className="text-xs text-slate-400">{completedDate}</span>
          </div>

          <h2 className="mt-3 text-lg font-bold text-slate-900">
            {item.scenarioName}
          </h2>

          <p className="mt-1 text-sm font-medium text-[#006CB8]">
            {item.trainingDomainName}
          </p>

          <div className="mt-4 space-y-1 text-sm text-slate-500">
            <p>
              <span className="font-semibold text-slate-700">Learning:</span>{" "}
              {item.learningModuleName}
            </p>

            <p>
              <span className="font-semibold text-slate-700">Assessment:</span>{" "}
              {item.assessmentTitle}
            </p>
          </div>
        </div>

        <div className="shrink-0 lg:text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Overall Score
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {formatScore(item.overallScore)}
          </p>

          <p className="text-xs text-slate-400">/100</p>
        </div>
      </div>

      <div className="grid grid-cols-2 border-y border-slate-100 bg-slate-50 sm:grid-cols-3">
        <ScoreItem label="Theory" value={item.theoryScore} />

        <ScoreItem label="Simulator" value={item.simulatorScore} />

        <div className="col-span-2 flex items-center justify-center border-t border-slate-100 p-4 sm:col-span-1 sm:border-t-0">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Instructor Feedback
            </p>

            <p
              className={`mt-1 text-sm font-bold ${
                item.hasInstructorFeedback
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            >
              {item.hasInstructorFeedback ? "Available" : "Pending"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 p-5">
        <Link
          href={`/performance?sessionId=${encodeURIComponent(
            item.simulationSessionId,
          )}`}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View Performance
        </Link>

        {item.hasInstructorFeedback && (
          <Link
            href={`/feedback?sessionId=${encodeURIComponent(
              item.simulationSessionId,
            )}`}
            className="rounded-xl bg-[#006CB8] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            View Feedback →
          </Link>
        )}
      </div>
    </GlassCard>
  );
}

function ScoreItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-r border-slate-100 p-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-900">
        {formatScore(value)}
      </p>
    </div>
  );
}

function formatScore(value: number) {
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}
