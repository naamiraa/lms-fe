export interface AssessmentOption {
  id: string;
  optionText: string;
  order: number;
}

export interface AssessmentQuestion {
  id: string;
  questionText: string;
  mediaUrl: string | null;
  order: number;
  selectedOptionId: string | null;
  options: AssessmentOption[];
}

export interface AssessmentAttempt {
  attemptId: string;
  assessmentId: string;
  assessmentTitle: string;
  attemptNumber: number;
  maxAttempts: number;
  durationMinutes: number;
  startedAt: string;
  expiresAt: string;
  status: string;
  questions: AssessmentQuestion[];
}

export interface SaveAssessmentAnswerRequest {
  selectedOptionId: string;
}

export interface SubmitAssessmentResponse {
  status?: string;
  message?: string;
  simulationUnlocked?: boolean;
}