import AppShell from "@/components/layout/AppShell";
import RoleGuard from "@/features/auth/components/RoleGuard";
import { participantNavigation } from "@/lib/navigation";

export default function ParticipantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["PARTICIPANT"]}>
      <AppShell navigation={participantNavigation}>
        {children}
      </AppShell>
    </RoleGuard>
  );
}