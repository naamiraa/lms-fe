"use client";

import { FormEvent, useEffect, useState } from "react";

import type {
  SimulationDomain,
  SimulationScenario,
  SimulationScenarioRequest,
} from "@/types/admin-simulation";

interface SimulationScenarioFormModalProps {
  open: boolean;
  scenario?: SimulationScenario | null;
  domains: SimulationDomain[];
  defaultDomainId?: string;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (request: SimulationScenarioRequest) => void | Promise<void>;
}

export default function SimulationScenarioFormModal({
  open,
  scenario,
  domains,
  defaultDomainId,
  loading = false,
  onClose,
  onSubmit,
}: SimulationScenarioFormModalProps) {
  const [simulationDomainId, setSimulationDomainId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);

  useEffect(() => {
    if (!open) return;

    setSimulationDomainId(
      scenario?.simulationDomainId ??
        defaultDomainId ??
        domains.find((domain) => domain.isActive)?.id ??
        ""
    );

    setName(scenario?.name ?? "");
    setDescription(scenario?.description ?? "");
    setDifficulty(scenario?.difficulty ?? "");
    setEstimatedMinutes(scenario?.estimatedMinutes ?? 30);
  }, [open, scenario, defaultDomainId, domains]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      simulationDomainId,
      name: name.trim(),
      description: description.trim() || null,
      difficulty: difficulty.trim() || null,
      estimatedMinutes,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            {scenario
              ? "Edit Simulation Scenario"
              : "Add Simulation Scenario"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Configure the scenario used during simulator training.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Simulation Domain
              </label>

              <select
                value={simulationDomainId}
                onChange={(event) =>
                  setSimulationDomainId(event.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select domain</option>

                {domains
                  .filter(
                    (domain) =>
                      domain.isActive ||
                      domain.id === scenario?.simulationDomainId
                  )
                  .map((domain) => (
                    <option key={domain.id} value={domain.id}>
                      {domain.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Scenario Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Urban Delivery - Wet Road"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the simulation scenario..."
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Difficulty
                </label>

                <input
                  type="text"
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value)}
                  placeholder="e.g. Medium"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Optional
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Estimated Duration
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={estimatedMinutes}
                    onChange={(event) =>
                      setEstimatedMinutes(Number(event.target.value))
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-20 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    minutes
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                !simulationDomainId ||
                !name.trim() ||
                estimatedMinutes < 1
              }
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : scenario
                  ? "Save Changes"
                  : "Create Scenario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}