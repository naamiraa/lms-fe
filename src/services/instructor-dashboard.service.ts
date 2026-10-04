import { apiFetch } from "@/services/api";
import type { InstructorDashboard } from "@/types/instructor-dashboard";

export async function getInstructorDashboard(): Promise<InstructorDashboard> {
  return apiFetch<InstructorDashboard>(
    "/api/dashboard/instructor"
  );
}