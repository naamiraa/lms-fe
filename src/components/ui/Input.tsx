import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        {...props}
        className={`
          w-full rounded-xl border px-4 py-3
          text-slate-900 outline-none transition
          placeholder:text-slate-400
          focus:border-[#006CB8]
          focus:ring-2 focus:ring-[#006CB8]/15
          ${
            error
              ? "border-red-500"
              : "border-slate-200"
          }
          ${className}
        `}
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}