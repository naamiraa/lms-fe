export interface SimulationDomain {
  id: string;
  name: string;
  description: string | null;
  scenarioCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationDomainRequest {
  name: string;
  description?: string | null;
}

export interface SimulationScenario {
  id: string;
  simulationDomainId: string;
  simulationDomainName: string;
  name: string;
  description: string | null;
  difficulty: string | null;
  estimatedMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationScenarioRequest {
  simulationDomainId: string;
  name: string;
  description?: string | null;
  difficulty?: string | null;
  estimatedMinutes: number;
}