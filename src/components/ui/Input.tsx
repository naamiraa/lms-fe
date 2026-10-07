"use client";
import { useId, useState, type InputHTMLAttributes } from "react";
import Icon from "@/components/ui/Icon";
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export default function Input({
  label,
  error,
  id,
  className = "",
  type = "text",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);
  const password = type === "password";
  const errorId = `${inputId}-error`;
  return (
    <div className="space-y-2">
      <div>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-slate-700"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-[#006CB8]" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
      </div>
      <div className="relative">
        <input
          {...props}
          id={inputId}
          type={password && visible ? "text" : type}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={
            [props["aria-describedby"], error ? errorId : undefined]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={`min-h-12 w-full rounded-xl border bg-white/85 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#006CB8] focus:ring-4 focus:ring-[#006CB8]/10 disabled:cursor-not-allowed disabled:bg-slate-100 ${error ? "border-red-400" : "border-slate-200/90"} ${password ? "pr-12" : ""} ${className}`}
        />
        {password && (
          <button
            type="button"
            disabled={props.disabled}
            onClick={() => setVisible(!visible)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="absolute inset-y-0 right-1 flex w-11 items-center justify-center rounded-lg text-slate-400 hover:text-[#006CB8] focus-visible:outline-2 focus-visible:outline-[#006CB8]"
          >
            <Icon name={visible ? "eyeOff" : "eye"} />
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
