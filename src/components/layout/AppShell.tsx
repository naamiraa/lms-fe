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
  const participant = !navigation.some(
    (item) =>
      item.href.startsWith("/admin/") || item.href.startsWith("/instructor/"),
  );
  return (
    <div
      className={`app-shell min-h-screen ${participant ? "simulator-shell" : "management-shell"}`}
    >
      {participant && <div className="simulator-backdrop" aria-hidden="true" />}
      {!participant && <Sidebar items={navigation} />}
      <div
        className={`relative min-h-screen ${participant ? "" : "lg:ml-[296px]"}`}
      >
        <Header navigation={navigation} simulator={participant} />
        <main
          className={`workspace-content mx-auto px-4 py-6 sm:px-8 sm:py-8 ${participant ? "max-w-[1320px]" : "max-w-[1600px] lg:pr-10"}`}
        >
          {children}
        </main>
        <footer className="px-4 py-6 text-center text-xs text-slate-500">
          Fleet Safety Simulator · Learn. Practice. Drive safely.
        </footer>
      </div>
    </div>
  );
}
