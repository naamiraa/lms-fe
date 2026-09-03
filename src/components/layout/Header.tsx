"use client";

import { getUser, clearAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const user = getUser();

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <p className="text-sm text-slate-500">
          Fleet Safety Learning Management System
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">
            {user?.name ?? "User"}
          </p>

          <p className="text-xs text-slate-500">
            {user?.roles?.[0] ?? ""}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}