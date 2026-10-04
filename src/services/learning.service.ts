import { apiFetch } from "@/services/api";
import type {
  LearningContent,
  LearningModule,
  LearningProgress,
  TrainingDomain,
} from "@/types/learning";

export async function getTrainingDomains(): Promise<TrainingDomain[]> {
  return apiFetch<TrainingDomain[]>("/api/training-domains");
}

export async function getTrainingDomain(
  id: string,
): Promise<TrainingDomain> {
  return apiFetch<TrainingDomain>(`/api/training-domains/${id}`);
}

export async function getLearningModules(): Promise<LearningModule[]> {
  return apiFetch<LearningModule[]>("/api/learning-modules");
}

export async function getLearningModulesByDomain(
  trainingDomainId: string,
): Promise<LearningModule[]> {
  return apiFetch<LearningModule[]>(
    `/api/learning-modules/training-domain/${trainingDomainId}`,
  );
}

export async function getLearningModule(
  id: string,
): Promise<LearningModule> {
  return apiFetch<LearningModule>(`/api/learning-modules/${id}`);
}

export async function getLearningContents(): Promise<LearningContent[]> {
  return apiFetch<LearningContent[]>("/api/learning-contents");
}

export async function getLearningContentsByModule(
  learningModuleId: string,
): Promise<LearningContent[]> {
  return apiFetch<LearningContent[]>(
    `/api/learning-contents/learning-module/${learningModuleId}`,
  );
}

export async function getLearningContent(
  id: string,
): Promise<LearningContent> {
  return apiFetch<LearningContent>(`/api/learning-contents/${id}`);
}

export async function completeLearningContent(
  learningContentId: string,
): Promise<void> {
  await apiFetch(
    `/api/learning-progress/contents/${learningContentId}/complete`,
    {
      method: "POST",
    },
  );
}

export async function getLearningProgress(
  learningModuleId: string,
): Promise<LearningProgress> {
  return apiFetch<LearningProgress>(
    `/api/learning-progress/modules/${learningModuleId}`,
  );
}