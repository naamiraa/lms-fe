export interface Assessment {
  id: string;
  learningModuleId: string;
  learningModuleName: string;
  title: string;
  type: string;
  description: string | null;
  durationMinutes: number;
  passingScore: number;
  maxAttempts: number;
  questionCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentRequest {
  learningModuleId: string;
  title: string;
  type: string;
  description?: string | null;
  durationMinutes: number;
  passingScore: number;
  maxAttempts: number;
}

export interface QuestionOption {
  id: string;
  optionText: string;
  isCorrect: boolean;
  order: number;
}

export interface QuestionOptionRequest {
  optionText: string;
  isCorrect: boolean;
  order: number;
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  questionText: string;
  mediaUrl: string | null;
  order: number;
  isActive: boolean;
  options: QuestionOption[];
}

export interface AssessmentQuestionRequest {
  assessmentId: string;
  questionText: string;
  mediaUrl?: string | null;
  order: number;
  options: QuestionOptionRequest[];
}

export interface UpdateAssessmentQuestionRequest {
  questionText: string;
  mediaUrl?: string | null;
  order: number;
  options: QuestionOptionRequest[];
}