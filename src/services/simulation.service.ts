import { apiFetch } from "@/services/api";
import type {
  CreateSimulationSessionRequest,
  SimulationDomain,
  SimulationScenario,
  SimulationSession,
  SimulationSessionDetail,
} from "@/types/simulation";

export async function getSimulationDomains(): Promise<
  SimulationDomain[]
> {
  return apiFetch<SimulationDomain[]>(
    "/api/simulation-domains"
  );
}

export async function getSimulationScenariosByDomain(
  domainId: string
): Promise<SimulationScenario[]> {
  return apiFetch<SimulationScenario[]>(
    `/api/simulation-scenarios/domain/${domainId}`
  );
}

export async function createSimulationSession(
  payload: CreateSimulationSessionRequest
): Promise<SimulationSession> {
  return apiFetch<SimulationSession>(
    "/api/simulation-sessions",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function getSimulationSession(
  sessionId: string
): Promise<SimulationSessionDetail> {
  return apiFetch<SimulationSessionDetail>(
    `/api/simulation-sessions/${sessionId}`
  );
}