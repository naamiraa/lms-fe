export interface SimulationDomain {
  id: string;
  name: string;
  description: string | null;
  scenarioCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationScenario {
  id: string;
  simulationDomainId: string;
  simulationDomainName: string;
  name: string;
  description: string | null;
  difficulty: string;
  estimatedMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSimulationSessionRequest {
  assessmentAttemptId: string;
  simulationScenarioId: string;
}

export interface SimulationSession {
  message: string;
  sessionId: string;
  scenarioName: string;
  status: string;
}