"use client";
import ModalFrame from "@/components/shared/ModalFrame";

import Button from "@/components/ui/Button";

import Alert from "@/components/shared/Alert";

import { useEffect, useState } from "react";
import type {
  TrainingDomain,
  LearningModule,
  LearningContent,
} from "@/types/admin-learning";

export type LearningModalMode = "DOMAIN" | "MODULE" | "CONTENT";

interface Props {
  open: boolean;
  mode: LearningModalMode;

  domain?: TrainingDomain | null;
  module?: LearningModule | null;
  content?: LearningContent | null;
  parentLabel?: string;

  onClose: () => void;
  onSubmit: (data: Record<string, string | number>) => Promise<void>;
}

export default function LearningFormModal({
  open,
  mode,
  domain,
  module,
  content,
  parentLabel,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("VIDEO");
  const [contentUrl, setContentUrl] = useState("");

  const [order, setOrder] = useState(1);
  const [estimatedMinutes, setEstimatedMinutes] = useState(10);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setError("");

    if (mode === "DOMAIN") {
      setName(domain?.name ?? "");
      setDescription(domain?.description ?? "");
    }

    if (mode === "MODULE") {
      setName(module?.name ?? "");
      setDescription(module?.description ?? "");
      setOrder(module?.order ?? 1);
    }

    if (mode === "CONTENT") {
      setTitle(content?.title ?? "");
      setContentType(content?.contentType ?? "VIDEO");
      setContentUrl(content?.contentUrl ?? "");
      setDescription(content?.description ?? "");
      setOrder(content?.order ?? 1);
      setEstimatedMinutes(content?.estimatedMinutes ?? 10);
    }
  }, [open, mode, domain, module, content]);

  if (!open) return null;

  const editing =
    (mode === "DOMAIN" && !!domain) ||
    (mode === "MODULE" && !!module) ||
    (mode === "CONTENT" && !!content);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (mode === "DOMAIN") {
        await onSubmit({
          name,
          description,
        });
      }

      if (mode === "MODULE") {
        await onSubmit({
          name,
          description,
          order,
        });
      }

      if (mode === "CONTENT") {
        await onSubmit({
          title,
          contentType,
          contentUrl,
          description,
          order,
          estimatedMinutes,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save data.");
    } finally {
      setSaving(false);
    }
  }

  const titleText =
    mode === "DOMAIN"
      ? `${editing ? "Edit" : "Add"} Training Domain`
      : mode === "MODULE"
        ? `${editing ? "Edit" : "Add"} Learning Module`
        : `${editing ? "Edit" : "Add"} Learning Content`;

  return (
    <ModalFrame title={titleText} onClose={onClose} busy={saving}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#006CB8]">
              Learning Management
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {titleText}
            </h2>
            {parentLabel && (
              <p className="mt-2 text-sm text-[#006CB8]">{parentLabel}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && <Alert>{error}</Alert>}

          {mode !== "CONTENT" && (
            <Field label={mode === "DOMAIN" ? "Domain Name" : "Module Name"}>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder={
                  mode === "DOMAIN"
                    ? "e.g. Fleet Safety Operations"
                    : "e.g. Defensive Driving"
                }
              />
            </Field>
          )}

          {mode === "CONTENT" && (
            <>
              <Field label="Content Title">
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Introduction to Defensive Driving"
                />
              </Field>

              <Field label="Content Type">
                <select
                  required
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className={inputClass}
                >
                  <option value="TEXT">Text</option>
                  <option value="VIDEO">Video</option>
                  <option value="PDF">PDF</option>
                  <option value="LINK">Link</option>
                </select>
              </Field>

              <Field label="Content URL">
                <input
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  className={inputClass}
                  placeholder="https://... or /videos/lesson.mp4"
                  aria-describedby="content-url-help"
                />
                <p
                  id="content-url-help"
                  className="mt-2 text-xs leading-5 text-slate-500"
                >
                  Use a public MP4/WebM, YouTube, Vimeo, or Google Drive file
                  link. Local files in public/videos use /videos/filename.mp4;
                  files on the backend need the full backend URL. The link must
                  be accessible to participants.
                </p>
              </Field>
            </>
          )}

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} min-h-24 resize-y`}
              placeholder="Enter description..."
            />
          </Field>

          {(mode === "MODULE" || mode === "CONTENT") && (
            <Field label="Order">
              <input
                required
                min={1}
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
          )}

          {mode === "CONTENT" && (
            <Field label="Estimated Duration (minutes)">
              <input
                required
                min={1}
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>

            <Button
              fullWidth={false}
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#006CB8] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : editing ? "Save Changes" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </ModalFrame>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500";
