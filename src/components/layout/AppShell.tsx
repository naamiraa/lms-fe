import type { ReactNode } from "react";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

interface NavigationItem {
  label: string;
  href: string;
}

interface AppShellProps {
  children: ReactNode;
  navigation: NavigationItem[];
}

export default function AppShell({
  children,
  navigation,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar items={navigation} />

      <div className="ml-64 min-h-screen">
        <Header />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}