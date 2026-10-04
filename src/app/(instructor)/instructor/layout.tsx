import AppShell from "@/components/layout/AppShell";
import RoleGuard from "@/features/auth/components/RoleGuard";
import { instructorNavigation } from "@/lib/navigation";

export default function InstructorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["INSTRUCTOR"]}>
      <AppShell navigation={instructorNavigation}>
        {children}
      </AppShell>
    </RoleGuard>
  );
}