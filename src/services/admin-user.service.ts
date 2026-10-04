import { apiFetch } from "@/services/api";
import type {
  AdminUser,
  AssignRoleRequest,
} from "@/types/admin-user";

export async function getAdminUsers(): Promise<AdminUser[]> {
  return apiFetch<AdminUser[]>("/api/admin/users");
}

export async function getPendingUsers(): Promise<AdminUser[]> {
  return apiFetch<AdminUser[]>("/api/admin/users/pending");
}

export async function approveUser(id: string): Promise<void> {
  await apiFetch(`/api/admin/users/${id}/approve`, {
    method: "PATCH",
  });
}

export async function rejectUser(id: string): Promise<void> {
  await apiFetch(`/api/admin/users/${id}/reject`, {
    method: "PATCH",
  });
}

export async function assignUserRole(
  id: string,
  role: string
): Promise<void> {
  const request: AssignRoleRequest = { role };

  await apiFetch(`/api/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify(request),
  });
}