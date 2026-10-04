"use client";

import { useEffect, useState } from "react";
import {
  createSimulationSession,
  getSimulationDomains,
  getSimulationScenariosByDomain,
} from "@/services/simulation.service";
import type {
  SimulationDomain,
  SimulationScenario,
  SimulationSession,
} from "@/types/simulation";
import { useSearchParams } from "next/navigation";

export default function SimulationView() {

    const searchParams = useSearchParams();

    const assessmentAttemptId =
    searchParams.get("assessmentAttemptId");

    const [isCreatingSession, setIsCreatingSession] =
    useState(false);

  const [domains, setDomains] = useState<
    SimulationDomain[]
  >([]);

  const [scenarios, setScenarios] = useState<
    SimulationScenario[]
  >([]);

  const [session, setSession] =
  useState<SimulationSession | null>(null);

  const [selectedDomainId, setSelectedDomainId] =
    useState<string | null>(null);

  const [selectedScenarioId, setSelectedScenarioId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingScenarios, setLoadingScenarios] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDomains() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getSimulationDomains();

        setDomains(
          data.filter((domain) => domain.isActive)
        );
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load simulation domains."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDomains();
  }, []);

  async function handleSelectDomain(
        domainId: string
    ) {
        try {
        setSelectedDomainId(domainId);
        setSelectedScenarioId(null);
        setScenarios([]);
        setLoadingScenarios(true);
        setError("");

        const data =
            await getSimulationScenariosByDomain(
            domainId
            );

        setScenarios(
            data.filter(
            (scenario) => scenario.isActive
            )
        );
        } catch (err) {
        console.error(err);

        setError(
            err instanceof Error
            ? err.message
            : "Failed to load simulation scenarios."
        );
        } finally {
        setLoadingScenarios(false);
        }
    }

    async function handleContinue() {
    if (!assessmentAttemptId) {
        setError(
        "Assessment attempt was not found. Please complete the theory assessment first."
        );
        return;
    }

    if (!selectedScenarioId) {
        setError(
        "Please select a simulation scenario."
        );
        return;
    }

    try {
        setIsCreatingSession(true);
        setError("");

        const response =
        await createSimulationSession({
            assessmentAttemptId,
            simulationScenarioId:
            selectedScenarioId,
        });

        setSession(response);

    } catch (err) {
        console.error(err);

        setError(
        err instanceof Error
            ? err.message
            : "Failed to create simulation session."
        );
    } finally {
        setIsCreatingSession(false);
    }
    }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading simulation training...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-[#006CB8]">
          Simulator Training
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Simulation
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Select an operational domain and training
          scenario to prepare your simulator session.
        </p>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <span className="rounded-full bg-[#006CB8] px-3 py-1.5 font-semibold text-white">
          1
        </span>
        <span className="font-semibold text-slate-900">
          Operational Domain
        </span>

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
            selectedDomainId
              ? "font-semibold text-slate-900"
              : "text-slate-400"
          }
        >
          Training Scenario
        </span>


        <span className="text-slate-300">→</span>

            <span
            className={`rounded-full px-3 py-1.5 font-semibold ${
                session
                ? "bg-[#006CB8] text-white"
                : "bg-slate-100 text-slate-400"
            }`}
            >
            3
            </span>

            <span
            className={
                session
                ? "font-semibold text-slate-900"
                : "text-slate-400"
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
          Choose the environment for your simulator
          training.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {domains.map((domain) => {
            const selected =
              selectedDomainId === domain.id;

            return (
              <button
                key={domain.id}
                type="button"
                onClick={() =>
                  handleSelectDomain(domain.id)
                }
                className={`rounded-2xl border p-5 text-left shadow-sm transition ${
                  selected
                    ? "border-[#006CB8] bg-blue-50"
                    : "border-slate-200 bg-white hover:border-blue-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {domain.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {domain.description}
                    </p>
                  </div>

                  <span
                    className={`flex h-5 w-5 shrink-0 rounded-full border ${
                      selected
                        ? "border-[6px] border-[#006CB8]"
                        : "border-slate-300"
                    }`}
                  />
                </div>

                <p className="mt-4 text-xs font-semibold text-[#006CB8]">
                  {domain.scenarioCount} training scenario
                  {domain.scenarioCount === 1
                    ? ""
                    : "s"}
                </p>
              </button>
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
            Choose the scenario you want to run on the
            fleet safety simulator.
          </p>

          {loadingScenarios ? (
            <p className="mt-4 text-sm text-slate-500">
              Loading scenarios...
            </p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {scenarios.map((scenario) => {
                const selected =
                  selectedScenarioId ===
                  scenario.id;

                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() =>
                      setSelectedScenarioId(
                        scenario.id
                      )
                    }
                    className={`rounded-2xl border p-5 text-left shadow-sm transition ${
                      selected
                        ? "border-[#006CB8] bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {scenario.name}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {scenario.description}
                        </p>
                      </div>

                      <span
                        className={`flex h-5 w-5 shrink-0 rounded-full border ${
                          selected
                            ? "border-[6px] border-[#006CB8]"
                            : "border-slate-300"
                        }`}
                      />
                    </div>

                    <div className="mt-4 flex gap-2">
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        {scenario.difficulty}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {scenario.estimatedMinutes} min
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {selectedScenarioId && !session && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            disabled={isCreatingSession}
            className="rounded-xl bg-[#006CB8] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
            {isCreatingSession
                ? "Creating Session..."
                : "Continue →"}
            </button>
        </div>
      )}

      {session && (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700">
                ✓
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-emerald-700">
                Simulation Session Created
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                Session Ready
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                Your simulation session is ready. Continue
                your training using the fleet safety simulator.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Scenario
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                    {session.scenarioName}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                    </p>

                    <p className="mt-1 font-semibold text-emerald-600">
                    {session.status}
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
            </div>
            </div>
        </section>
        )}

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}