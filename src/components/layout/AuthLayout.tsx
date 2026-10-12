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
    <main className="auth-layout relative flex min-h-screen flex-col overflow-hidden bg-[#082b46]">
      <div className="auth-photo" aria-hidden="true" />
      <div className="auth-tint" aria-hidden="true" />
      <header className="relative z-10 flex items-center justify-between gap-4 border-b border-white/15 bg-[#006CB8]/85 px-5 py-4 text-white backdrop-blur-xl sm:px-10">
        <Brand light />
        <p className="hidden text-xs font-semibold uppercase tracking-widest text-blue-100 sm:block">
          Fleet Safety Simulator
        </p>
      </header>
      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 py-8 sm:px-8 lg:grid-cols-[1fr_480px] lg:gap-16 lg:py-12">
        <section className="hidden max-w-xl self-end pb-12 text-white lg:block">
          <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
            Your training starts here
          </span>
          <h2 className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight">
            Build your skills.
            <br />
            Own the road.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-blue-50/90">
            Learn the essentials, take on the challenge, and get ready for your
            next simulator mission.
          </p>
          <div className="mt-8 flex gap-3 text-xs font-semibold">
            <span className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 backdrop-blur-md">
              01 · Learn
            </span>
            <span className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 backdrop-blur-md">
              02 · Challenge
            </span>
            <span className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 backdrop-blur-md">
              03 · Simulate
            </span>
          </div>
        </section>
        <div
          className={`mx-auto w-full rounded-[2rem] border border-white/40 bg-white/10 p-2 shadow-2xl backdrop-blur-md sm:p-3 ${register ? "max-w-lg" : "max-w-[480px]"}`}
        >
          <GlassCard className="auth-card px-6 py-8 sm:px-9 sm:py-9">
            <div className="mb-7">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#006CB8]">
                Learning Management System
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>
            {children}
          </GlassCard>
        </div>
      </div>
      <footer className="relative z-10 px-4 pb-5 text-center text-xs text-blue-100/80">
        Fleet Safety Simulator · Learn. Practice. Drive safely.
      </footer>
    </main>
  );
}
