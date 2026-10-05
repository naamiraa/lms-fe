import { apiFetch } from "@/services/api";

import type {
  Assessment,
  AssessmentQuestion,
  AssessmentQuestionRequest,
  AssessmentRequest,
  UpdateAssessmentQuestionRequest,
} from "@/types/admin-assessment";

export async function getAssessments(): Promise<Assessment[]> {
  return apiFetch<Assessment[]>("/api/assessments");
}

export async function getAssessmentsByLearningModule(
  learningModuleId: string
): Promise<Assessment[]> {
  return apiFetch<Assessment[]>(
    `/api/assessments/learning-module/${learningModuleId}`
  );
}

export async function createAssessment(
  request: AssessmentRequest
): Promise<Assessment> {
  return apiFetch<Assessment>("/api/assessments", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function updateAssessment(
  id: string,
  request: AssessmentRequest
): Promise<void> {
  await apiFetch(`/api/assessments/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export async function deactivateAssessment(id: string): Promise<void> {
  await apiFetch(`/api/assessments/${id}`, {
    method: "DELETE",
  });
}

export async function getAssessmentQuestions(
  assessmentId: string
): Promise<AssessmentQuestion[]> {
  return apiFetch<AssessmentQuestion[]>(
    `/api/assessment-questions/assessment/${assessmentId}`
  );
}

export async function createAssessmentQuestion(
  request: AssessmentQuestionRequest
): Promise<AssessmentQuestion> {
  return apiFetch<AssessmentQuestion>("/api/assessment-questions", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function updateAssessmentQuestion(
  id: string,
  request: UpdateAssessmentQuestionRequest
): Promise<void> {
  await apiFetch(`/api/assessment-questions/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export async function deactivateAssessmentQuestion(
  id: string
): Promise<void> {
  await apiFetch(`/api/assessment-questions/${id}`, {
    method: "DELETE",
  });
}