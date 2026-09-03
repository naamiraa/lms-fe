import { apiFetch } from "@/services/api";
import type { AdminDashboardResponse } from "@/types/dashboard";

export async function getAdminDashboard(): Promise<AdminDashboardResponse> {
  return apiFetch<AdminDashboardResponse>("/api/dashboard/admin");
}