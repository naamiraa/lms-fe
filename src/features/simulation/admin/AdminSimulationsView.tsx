"use client";

import { useEffect, useMemo, useState } from "react";

import ConfirmModal from "@/components/ConfirmModal";
import {
  createSimulationDomain,
  createSimulationScenario,
  deactivateSimulationDomain,
  deactivateSimulationScenario,
  getSimulationDomains,
  getSimulationScenariosByDomain,
  updateSimulationDomain,
  updateSimulationScenario,
} from "@/services/admin-simulation.service";
import type {
  SimulationDomain,
  SimulationDomainRequest,
  SimulationScenario,
  SimulationScenarioRequest,
} from "@/types/admin-simulation";

import SimulationDomainFormModal from "./SimulationDomainFormModal";
import SimulationScenarioFormModal from "./SimulationScenarioFormModal";

export default function AdminSimulationsView() {
  const [domains, setDomains] = useState<SimulationDomain[]>([]);
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);

  const [selectedDomainId, setSelectedDomainId] = useState("");
  const [editingDomain, setEditingDomain] =
    useState<SimulationDomain | null>(null);
  const [editingScenario, setEditingScenario] =
    useState<SimulationScenario | null>(null);

  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [error, setError] = useState("");

  const [confirmAction, setConfirmAction] = useState<{
    type: "DOMAIN" | "SCENARIO";
    id: string;
    name: string;
  } | null>(null);

  const selectedDomain = useMemo(
    () => domains.find((domain) => domain.id === selectedDomainId) ?? null,
    [domains, selectedDomainId]
  );

  const totalScenarios = domains.reduce(
    (total, domain) => total + domain.scenarioCount,
    0
  );

  const activeDomains = domains.filter((domain) => domain.isActive).length;
  const activeScenarios = scenarios.filter(
    (scenario) => scenario.isActive
  ).length;

  async function loadDomains() {
    const data = await getSimulationDomains();
    setDomains(data);

    setSelectedDomainId((current) => {
      if (current && data.some((domain) => domain.id === current)) {
        return current;
      }

      return (
        data.find((domain) => domain.isActive)?.id ??
        data[0]?.id ??
        ""
      );
    });
  }

  async function loadScenarios(domainId: string) {
    const data = await getSimulationScenariosByDomain(domainId);
    setScenarios(data);
  }

  useEffect(() => {
    async function initialize() {
      try {
        setLoading(true);
        setError("");
        await loadDomains();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load simulation management."
        );
      } finally {
        setLoading(false);
      }
    }

    void initialize();
  }, []);

  useEffect(() => {
    if (!selectedDomainId) {
      setScenarios([]);
      return;
    }

    async function fetchScenarios() {
      try {
        setError("");
        await loadScenarios(selectedDomainId);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load simulation scenarios."
        );
      }
    }

    void fetchScenarios();
  }, [selectedDomainId]);

  function openCreateDomain() {
    setEditingDomain(null);
    setDomainModalOpen(true);
  }

  function openEditDomain(domain: SimulationDomain) {
    setEditingDomain(domain);
    setDomainModalOpen(true);
  }

  function openCreateScenario() {
    setEditingScenario(null);
    setScenarioModalOpen(true);
  }

  function openEditScenario(scenario: SimulationScenario) {
    setEditingScenario(scenario);
    setScenarioModalOpen(true);
  }

  async function handleDomainSubmit(
    request: SimulationDomainRequest
  ) {
    try {
      setSaving(true);
      setError("");

      if (editingDomain) {
        await updateSimulationDomain(editingDomain.id, request);
      } else {
        const created = await createSimulationDomain(request);
        setSelectedDomainId(created.id);
      }

      setDomainModalOpen(false);
      setEditingDomain(null);
      await loadDomains();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save simulation domain."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleScenarioSubmit(
    request: SimulationScenarioRequest
  ) {
    try {
      setSaving(true);
      setError("");

      if (editingScenario) {
        await updateSimulationScenario(editingScenario.id, request);
      } else {
        await createSimulationScenario(request);
      }

      setScenarioModalOpen(false);
      setEditingScenario(null);

      await loadDomains();

      if (request.simulationDomainId !== selectedDomainId) {
        setSelectedDomainId(request.simulationDomainId);
      } else {
        await loadScenarios(request.simulationDomainId);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save simulation scenario."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleDeactivateDomain(domain: SimulationDomain) {
    setConfirmAction({
      type: "DOMAIN",
      id: domain.id,
      name: domain.name,
    });
  }

  function handleDeactivateScenario(scenario: SimulationScenario) {
    setConfirmAction({
      type: "SCENARIO",
      id: scenario.id,
      name: scenario.name,
    });
  }

  async function handleConfirmDeactivate() {
    if (!confirmAction) return;

    try {
      setDeactivating(true);
      setError("");

      if (confirmAction.type === "DOMAIN") {
        await deactivateSimulationDomain(confirmAction.id);
        setConfirmAction(null);
        await loadDomains();
        return;
      }

      await deactivateSimulationScenario(confirmAction.id);
      setConfirmAction(null);

      if (selectedDomainId) {
        await Promise.all([
          loadScenarios(selectedDomainId),
          loadDomains(),
        ]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to deactivate item."
      );
    } finally {
      setDeactivating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-sm text-slate-500">
        Loading simulation management...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Simulation Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage simulator training domains and scenarios.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Simulation Domains"
          value={domains.length}
          detail={`${activeDomains} active`}
        />
        <SummaryCard
          label="Total Scenarios"
          value={totalScenarios}
          detail="Across all domains"
        />
        <SummaryCard
          label="Active Scenarios"
          value={activeScenarios}
          detail={
            selectedDomain
              ? `In ${selectedDomain.name}`
              : "Select a domain"
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Simulation Domains
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Select a domain to manage its scenarios.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateDomain}
              className="rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Add Domain
            </button>
          </div>

          <div className="space-y-3 p-4">
            {domains.length === 0 ? (
              <EmptyState message="No simulation domains available." />
            ) : (
              domains.map((domain) => {
                const selected = domain.id === selectedDomainId;

                return (
                  <div
                    key={domain.id}
                    className={`rounded-xl border p-4 transition ${
                      selected
                        ? "border-blue-300 bg-blue-50/60"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedDomainId(domain.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-medium text-slate-900">
                            {domain.name}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                            {domain.description || "No description"}
                          </p>
                        </div>

                        <StatusBadge active={domain.isActive} />
                      </div>

                      <p className="mt-3 text-xs font-medium text-slate-500">
                        {domain.scenarioCount} scenario
                        {domain.scenarioCount === 1 ? "" : "s"}
                      </p>
                    </button>

                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => openEditDomain(domain)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      {domain.isActive && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeactivateDomain(domain)
                          }
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Simulation Scenarios
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {selectedDomain
                  ? `Scenarios in ${selectedDomain.name}`
                  : "Select a simulation domain."}
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateScenario}
              disabled={!selectedDomainId}
              className="rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Add Scenario
            </button>
          </div>

          <div className="p-4">
            {!selectedDomainId ? (
              <EmptyState message="Select a domain to view scenarios." />
            ) : scenarios.length === 0 ? (
              <EmptyState message="No scenarios available in this domain." />
            ) : (
              <div className="space-y-3">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium text-slate-900">
                            {scenario.name}
                          </h3>
                          <StatusBadge active={scenario.isActive} />
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {scenario.description || "No description"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-slate-600">
                        Difficulty: {scenario.difficulty || "Not set"}
                      </span>
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-slate-600">
                        {scenario.estimatedMinutes} minutes
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => openEditScenario(scenario)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      {scenario.isActive && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeactivateScenario(scenario)
                          }
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <SimulationDomainFormModal
        open={domainModalOpen}
        domain={editingDomain}
        loading={saving}
        onClose={() => {
          if (!saving) {
            setDomainModalOpen(false);
            setEditingDomain(null);
          }
        }}
        onSubmit={handleDomainSubmit}
      />

      <SimulationScenarioFormModal
        open={scenarioModalOpen}
        scenario={editingScenario}
        domains={domains}
        defaultDomainId={selectedDomainId}
        loading={saving}
        onClose={() => {
          if (!saving) {
            setScenarioModalOpen(false);
            setEditingScenario(null);
          }
        }}
        onSubmit={handleScenarioSubmit}
      />

      <ConfirmModal
        open={confirmAction !== null}
        title={
          confirmAction?.type === "DOMAIN"
            ? "Deactivate Simulation Domain?"
            : "Deactivate Simulation Scenario?"
        }
        message={
          confirmAction
            ? `Are you sure you want to deactivate "${confirmAction.name}"? This item will no longer be available for active use.`
            : ""
        }
        confirmLabel="Deactivate"
        loading={deactivating}
        onCancel={() => {
          if (!deactivating) {
            setConfirmAction(null);
          }
        }}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {active ? "ACTIVE" : "INACTIVE"}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center text-sm text-slate-400">
      {message}
    </div>
  );
}