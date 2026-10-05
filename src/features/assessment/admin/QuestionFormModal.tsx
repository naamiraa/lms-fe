"use client";

import { FormEvent, useEffect, useState } from "react";
import type {
  AssessmentQuestion,
  QuestionOptionRequest,
  UpdateAssessmentQuestionRequest,
} from "@/types/admin-assessment";

interface QuestionFormModalProps {
  question?: AssessmentQuestion | null;
  onClose: () => void;
  onSubmit: (data: UpdateAssessmentQuestionRequest) => Promise<void>;
}

const emptyOptions = (): QuestionOptionRequest[] => [
  { optionText: "", isCorrect: true, order: 1 },
  { optionText: "", isCorrect: false, order: 2 },
  { optionText: "", isCorrect: false, order: 3 },
  { optionText: "", isCorrect: false, order: 4 },
];

export default function QuestionFormModal({
  question,
  onClose,
  onSubmit,
}: QuestionFormModalProps) {
  const [questionText, setQuestionText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [order, setOrder] = useState(1);
  const [options, setOptions] =
    useState<QuestionOptionRequest[]>(emptyOptions());

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(question);

  useEffect(() => {
    if (!question) return;

    setQuestionText(question.questionText);
    setMediaUrl(question.mediaUrl ?? "");
    setOrder(question.order);

    const existingOptions = [...question.options]
      .sort((a, b) => a.order - b.order)
      .map((option) => ({
        optionText: option.optionText,
        isCorrect: option.isCorrect,
        order: option.order,
      }));

    setOptions(existingOptions);
  }, [question]);

  function updateOptionText(index: number, value: string) {
    setOptions((current) =>
      current.map((option, optionIndex) =>
        optionIndex === index
          ? { ...option, optionText: value }
          : option
      )
    );
  }

  function setCorrectOption(index: number) {
    setOptions((current) =>
      current.map((option, optionIndex) => ({
        ...option,
        isCorrect: optionIndex === index,
      }))
    );
  }

  function addOption() {
    setOptions((current) => [
      ...current,
      {
        optionText: "",
        isCorrect: false,
        order: current.length + 1,
      },
    ]);
  }

  function removeOption(index: number) {
    if (options.length <= 2) {
      setError("A question must have at least 2 options.");
      return;
    }

    const next = options
      .filter((_, optionIndex) => optionIndex !== index)
      .map((option, optionIndex) => ({
        ...option,
        order: optionIndex + 1,
      }));

    if (!next.some((option) => option.isCorrect)) {
      next[0].isCorrect = true;
    }

    setOptions(next);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedOptions = options.map((option, index) => ({
      ...option,
      optionText: option.optionText.trim(),
      order: index + 1,
    }));

    if (cleanedOptions.some((option) => !option.optionText)) {
      setError("All answer options must be filled.");
      return;
    }

    if (!cleanedOptions.some((option) => option.isCorrect)) {
      setError("Select one correct answer.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSubmit({
        questionText: questionText.trim(),
        mediaUrl: mediaUrl.trim() || null,
        order,
        options: cleanedOptions,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save question."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Edit Question" : "Add Question"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Configure the question and its answer options.
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
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className={labelClass}>Question</label>
            <textarea
              required
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter assessment question"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_140px]">
            <div>
              <label className={labelClass}>Media URL</label>
              <input
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Optional image or media URL"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Order</label>
              <input
                required
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Answer Options
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Select the radio button for the correct answer.
                </p>
              </div>

              <button
                type="button"
                onClick={addOption}
                className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
              >
                + Add Option
              </button>
            </div>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                >
                  <input
                    type="radio"
                    name="correctOption"
                    checked={option.isCorrect}
                    onChange={() => setCorrectOption(index)}
                    className="h-4 w-4"
                  />

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
                    {String.fromCharCode(65 + index)}
                  </div>

                  <input
                    required
                    value={option.optionText}
                    onChange={(e) =>
                      updateOptionText(index, e.target.value)
                    }
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="rounded-lg px-2 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}