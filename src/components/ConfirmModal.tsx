"use client";
import ModalFrame from "@/components/shared/ModalFrame";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: "danger" | "success";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  const isSuccess = variant === "success";

  return (
    <ModalFrame title={title} onClose={onCancel} busy={loading}>
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="p-6">
          <div
            className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full font-semibold ${
              isSuccess
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {isSuccess ? "✓" : "!"}
          </div>

          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={loading}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 ${
              isSuccess
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}
