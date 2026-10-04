export interface TrainingHistoryItem {
  assessmentAttemptId: string;
  simulationSessionId: string;
  trainingDomainName: string;
  learningModuleName: string;
  assessmentTitle: string;
  scenarioName: string;
  theoryScore: number;
  simulatorScore: number;
  overallScore: number;
  result: string;
  completedAt: string;
  hasInstructorFeedback: boolean;
}

export interface TrainingHistoryDetail
  extends TrainingHistoryItem {
  totalViolations: number;
  safetyScore: number | null;
  vehicleControlScore: number | null;
  emergencyResponseScore: number | null;
  completionTimeSeconds: number | null;
}