import type { ReactNode } from "react";
export default function Alert({
  children,
  variant = "error",
}: {
  children: ReactNode;
  variant?: "error" | "success";
}) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${variant === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}
    >
      {children}
    </div>
  );
}
