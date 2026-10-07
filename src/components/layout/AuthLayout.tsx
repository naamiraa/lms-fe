import type { ReactNode } from "react";
import Brand from "@/components/shared/Brand";
import GlassCard from "@/components/shared/GlassCard";
export default function AuthLayout({
  children,
  title,
  description,
  register = false,
}: {
  children: ReactNode;
  title: string;
  description: string;
  register?: boolean;
}) {
  return (
    <main className="auth-layout relative flex min-h-screen flex-col overflow-hidden">
      <div className="auth-photo" aria-hidden="true" />
      <div className="auth-tint" aria-hidden="true" />
      <header className="relative z-10 flex items-center justify-between gap-4 border-b border-white/20 bg-[#006CB8]/90 px-5 py-4 text-white shadow-sm backdrop-blur-xl sm:px-10">
        <Brand light />
        <p className="hidden text-sm text-blue-100 sm:block">
          Fleet Safety Simulator
        </p>
      </header>
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:py-14">
        <div
          className={`w-full rounded-[2rem] border border-white/70 bg-white/15 p-2 shadow-2xl shadow-[#004777]/15 backdrop-blur-md sm:p-3 ${register ? "max-w-lg" : "max-w-[460px]"}`}
        >
          <GlassCard className="auth-card px-6 py-8 sm:px-9 sm:py-10">
            <div className="mb-8 text-center">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#006CB8]">
                Learning Management System
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-[#006CB8]">
                {title}
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>
            {children}
          </GlassCard>
        </div>
      </div>
      <footer className="relative z-10 px-4 pb-5 text-center text-xs text-slate-600">
        Fleet Safety Simulator · Learn with confidence, drive with care.
      </footer>
    </main>
  );
}
