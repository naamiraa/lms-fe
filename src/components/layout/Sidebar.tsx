"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Brand from "@/components/shared/Brand";
import Icon, { navigationIcon } from "@/components/ui/Icon";
interface SidebarProps {
  items: { label: string; href: string }[];
}
export default function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="hidden sidebar-glass fixed bottom-4 left-4 top-4 z-30 w-64 rounded-3xl border border-white/80 lg:block">
      <div className="flex h-full flex-col">
        <div className="px-5 pb-6 pt-7">
          <Brand />
        </div>
        <p className="px-6 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </p>
        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-1.5 overflow-y-auto px-3"
        >
          {items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-medium transition ${active ? "bg-[#006CB8] text-white shadow-md shadow-[#006CB8]/20" : "text-slate-500 hover:bg-white hover:text-[#006CB8]"}`}
              >
                <Icon name={navigationIcon(item.href)} width={18} height={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="m-4 rounded-2xl border border-blue-100/80 bg-gradient-to-br from-blue-50 to-white p-4">
          <span className="mb-2 inline-flex rounded-lg bg-[#006CB8]/10 p-2 text-[#006CB8]">
            <Icon name="shield" />
          </span>
          <p className="text-sm font-semibold text-slate-800">
            Safety starts with you.
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Build the skills for a safer journey.
          </p>
        </div>
      </div>
    </aside>
  );
}
