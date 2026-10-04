import { apiFetch } from "@/services/api";
import type { InstructorSession } from "@/types/instructor-session";

export async function getInstructorSessions(): Promise<InstructorSession[]> {
  return apiFetch<InstructorSession[]>(
    "/api/instructor/sessions"
  );
}