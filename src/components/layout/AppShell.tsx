import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
export default function AppShell({
  children,
  navigation,
}: {
  children: ReactNode;
  navigation: { label: string; href: string }[];
}) {
  return (
    <div className="app-shell min-h-screen">
      <Sidebar items={navigation} />
      <div className="min-h-screen lg:ml-[296px]">
        <Header navigation={navigation} />
        <main className="workspace-content mx-auto max-w-[1600px] px-4 py-6 sm:px-8 sm:py-8 lg:pr-10">
          {children}
        </main>
        <footer className="px-4 py-6 text-xs text-slate-400 sm:px-8">
          Fleet Safety Simulator · Learning Management System
        </footer>
      </div>
    </div>
  );
}
