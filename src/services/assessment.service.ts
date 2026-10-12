import { apiFetch } from "@/services/api";
import type {
  AssessmentAttempt,
  SaveAssessmentAnswerRequest,
  SubmitAssessmentResponse,
} from "@/types/assessment";

export async function startAssessment(
  assessmentId: string,
): Promise<AssessmentAttempt> {
  return apiFetch<AssessmentAttempt>(
    `/api/participant-assessments/${assessmentId}/start`,
    {
      method: "POST",
    },
  );
}

export async function getAssessmentAttempt(
  attemptId: string,
): Promise<AssessmentAttempt> {
  return apiFetch<AssessmentAttempt>(
    `/api/participant-assessments/attempts/${attemptId}`,
  );
}

export async function saveAssessmentAnswer(
  attemptId: string,
  questionId: string,
  selectedOptionId: string,
): Promise<void> {
  const body: SaveAssessmentAnswerRequest = {
    selectedOptionId,
  };

  await apiFetch(
    `/api/participant-assessments/attempts/${attemptId}/questions/${questionId}/answer`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
  );
}

export async function submitAssessment(
  attemptId: string,
): Promise<SubmitAssessmentResponse> {
  return apiFetch<SubmitAssessmentResponse>(
    `/api/participant-assessments/attempts/${attemptId}/submit`,
    {
      method: "POST",
    },
  );
}

// Metadata only: this endpoint must allow participant access without answer keys
export async function getAvailableAssessments(
  moduleId?: string,
): Promise<import("@/types/admin-assessment").Assessment[]> {
  return apiFetch(
    moduleId
      ? `/api/assessments/learning-module/${encodeURIComponent(moduleId)}`
      : "/api/assessments",
  );
}
