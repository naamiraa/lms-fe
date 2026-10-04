import { apiFetch } from "@/services/api";
import type {
  CreateInstructorFeedbackRequest,
  InstructorFeedback,
} from "@/types/feedback";

export async function getInstructorFeedback(
  sessionId: string
): Promise<InstructorFeedback> {
  return apiFetch<InstructorFeedback>(
    `/api/instructor-feedback/session/${sessionId}`
  );
}

export async function createInstructorFeedback(
  request: CreateInstructorFeedbackRequest
): Promise<InstructorFeedback> {
  return apiFetch<InstructorFeedback>(
    "/api/instructor-feedback",
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );
}