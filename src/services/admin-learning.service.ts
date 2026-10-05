import { apiFetch } from "@/services/api";
import type {
  TrainingDomain,
  TrainingDomainRequest,
  LearningModule,
  LearningModuleRequest,
  LearningContent,
  LearningContentRequest,
} from "@/types/admin-learning";

// ====================
// TRAINING DOMAIN
// ====================

export function getTrainingDomains(): Promise<TrainingDomain[]> {
  return apiFetch<TrainingDomain[]>("/api/training-domains");
}

export function createTrainingDomain(
  request: TrainingDomainRequest
): Promise<TrainingDomain> {
  return apiFetch<TrainingDomain>("/api/training-domains", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function updateTrainingDomain(
  id: string,
  request: TrainingDomainRequest
): Promise<void> {
  return apiFetch(`/api/training-domains/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export function deactivateTrainingDomain(id: string): Promise<void> {
  return apiFetch(`/api/training-domains/${id}`, {
    method: "DELETE",
  });
}

// ====================
// LEARNING MODULE
// ====================

export function getLearningModulesByDomain(
  trainingDomainId: string
): Promise<LearningModule[]> {
  return apiFetch<LearningModule[]>(
    `/api/learning-modules/training-domain/${trainingDomainId}`
  );
}

export function createLearningModule(
  request: LearningModuleRequest
): Promise<LearningModule> {
  return apiFetch<LearningModule>("/api/learning-modules", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function updateLearningModule(
  id: string,
  request: LearningModuleRequest
): Promise<void> {
  return apiFetch(`/api/learning-modules/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export function deactivateLearningModule(id: string): Promise<void> {
  return apiFetch(`/api/learning-modules/${id}`, {
    method: "DELETE",
  });
}

// ====================
// LEARNING CONTENT
// ====================

export function getLearningContentsByModule(
  learningModuleId: string
): Promise<LearningContent[]> {
  return apiFetch<LearningContent[]>(
    `/api/learning-contents/learning-module/${learningModuleId}`
  );
}

export function createLearningContent(
  request: LearningContentRequest
): Promise<LearningContent> {
  return apiFetch<LearningContent>("/api/learning-contents", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function updateLearningContent(
  id: string,
  request: LearningContentRequest
): Promise<void> {
  return apiFetch(`/api/learning-contents/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export function deactivateLearningContent(id: string): Promise<void> {
  return apiFetch(`/api/learning-contents/${id}`, {
    method: "DELETE",
  });
}