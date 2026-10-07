"use client";
import LoadingState from "@/components/shared/LoadingState";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getDashboardPath, getToken, getUser } from "@/lib/auth";
import type { UserRole } from "@/types/auth";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    const hasAllowedRole = user.roles.some((role) =>
      allowedRoles.includes(role),
    );

    if (!hasAllowedRole) {
      router.replace(getDashboardPath(user.roles));
      return;
    }

    setIsAuthorized(true);
  }, [allowedRoles, router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoadingState label="Loading..." />
      </div>
    );
  }

  return children;
}
