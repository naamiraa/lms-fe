import AppShell from "@/components/layout/AppShell";
import RoleGuard from "@/features/auth/components/RoleGuard";
import { adminNavigation } from "@/lib/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <AppShell navigation={adminNavigation}>
        {children}
      </AppShell>
    </RoleGuard>
  );
}