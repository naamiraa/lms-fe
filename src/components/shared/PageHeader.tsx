import type { ReactNode } from "react";
export default function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  tone = "default",
}: {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  tone?: "default" | "brand";
}) {
  const brand = tone === "brand";
  return (
    <div
      className={`page-heading relative flex flex-col justify-between gap-4 overflow-hidden sm:flex-row sm:items-end ${brand ? "training-hero min-h-[210px] rounded-3xl p-6 shadow-lg shadow-blue-900/10 sm:p-8" : ""}`}
    >
      {brand && (
        <div
          className="pointer-events-none absolute -right-12 -top-24 h-80 w-80 rounded-full border-[40px] border-white/[0.04]"
          aria-hidden="true"
        />
      )}
      <div className="relative">
        {eyebrow && (
          <p
            className={`mb-2 text-xs font-bold uppercase tracking-[0.16em] ${brand ? "text-blue-100" : "text-[#006CB8]"}`}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className={`text-2xl font-bold tracking-tight sm:text-3xl ${brand ? "text-white" : "text-slate-900"}`}
        >
          {title}
        </h1>
        {description && (
          <p
            className={`mt-2 max-w-2xl text-sm leading-6 ${brand ? "text-blue-50/90" : "text-slate-500"}`}
          >
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="relative flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
