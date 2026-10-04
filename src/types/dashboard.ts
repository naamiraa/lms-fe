export interface ScenarioPerformance {
  scenarioId: string;
  scenarioName: string;
  completedSimulations: number;
  averageOverallScore: number;
  passRate: number;
}

export interface AdminDashboardResponse {
  totalParticipants: number;
  totalInstructors: number;
  pendingUserApprovals: number;
  completedSimulations: number;
  certificatesIssued: number;
  passRate: number;
  averageOverallScore: number;
  passedSimulations: number;
  failedSimulations: number;
  scenarioPerformance: ScenarioPerformance[];
}

export interface ParticipantTrainingSummary {
  simulationSessionId: string;
  moduleName: string;
  scenarioName: string;
  overallScore: number;
  result: string;
  completedAt: string;
}

export interface ParticipantDashboardResponse {
  completedLearningContents: number;
  totalLearningContents: number;
  learningProgressPercentage: number;

  completedAssessments: number;
  completedSimulations: number;
  certificatesEarned: number;

  latestTraining: ParticipantTrainingSummary | null;
  recentTrainings: ParticipantTrainingSummary[];
}