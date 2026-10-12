"use client";
import Alert from "@/components/shared/Alert";

import LoadingState from "@/components/shared/LoadingState";

import GlassCard from "@/components/shared/GlassCard";

import PageHeader from "@/components/shared/PageHeader";

import SummaryCard from "@/components/shared/MetricCard";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getInstructorSessions } from "@/services/instructor-session.service";
import type { InstructorSession } from "@/types/instructor-session";

interface ParticipantSummary {
  name: string;
  sessions: InstructorSession[];
  totalSessions: number;
  passedSessions: number;
  failedSessions: number;
  latestSession: InstructorSession;
}

export default function InstructorParticipantsView() {
  const [sessions, setSessions] = useState<InstructorSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadParticipants() {
      try {
        setLoading(true);
        setError("");

        const data = await getInstructorSessions();
        setSessions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load participants.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadParticipants();
  }, []);

  const participants = useMemo(() => {
    const grouped = new Map<string, InstructorSession[]>();

    sessions.forEach((session) => {
      const existing = grouped.get(session.participantName) ?? [];
      existing.push(session);
      grouped.set(session.participantName, existing);
    });

    return Array.from(grouped.entries())
      .map(([name, participantSessions]): ParticipantSummary => {
        const sortedSessions = [...participantSessions].sort(
          (a, b) =>
            new Date(b.completedAt ?? 0).getTime() -
            new Date(a.completedAt ?? 0).getTime(),
        );

        return {
          name,
          sessions: sortedSessions,
          totalSessions: sortedSessions.length,
          passedSessions: sortedSessions.filter(
            (session) => session.result === "PASS",
          ).length,
          failedSessions: sortedSessions.filter(
            (session) => session.result === "FAIL",
          ).length,
          latestSession: sortedSessions[0],
        };
      })
      .filter((participant) =>
        participant.name.toLowerCase().includes(search.trim().toLowerCase()),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [sessions, search]);

  if (loading) {
    return <LoadingState label="Loading participants..." />;
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
        title={<> Participants </>}
        description={
          <> Monitor participant training activity and performance. </>
        }
        eyebrow={<> Participant Management </>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Participants" value={participants.length} />

        <SummaryCard label="Training Sessions" value={sessions.length} />

        <SummaryCard
          label="Passed Sessions"
          value={sessions.filter((session) => session.result === "PASS").length}
        />
      </div>

      <GlassCard className="p-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search participant..."
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
        />
      </GlassCard>

      {participants.length === 0 ? (
        <GlassCard className="p-10 text-center">
          <h2 className="font-semibold text-slate-900">
            No participants found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            No participant has completed simulator training yet.
          </p>
        </GlassCard>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {participants.map((participant) => (
            <GlassCard key={participant.name} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {participant.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {participant.totalSessions} completed training{" "}
                    {participant.totalSessions === 1 ? "session" : "sessions"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    participant.latestSession.result === "PASS"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  Latest: {participant.latestSession.result}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <Metric label="Sessions" value={participant.totalSessions} />

                <Metric label="Passed" value={participant.passedSessions} />

                <Metric label="Failed" value={participant.failedSessions} />
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Latest Performance
                </p>

                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Theory</p>
                    <p className="mt-1 font-bold text-slate-900">
                      {participant.latestSession.theoryScore}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Simulator</p>
                    <p className="mt-1 font-bold text-slate-900">
                      {participant.latestSession.simulatorScore}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Overall</p>
                    <p className="mt-1 font-bold text-slate-900">
                      {participant.latestSession.overallScore}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <Link
                  href={`/instructor/feedback?sessionId=${participant.latestSession.simulationSessionId}`}
                  className="text-sm font-semibold text-[#006CB8] hover:text-[#005a9c]"
                >
                  View Latest Evaluation
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}
