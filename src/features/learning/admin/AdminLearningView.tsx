"use client";
import AdminWorkflow from "@/components/shared/AdminWorkflow";
import AdminPhotoBanner from "@/components/shared/AdminPhotoBanner";
import AdminSelectionImage from "@/components/shared/AdminSelectionImage";
import Button from "@/components/ui/Button";

import Alert from "@/components/shared/Alert";

import LoadingState from "@/components/shared/LoadingState";

import GlassCard from "@/components/shared/GlassCard";

import PageHeader from "@/components/shared/PageHeader";

import SummaryCard from "@/components/shared/MetricCard";

import { useEffect, useRef, useState } from "react";

import type {
  TrainingDomain,
  LearningModule,
  LearningContent,
} from "@/types/admin-learning";

import LearningFormModal, { type LearningModalMode } from "./LearningFormModal";

import {
  getTrainingDomains,
  getLearningModulesByDomain,
  getLearningContentsByModule,
  createTrainingDomain,
  updateTrainingDomain,
  deactivateTrainingDomain,
  createLearningModule,
  updateLearningModule,
  deactivateLearningModule,
  createLearningContent,
  updateLearningContent,
  deactivateLearningContent,
} from "@/services/admin-learning.service";

export default function AdminLearningView() {
  const [domains, setDomains] = useState<TrainingDomain[]>([]);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [contents, setContents] = useState<LearningContent[]>([]);

  const [selectedDomain, setSelectedDomain] = useState<TrainingDomain | null>(
    null,
  );

  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modulesLoading, setModulesLoading] = useState(false);
  const [contentsLoading, setContentsLoading] = useState(false);
  const domainRequest = useRef(0);
  const contentRequest = useRef(0);

  const [modalMode, setModalMode] = useState<LearningModalMode | null>(null);

  const [editingDomain, setEditingDomain] = useState<TrainingDomain | null>(
    null,
  );

  const [editingModule, setEditingModule] = useState<LearningModule | null>(
    null,
  );

  const [editingContent, setEditingContent] = useState<LearningContent | null>(
    null,
  );

  useEffect(() => {
    loadDomains();
  }, []);



  async function loadDomains() {
    try {
      setLoading(true);
      setError("");

      const data = await getTrainingDomains();
      setDomains(data);

      if (data.length > 0) {
        await selectDomain(data[0]);
      } else {
        setSelectedDomain(null);
        setSelectedModule(null);
        setModules([]);
        setContents([]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load training domains.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function selectDomain(domain: TrainingDomain) {
    const request = ++domainRequest.current;
    ++contentRequest.current;
    setError("");
    setSelectedDomain(domain);
    setSelectedModule(null);
    setModules([]);
    setContents([]);
    setModulesLoading(true);
    setContentsLoading(false);
    try {
      const data = await getLearningModulesByDomain(domain.id);
      if (request !== domainRequest.current) return;
      const sorted = [...data].sort((a, b) => a.order - b.order);
      setModules(sorted);
      if (sorted.length > 0) await selectModule(sorted[0]);
    } catch (err) {
      if (request === domainRequest.current)
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load learning modules.",
        );
    } finally {
      if (request === domainRequest.current) setModulesLoading(false);
    }
  }
  async function selectModule(module: LearningModule) {
    const request = ++contentRequest.current;
    setError("");
    setSelectedModule(module);
    setContents([]);
    setContentsLoading(true);
    try {
      const data = await getLearningContentsByModule(module.id);
      if (request === contentRequest.current)
        setContents([...data].sort((a, b) => a.order - b.order));
    } catch (err) {
      if (request === contentRequest.current)
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load learning contents.",
        );
    } finally {
      if (request === contentRequest.current) setContentsLoading(false);
    }
  }

  function closeModal() {
    setModalMode(null);
    setEditingDomain(null);
    setEditingModule(null);
    setEditingContent(null);
  }

  function openAddDomain() {
    setEditingDomain(null);
    setModalMode("DOMAIN");
  }

  function openEditDomain(domain: TrainingDomain) {
    setEditingDomain(domain);
    setModalMode("DOMAIN");
  }

  function openAddModule() {
    if (!selectedDomain) return;

    setEditingModule(null);
    setModalMode("MODULE");
  }

  function openEditModule(module: LearningModule) {
    setEditingModule(module);
    setModalMode("MODULE");
  }

  function openAddContent() {
    if (!selectedModule) return;

    setEditingContent(null);
    setModalMode("CONTENT");
  }

  function openEditContent(content: LearningContent) {
    setEditingContent(content);
    setModalMode("CONTENT");
  }

  async function handleModalSubmit(data: Record<string, string | number>) {
    setError("");

    if (modalMode === "DOMAIN") {
      const request = {
        name: String(data.name),
        description: String(data.description || ""),
      };

      if (editingDomain) {
        await updateTrainingDomain(editingDomain.id, request);
      } else {
        await createTrainingDomain(request);
      }

      closeModal();
      await loadDomains();
      return;
    }

    if (modalMode === "MODULE" && selectedDomain) {
      const request = {
        trainingDomainId: selectedDomain.id,
        name: String(data.name),
        description: String(data.description || ""),
        order: Number(data.order),
      };

      if (editingModule) {
        await updateLearningModule(editingModule.id, request);
      } else {
        await createLearningModule(request);
      }

      closeModal();
      await selectDomain(selectedDomain);
      return;
    }

    if (modalMode === "CONTENT" && selectedModule) {
      const request = {
        learningModuleId: selectedModule.id,
        title: String(data.title),
        contentType: String(data.contentType),
        contentUrl: String(data.contentUrl || ""),
        description: String(data.description || ""),
        order: Number(data.order),
        estimatedMinutes: Number(data.estimatedMinutes),
      };

      if (editingContent) {
        await updateLearningContent(editingContent.id, request);
      } else {
        await createLearningContent(request);
      }

      closeModal();
      await selectModule(selectedModule);
    }
  }

  // DEACTIVATE

  async function handleDeactivateDomain(domain: TrainingDomain) {
    if (!window.confirm(`Deactivate "${domain.name}"?`)) {
      return;
    }

    try {
      setError("");

      await deactivateTrainingDomain(domain.id);
      await loadDomains();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to deactivate training domain.",
      );
    }
  }

  async function handleDeactivateModule(module: LearningModule) {
    if (!window.confirm(`Deactivate "${module.name}"?`)) {
      return;
    }

    try {
      setError("");

      await deactivateLearningModule(module.id);

      if (selectedDomain) {
        await selectDomain(selectedDomain);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to deactivate learning module.",
      );
    }
  }

  async function handleDeactivateContent(content: LearningContent) {
    if (!window.confirm(`Deactivate "${content.title}"?`)) {
      return;
    }

    try {
      setError("");

      await deactivateLearningContent(content.id);

      if (selectedModule) {
        await selectModule(selectedModule);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to deactivate learning content.",
      );
    }
  }

  if (loading) {
    return <LoadingState label="Loading learning management..." />;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title={<> Learning Management </>}
          description={
            <>
              {" "}
              Choose a training domain, open a module, then add or edit its
              learning materials.{" "}
            </>
          }
          eyebrow={<> Administration </>}
        />

        <Button
          fullWidth={false}
          type="button"
          onClick={openAddDomain}
          className="rounded-xl bg-[#006CB8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#005a9c]"
        >
          + Add Training Domain
        </Button>
      </div>

      {/* ERROR */}
      {error && <Alert>{error}</Alert>}

      {/* SUMMARY */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Training Domains" value={domains.length} />

        <SummaryCard
          label="Modules in Selected Domain"
          value={modules.length}
        />

        <SummaryCard
          label="Contents in Selected Module"
          value={contents.length}
        />
      </div>

      <AdminWorkflow
        steps={[
          {
            title: "Choose a training domain",
            description:
              "Domains group related training, such as Ground Operations.",
            selection: selectedDomain?.name,
          },
          {
            title: "Open a learning module",
            description: "A module is one topic inside the selected domain.",
            selection: selectedModule?.name,
          },
          {
            title: "Manage module materials",
            description: "Add videos, documents, or text to the open module.",
          },
        ]}
      />
      {/* HIERARCHY */}
      <div className="space-y-6">
        {/* ================= DOMAIN ================= */}
        <GlassCard as="section" className="overflow-hidden">
          <div className="border-b border-slate-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#006CB8]">
              Training categories
            </p>

            <h2 className="mt-1 font-bold text-slate-900">
              Choose a Training Domain
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Select a card below to show its modules. The highlighted card is
              currently open.
            </p>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className={`rounded-xl border p-4 transition ${
                  selectedDomain?.id === domain.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-transparent hover:bg-slate-50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectDomain(domain)}
                  aria-pressed={selectedDomain?.id === domain.id}
                  className="w-full text-left"
                >
                  <AdminSelectionImage name={domain.name} large />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {domain.name}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {domain.description || "No description"}
                      </p>
                    </div>

                    <ActiveBadge active={domain.isActive} />
                  </div>
                  <p className="mt-3 text-xs font-bold text-[#006CB8]">
                    {selectedDomain?.id === domain.id
                      ? "✓ Domain open"
                      : "View modules →"}
                  </p>
                </button>

                <div className="mt-3 flex gap-3 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => openEditDomain(domain)}
                    className="text-xs font-semibold text-[#006CB8] hover:text-[#005a9c]"
                  >
                    Edit
                  </button>

                  {domain.isActive && (
                    <button
                      type="button"
                      onClick={() => handleDeactivateDomain(domain)}
                      className="text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </div>
            ))}

            {domains.length === 0 && (
              <EmptyState text="No training domains available." />
            )}
          </div>
        </GlassCard>

        {selectedDomain && (
          <AdminPhotoBanner
            name={selectedDomain.name}
            title={selectedDomain.name}
            description="Modules below belong to this domain. Open a module on the left to manage its materials on the right."
          />
        )}
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)]">
          {/* ================= MODULE ================= */}
          <GlassCard as="section" className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#006CB8]">
                  Inside the selected domain
                </p>

                <h2 className="mt-1 font-bold text-slate-900">
                  Modules in This Domain
                </h2>
              </div>

              <button
                type="button"
                onClick={openAddModule}
                disabled={!selectedDomain}
                className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-[#006CB8] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                + Add Module
              </button>
            </div>

            {selectedDomain && (
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
                Domain:{" "}
                <span className="font-semibold text-slate-700">
                  {selectedDomain.name}
                </span>
              </div>
            )}

            <div className="space-y-2 p-3">
              {modulesLoading && (
                <LoadingState label="Loading modules in this domain..." />
              )}
              {modules.map((module) => (
                <div
                  key={module.id}
                  className={`rounded-xl border p-4 transition ${
                    selectedModule?.id === module.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectModule(module)}
                    aria-pressed={selectedModule?.id === module.id}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                        {module.order}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-slate-900">
                            {module.name}
                          </p>

                          <ActiveBadge active={module.isActive} />
                        </div>

                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {module.description || "No description"}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs font-bold text-[#006CB8]">
                      {selectedModule?.id === module.id
                        ? "✓ Showing materials"
                        : "Manage materials →"}
                    </p>
                  </button>

                  <div className="mt-3 flex gap-3 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => openEditModule(module)}
                      className="text-xs font-semibold text-[#006CB8] hover:text-[#005a9c]"
                    >
                      Edit
                    </button>

                    {module.isActive && (
                      <button
                        type="button"
                        onClick={() => handleDeactivateModule(module)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {!modulesLoading && modules.length === 0 && (
                <EmptyState
                  text={
                    selectedDomain
                      ? "This domain has no modules yet. Click Add Module to create a learning topic."
                      : "Select a training domain."
                  }
                />
              )}
            </div>
          </GlassCard>

          <GlassCard as="section" className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#006CB8]">
                  Inside the selected module
                </p>

                <h2 className="mt-1 font-bold text-slate-900">
                  Materials in This Module
                </h2>
              </div>

              <button
                type="button"
                onClick={openAddContent}
                disabled={!selectedModule}
                className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-[#006CB8] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                + Add Material
              </button>
            </div>

            {selectedModule && (
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
                Module:{" "}
                <span className="font-semibold text-slate-700">
                  {selectedModule.name}
                </span>
              </div>
            )}

            <div className="space-y-3 p-3">
              {contentsLoading && (
                <LoadingState label="Loading materials in this module..." />
              )}
              {contents.map((content) => (
                <div
                  key={content.id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                      {content.order}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-900">
                          {content.title}
                        </p>

                        <ActiveBadge active={content.isActive} />
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                          {content.contentType}
                        </span>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600">
                          {content.estimatedMinutes} min
                        </span>
                      </div>

                      {content.description && (
                        <p className="mt-2 line-clamp-2 text-xs text-slate-500">
                          {content.description}
                        </p>
                      )}

                      {content.contentUrl && (
                        <p className="mt-2 truncate text-xs text-slate-400">
                          {content.contentUrl}
                        </p>
                      )}

                      <div className="mt-3 flex gap-3 border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() => openEditContent(content)}
                          className="text-xs font-semibold text-[#006CB8] hover:text-[#005a9c]"
                        >
                          Edit
                        </button>

                        {content.isActive && (
                          <button
                            type="button"
                            onClick={() => handleDeactivateContent(content)}
                            className="text-xs font-semibold text-red-600 hover:text-red-700"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {!contentsLoading && contents.length === 0 && (
                <EmptyState
                  text={
                    selectedModule
                      ? "This module has no materials yet. Click Add Material to create its first lesson."
                      : "Select a learning module."
                  }
                />
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {modalMode && (
        <LearningFormModal
          open
          mode={modalMode}
          domain={editingDomain}
          module={editingModule}
          content={editingContent}
          parentLabel={
            modalMode === "MODULE"
              ? `Training domain: ${selectedDomain?.name}`
              : modalMode === "CONTENT"
                ? `Learning module: ${selectedModule?.name}`
                : undefined
          }
          onClose={closeModal}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}

function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {active ? "ACTIVE" : "INACTIVE"}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="px-4 py-10 text-center text-sm text-slate-400">{text}</div>
  );
}
