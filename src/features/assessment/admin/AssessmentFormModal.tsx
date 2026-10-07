"use client";
import ModalFrame from "@/components/shared/ModalFrame";

import Button from "@/components/ui/Button";

import Alert from "@/components/shared/Alert";

import { FormEvent, useEffect, useState } from "react";
import type { Assessment } from "@/types/admin-assessment";
import type { LearningModule } from "@/types/admin-learning";

interface AssessmentFormModalProps {
  assessment?: Assessment | null;
  learningModules: LearningModule[];
  onClose: () => void;
  onSubmit: (data: {
    learningModuleId: string;
    title: string;
    type: string;
    description: string | null;
    durationMinutes: number;
    passingScore: number;
    maxAttempts: number;
  }) => Promise<void>;
}

export default function AssessmentFormModal({
  assessment,
  learningModules,
  onClose,
  onSubmit,
}: AssessmentFormModalProps) {
  const [learningModuleId, setLearningModuleId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [passingScore, setPassingScore] = useState(80);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(assessment);

  useEffect(() => {
    if (assessment) {
      setLearningModuleId(assessment.learningModuleId);
      setTitle(assessment.title);
      setDescription(assessment.description ?? "");
      setDurationMinutes(assessment.durationMinutes);
      setPassingScore(assessment.passingScore);
      setMaxAttempts(assessment.maxAttempts);
      return;
    }

    if (learningModules.length > 0) {
      setLearningModuleId(learningModules[0].id);
    }
  }, [assessment, learningModules]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!learningModuleId) {
      setError("Learning module is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSubmit({
        learningModuleId,
        title: title.trim(),
        type: assessment?.type || "POST_TEST",
        description: description.trim() || null,
        durationMinutes,
        passingScore,
        maxAttempts,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save assessment.",
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <ModalFrame title={"Manage Assessment"} onClose={onClose} busy={saving}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Edit Assessment" : "Add Assessment"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Configure the theory assessment for a learning module.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && <Alert>{error}</Alert>}

          <div>
            <label className={labelClass}>Learning Module</label>
            <select
              required
              value={learningModuleId}
              onChange={(e) => setLearningModuleId(e.target.value)}
              className={inputClass}
            >
              <option value="">Select learning module</option>

              {learningModules
                .filter((module) => module.isActive)
                .map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.trainingDomainName} — {module.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Assessment Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Defensive Driving Post Test"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Assessment Type</label>
            <input
              value={assessment?.type || "POST_TEST"}
              disabled
              className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Current assessment flow uses POST_TEST.
            </p>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Assessment description"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className={labelClass}>Duration (minutes)</label>
              <input
                required
                type="number"
                min={1}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Passing Score</label>
              <input
                required
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Max Attempts</label>
              <input
                required
                type="number"
                min={1}
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <Button
              fullWidth={false}
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#006CB8] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#005a9c] disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Assessment"}
            </Button>
          </div>
        </form>
      </div>
    </ModalFrame>
  );
}
