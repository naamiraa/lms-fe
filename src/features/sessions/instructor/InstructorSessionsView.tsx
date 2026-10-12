"use client";
import Alert from "@/components/shared/Alert";

import LoadingState from "@/components/shared/LoadingState";

import DataTable from "@/components/shared/DataTable";

import GlassCard from "@/components/shared/GlassCard";

import PageHeader from "@/components/shared/PageHeader";

import SummaryCard from "@/components/shared/MetricCard";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getInstructorSessions } from "@/services/instructor-session.service";
import { InstructorSession } from "@/types/instructor-session";

type FeedbackFilter = "ALL" | "PENDING" | "EVALUATED";
type ResultFilter = "ALL" | "PASS" | "FAIL";

export default function InstructorSessionsView() {
  const [sessions, setSessions] = useState<InstructorSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [feedbackFilter, setFeedbackFilter] = useState<FeedbackFilter>("ALL");
  const [resultFilter, setResultFilter] = useState<ResultFilter>("ALL");

  useEffect(() => {
    async function loadSessions() {
      try {
        setLoading(true);
        setError("");

        const data = await getInstructorSessions();
        setSessions(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load training sessions.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, []);

  const filteredSessions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return sessions.filter((session) => {
      const matchesSearch =
        !keyword ||
        session.participantName.toLowerCase().includes(keyword) ||
        session.scenarioName.toLowerCase().includes(keyword);

      const matchesFeedback =
        feedbackFilter === "ALL" ||
        (feedbackFilter === "EVALUATED" && session.hasInstructorFeedback) ||
        (feedbackFilter === "PENDING" && !session.hasInstructorFeedback);

      const matchesResult =
        resultFilter === "ALL" || session.result === resultFilter;

      return matchesSearch && matchesFeedback && matchesResult;
    });
  }, [sessions, search, feedbackFilter, resultFilter]);

  if (loading) {
    return (
      <div className="p-6">
        <LoadingState label="Loading training sessions..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert>{error}</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={<> Training Sessions </>}
        description={
          <>
            {" "}
            Review completed simulator sessions and participant evaluation
            status.{" "}
          </>
        }
        eyebrow={<> Training Management </>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Completed Sessions" value={sessions.length} />

        <SummaryCard
          label="Pending Feedback"
          value={
            sessions.filter((session) => !session.hasInstructorFeedback).length
          }
        />

        <SummaryCard
          label="Evaluated"
          value={
            sessions.filter((session) => session.hasInstructorFeedback).length
          }
        />
      </div>

      <GlassCard className="p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search participant or scenario..."
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
          />

          <select
            value={feedbackFilter}
            onChange={(event) =>
              setFeedbackFilter(event.target.value as FeedbackFilter)
            }
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none"
          >
            <option value="ALL">All Feedback</option>
            <option value="PENDING">Pending</option>
            <option value="EVALUATED">Evaluated</option>
          </select>

          <select
            value={resultFilter}
            onChange={(event) =>
              setResultFilter(event.target.value as ResultFilter)
            }
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none"
          >
            <option value="ALL">All Results</option>
            <option value="PASS">Pass</option>
            <option value="FAIL">Fail</option>
          </select>
        </div>
      </GlassCard>

      {filteredSessions.length === 0 ? (
        <GlassCard className="p-10 text-center">
          <h2 className="font-semibold text-slate-900">
            No training sessions found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Try changing the search or filter.
          </p>
        </GlassCard>
      ) : (
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <DataTable className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Participant</th>
                  <th className="px-5 py-4">Scenario</th>
                  <th className="px-5 py-4">Completed</th>
                  <th className="px-5 py-4">Theory</th>
                  <th className="px-5 py-4">Simulator</th>
                  <th className="px-5 py-4">Overall</th>
                  <th className="px-5 py-4">Result</th>
                  <th className="px-5 py-4">Feedback</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredSessions.map((session) => (
                  <tr
                    key={session.simulationSessionId}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {session.participantName}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {session.scenarioName}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {session.completedAt
                        ? new Date(session.completedAt).toLocaleString()
                        : "-"}
                    </td>

                    <td className="px-5 py-4">{session.theoryScore}</td>

                    <td className="px-5 py-4">{session.simulatorScore}</td>

                    <td className="px-5 py-4 font-semibold">
                      {session.overallScore}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        success={session.result === "PASS"}
                        label={session.result}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        success={session.hasInstructorFeedback}
                        label={
                          session.hasInstructorFeedback
                            ? "Evaluated"
                            : "Pending"
                        }
                      />
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <Link
                        href={`/instructor/feedback?sessionId=${session.simulationSessionId}`}
                        className="font-semibold text-[#006CB8] hover:text-[#005a9c]"
                      >
                        {session.hasInstructorFeedback
                          ? "View Feedback"
                          : "Evaluate"}
                      
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

function StatusBadge({ success, label }: { success: boolean; label: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        success
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {label}
    </span>
  );
}
