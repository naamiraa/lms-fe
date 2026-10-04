export interface Certificate {
  id: string;
  certificateNumber: string;
  simulationSessionId: string;
  participantName: string;
  learningModuleName: string;
  scenarioName: string;
  overallScore: number;
  result: string;
  issuedAt: string;
}