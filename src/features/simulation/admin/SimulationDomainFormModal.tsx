"use client";
import ModalFrame from "@/components/shared/ModalFrame";

import Button from "@/components/ui/Button";

import { FormEvent, useEffect, useState } from "react";

import type {
  SimulationDomain,
  SimulationDomainRequest,
} from "@/types/admin-simulation";

interface SimulationDomainFormModalProps {
  open: boolean;
  domain?: SimulationDomain | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (request: SimulationDomainRequest) => void | Promise<void>;
}

export default function SimulationDomainFormModal({
  open,
  domain,
  loading = false,
  onClose,
  onSubmit,
}: SimulationDomainFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) return;

    setName(domain?.name ?? "");
    setDescription(domain?.description ?? "");
  }, [open, domain]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      name: name.trim(),
      description: description.trim() || null,
    });
  }

  return (
    <ModalFrame
      title={"Manage Simulation Domain"}
      onClose={onClose}
      busy={loading}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            {domain ? "Edit Simulation Domain" : "Add Simulation Domain"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {domain
              ? "Update the simulation domain information."
              : "Create a new domain for simulation scenarios."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Domain Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Urban Operations"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe this simulation domain..."
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
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

            <Button
              fullWidth={false}
              type="submit"
              disabled={loading || !name.trim()}
              className="rounded-xl bg-[#006CB8] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#005a9c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : domain
                  ? "Save Changes"
                  : "Create Domain"}
            </Button>
          </div>
        </form>
      </div>
    </ModalFrame>
  );
}
