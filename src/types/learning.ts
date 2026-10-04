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

export interface LearningProgressContent {
  learningContentId: string;
  learningContentTitle: string;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface LearningProgress {
  learningModuleId: string;
  learningModuleName: string;
  totalContents: number;
  completedContents: number;
  progressPercentage: number;
  isCompleted: boolean;
  contents: LearningProgressContent[];
}