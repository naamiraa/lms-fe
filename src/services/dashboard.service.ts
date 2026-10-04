import { apiFetch } from "@/services/api";
import type {
  AdminDashboardResponse,
  ParticipantDashboardResponse,
} from "@/types/dashboard";


export async function getAdminDashboard(): Promise<AdminDashboardResponse> {
  return apiFetch<AdminDashboardResponse>("/api/dashboard/admin");
}

export async function getParticipantDashboard(): Promise<ParticipantDashboardResponse> {
  return apiFetch<ParticipantDashboardResponse>(
    "/api/dashboard/participant"
  );
}