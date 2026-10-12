"use client";
import ScenarioSelectionCard from "@/components/shared/ScenarioSelectionCard";
import DomainSelectionCard from "@/components/shared/DomainSelectionCard";
import TrainingJourney from "@/components/shared/TrainingJourney";
import Button from "@/components/ui/Button";

import Alert from "@/components/shared/Alert";

import LoadingState from "@/components/shared/LoadingState";

import PageHeader from "@/components/shared/PageHeader";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  createSimulationSession,
  getSimulationDomains,
  getSimulationScenariosByDomain,
  getSimulationSession,
} from "@/services/simulation.service";

import type {
  SimulationDomain,
  SimulationScenario,
  SimulationSession,
  SimulationSessionDetail,
} from "@/types/simulation";

export default function SimulationView() {
  const searchParams = useSearchParams();

  const assessmentAttemptId = searchParams.get("assessmentAttemptId");

  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const [domains, setDomains] = useState<SimulationDomain[]>([]);

  const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);

  const [session, setSession] = useState<SimulationSession | null>(null);

  const [sessionDetail, setSessionDetail] =
    useState<SimulationSessionDetail | null>(null);

  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);

  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [loadingScenarios, setLoadingScenarios] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDomains() {
      try {
        setLoading(true);
        setError("");

        const data = await getSimulationDomains();

        setDomains(data.filter((domain) => domain.isActive));
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load simulation domains.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDomains();
  }, []);

  useEffect(() => {
    const storedSession = sessionStorage.getItem(
      "lms_active_simulation_session",
    );

    if (!storedSession || !assessmentAttemptId) {
      return;
    }

    try {
      const parsedSession = JSON.parse(storedSession) as SimulationSession;

      const storedAssessmentAttemptId = sessionStorage.getItem(
        "lms_active_simulation_assessment_attempt",
      );

      if (storedAssessmentAttemptId === assessmentAttemptId) {
        setSession(parsedSession);
      }
    } catch (err) {
      console.error("Failed to restore simulation session:", err);

      sessionStorage.removeItem("lms_active_simulation_session");

      sessionStorage.removeItem("lms_active_simulation_assessment_attempt");
    }
  }, [assessmentAttemptId]);

  async function handleSelectDomain(domainId: string) {
    try {
      setSelectedDomainId(domainId);
      setSelectedScenarioId(null);
      setScenarios([]);
      setLoadingScenarios(true);
      setError("");

      const data = await getSimulationScenariosByDomain(domainId);

      setScenarios(data.filter((scenario) => scenario.isActive));
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load simulation scenarios.",
      );
    } finally {
      setLoadingScenarios(false);
    }
  }

  async function handleContinue() {
    if (!assessmentAttemptId) {
      setError(
        "Assessment attempt was not found. Please complete the theory assessment first.",
      );
      return;
    }

    if (!selectedScenarioId) {
      setError("Please select a simulation scenario.");
      return;
    }

    try {
      setIsCreatingSession(true);
      setError("");

      const response = await createSimulationSession({
        assessmentAttemptId,
        simulationScenarioId: selectedScenarioId,
      });

      setSession(response);

      sessionStorage.setItem(
        "lms_active_simulation_session",
        JSON.stringify(response),
      );

      sessionStorage.setItem(
        "lms_active_simulation_assessment_attempt",
        assessmentAttemptId,
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create simulation session.",
      );
    } finally {
      setIsCreatingSession(false);
    }
  }

  useEffect(() => {
    if (!session?.sessionId || sessionDetail?.status === "COMPLETED") {
      return;
    }

    let cancelled = false;

    async function refreshSession() {
      try {
        const data = await getSimulationSession(session!.sessionId);

        if (!cancelled) {
          setSessionDetail(data);
        }
      } catch (err) {
        console.error("Failed to refresh simulation session:", err);
      }
    }

    refreshSession();

    const intervalId = window.setInterval(refreshSession, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [session?.sessionId, sessionDetail?.status]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingState label="Loading simulation training..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        tone="brand"
        title={<> Simulation </>}
        description={
          <>
            {" "}
            Select an operational domain and training scenario to prepare your
            simulator session.{" "}
          </>
        }
        eyebrow={<> Simulator Training </>}
      />

      <TrainingJourney active={2} />
      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
        <span className="rounded-full bg-[#006CB8] px-3 py-1.5 font-semibold text-white">
          1
        </span>
        <span className="font-semibold text-slate-900">Operational Domain</span>

        <span className="text-slate-300">→</span>

        <span
          className={`rounded-full px-3 py-1.5 font-semibold ${
            selectedDomainId
              ? "bg-[#006CB8] text-white"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          2
        </span>

        <span
          className={
            selectedDomainId ? "font-semibold text-slate-900" : "text-slate-400"
          }
        >
          Training Scenario
        </span>

        <span className="text-slate-300">→</span>

        <span
          className={`rounded-full px-3 py-1.5 font-semibold ${
            session ? "bg-[#006CB8] text-white" : "bg-slate-100 text-slate-400"
          }`}
        >
          3
        </span>

        <span
          className={
            session ? "font-semibold text-slate-900" : "text-slate-400"
          }
        >
          Session Ready
        </span>
      </div>

      <section>
        <h2 className="text-lg font-bold text-slate-900">
          Select Operational Domain
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose the environment for your simulator training.
        </p>

        {domains.length === 0 && (
          <p className="mt-4 rounded-2xl bg-white/80 p-6 text-sm text-slate-500">
            No active operational domains are available yet.
          </p>
        )}
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {domains.map((domain) => {
            const selected = selectedDomainId === domain.id;

            return (
              <DomainSelectionCard
                key={domain.id}
                name={domain.name}
                description={domain.description}
                count={domain.scenarioCount}
                selected={selected}
                onSelect={() => handleSelectDomain(domain.id)}
              />
            );
          })}
        </div>
      </section>

      {selectedDomainId && (
        <section>
          <h2 className="text-lg font-bold text-slate-900">
            Select Training Scenario
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose the scenario you want to run on the fleet safety simulator.
          </p>

          {loadingScenarios ? (
            <LoadingState label="Loading scenarios..." />
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {scenarios.length === 0 && (
                <p className="rounded-2xl bg-white/80 p-6 text-sm text-slate-500">
                  No active scenarios have been added to this domain yet.
                </p>
              )}
              {scenarios.map((scenario, index) => {
                const selected = selectedScenarioId === scenario.id;

                return (
                  <ScenarioSelectionCard
                    key={scenario.id}
                    scenario={scenario}
                    number={index + 1}
                    selected={selected}
                    onSelect={() => setSelectedScenarioId(scenario.id)}
                  />
                );
              })}
            </div>
          )}
        </section>
      )}

      {selectedScenarioId && !session && (
        <div className="flex justify-end">
          <Button
            fullWidth={false}
            type="button"
            onClick={handleContinue}
            disabled={isCreatingSession}
            className="rounded-xl bg-[#006CB8] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreatingSession ? "Creating Session..." : "Continue →"}
          </Button>
        </div>
      )}

      {session && (
        <section
          className={`rounded-2xl border p-6 ${
            sessionDetail?.status === "COMPLETED"
              ? "border-emerald-100 bg-emerald-50"
              : sessionDetail?.status === "IN_PROGRESS"
                ? "border-blue-100 bg-blue-50"
                : "border-amber-100 bg-amber-50"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${
                sessionDetail?.status === "COMPLETED"
                  ? "bg-emerald-100 text-emerald-700"
                  : sessionDetail?.status === "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {sessionDetail?.status === "COMPLETED"
                ? "✓"
                : sessionDetail?.status === "IN_PROGRESS"
                  ? "▶"
                  : "⌛"}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold ${
                  sessionDetail?.status === "COMPLETED"
                    ? "text-emerald-700"
                    : sessionDetail?.status === "IN_PROGRESS"
                      ? "text-blue-700"
                      : "text-amber-700"
                }`}
              >
                {sessionDetail?.status === "COMPLETED"
                  ? "Simulation Completed"
                  : sessionDetail?.status === "IN_PROGRESS"
                    ? "Simulation In Progress"
                    : "Simulation Session Created"}
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {sessionDetail?.status === "COMPLETED"
                  ? "Training Completed"
                  : sessionDetail?.status === "IN_PROGRESS"
                    ? "Training In Progress"
                    : "Session Ready"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {sessionDetail?.status === "COMPLETED"
                  ? "Your simulator training has been completed. Your final performance evaluation is now available."
                  : sessionDetail?.status === "IN_PROGRESS"
                    ? "Your simulator training is currently in progress. Complete the session on the fleet safety simulator."
                    : "Your simulation session is ready. Continue your training using the fleet safety simulator."}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Scenario
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {sessionDetail?.simulationScenarioName ??
                      session.scenarioName}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {sessionDetail?.status ?? session.status}
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-xl bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Session ID
                </p>

                <p className="mt-1 break-all font-mono text-sm text-slate-700">
                  {session.sessionId}
                </p>
              </div>

              {sessionDetail?.status === "COMPLETED" && (
                <div className="mt-5 flex justify-end">
                  <Link
                    href={`/performance?sessionId=${encodeURIComponent(
                      session.sessionId,
                    )}`}
                    className="rounded-xl bg-[#006CB8] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    View Performance
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {error && <Alert>{error}</Alert>}
    </div>
  );
}
