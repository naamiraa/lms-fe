"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getUser, clearAuth } from "@/lib/auth";
import Brand from "@/components/shared/Brand";
import Icon, { navigationIcon } from "@/components/ui/Icon";
export default function Header({
  navigation = [],
  simulator = false,
}: {
  navigation?: { label: string; href: string }[];
  simulator?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    setUser(getUser());
  }, []);
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [menuOpen]);
  const current = navigation.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  function handleLogout() {
    clearAuth();
    router.push("/login");
  }
  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl ${simulator ? "simulator-header border-white/20 bg-[#006CB8]/95 text-white" : "border-white/80 bg-[#f5f9fc]/90"}`}
    >
      <div className="flex min-h-20 items-center justify-between gap-3 px-4 sm:px-8">
        <div className={simulator ? "hidden" : "hidden lg:block"}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Fleet Safety / Workspace
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {current?.label ?? "Training"}
          </p>
        </div>
        <div className={simulator ? "" : "lg:hidden"}>
          <Brand light={simulator} compact />
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {user?.name ?? "User"}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold tracking-wider text-[#006CB8]">
              {user?.roles?.[0] ?? ""}
            </p>
          </div>
          <span className="hidden h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-sm font-bold text-[#006CB8] sm:flex">
            {user?.name?.trim().slice(0, 1).toUpperCase() ?? "U"}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            className="flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-slate-500 hover:border-blue-200 hover:text-[#006CB8]"
          >
            <Icon name="logout" width={18} height={18} />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-[#006CB8] text-white lg:hidden"
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>
      {simulator && (
        <nav
          aria-label="Main navigation"
          className="hidden border-t border-white/15 px-8 lg:block"
        >
          <div className="mx-auto flex max-w-[1256px] flex-wrap gap-1 py-2">
            {navigation.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${active ? "bg-white text-[#006CB8] shadow-sm" : "text-blue-50 hover:bg-white/10"}`}
                >
                  <Icon
                    name={navigationIcon(item.href)}
                    width={16}
                    height={16}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="max-h-[calc(100dvh-5rem)] space-y-1 overflow-y-auto border-t border-slate-100 bg-white p-3 lg:hidden"
        >
          {navigation.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${active ? "bg-[#006CB8] text-white" : "text-slate-600 hover:bg-blue-50"}`}
              >
                <Icon name={navigationIcon(item.href)} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
