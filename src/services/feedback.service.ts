import { apiFetch } from "@/services/api";
import type { InstructorFeedback } from "@/types/feedback";

export async function getInstructorFeedback(
  sessionId: string
): Promise<InstructorFeedback> {
  return apiFetch<InstructorFeedback>(
    `/api/instructor-feedback/session/${sessionId}`
  );
}