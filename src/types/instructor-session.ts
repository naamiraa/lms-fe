export interface InstructorSession {
  simulationSessionId: string;
  participantName: string;
  scenarioName: string;
  theoryScore: number;
  simulatorScore: number;
  overallScore: number;
  result: string;
  completedAt: string | null;
  hasInstructorFeedback: boolean;
}