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