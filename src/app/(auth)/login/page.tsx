import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#006CB8]">
            Fleet Safety Simulator
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue your training
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}