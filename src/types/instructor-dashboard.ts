export interface InstructorRecentSession {
  simulationSessionId: string;
  participantName: string;
  scenarioName: string;
  simulatorScore: number;
  completedAt: string | null;
  hasInstructorFeedback: boolean;
  overallScore: number;
  result: string;
}

export interface InstructorDashboard {
  completedSimulations: number;
  pendingFeedback: number;
  evaluatedSessions: number;
  averageSimulatorScore: number;
  recentSessions: InstructorRecentSession[];
}