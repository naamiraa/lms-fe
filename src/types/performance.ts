export interface PerformanceBreakdown {
  safetyScore: number;
  vehicleControlScore: number;
  emergencyResponseScore: number;
}

export interface PerformanceEvent {
  eventId: string;
  eventType: string;
  severity: string;
  description: string;
  occurredAtSeconds: number;
  penaltyPoints: number;
}

export interface PerformanceEvaluation {
  simulationSessionId: string;
  scenarioName: string;
  domainName: string;
  theoryScore: number;
  simulatorScore: number;
  overallScore: number;
  result: "PASS" | "FAIL";
  totalViolations: number;
  completionTimeSeconds: number;
  breakdown: PerformanceBreakdown;
  events: PerformanceEvent[];
}