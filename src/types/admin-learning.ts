export interface TrainingDomain {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LearningModule {
  id: string;
  trainingDomainId: string;
  trainingDomainName: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LearningContent {
  id: string;
  learningModuleId: string;
  learningModuleName: string;
  title: string;
  contentType: string;
  contentUrl: string | null;
  description: string | null;
  order: number;
  estimatedMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingDomainRequest {
  name: string;
  description?: string | null;
}

export interface LearningModuleRequest {
  trainingDomainId: string;
  name: string;
  description?: string | null;
  order: number;
}

export interface LearningContentRequest {
  learningModuleId: string;
  title: string;
  contentType: string;
  contentUrl?: string | null;
  description?: string | null;
  order: number;
  estimatedMinutes: number;
}