import { apiFetch } from "@/services/api";

import type {
  SimulationDomain,
  SimulationDomainRequest,
  SimulationScenario,
  SimulationScenarioRequest,
} from "@/types/admin-simulation";

export async function getSimulationDomains(): Promise<
  SimulationDomain[]
> {
  return apiFetch<SimulationDomain[]>("/api/simulation-domains");
}

export async function createSimulationDomain(
  request: SimulationDomainRequest
): Promise<SimulationDomain> {
  return apiFetch<SimulationDomain>("/api/simulation-domains", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function updateSimulationDomain(
  id: string,
  request: SimulationDomainRequest
): Promise<void> {
  await apiFetch(`/api/simulation-domains/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export async function deactivateSimulationDomain(
  id: string
): Promise<void> {
  await apiFetch(`/api/simulation-domains/${id}`, {
    method: "DELETE",
  });
}

export async function getSimulationScenariosByDomain(
  domainId: string
): Promise<SimulationScenario[]> {
  return apiFetch<SimulationScenario[]>(
    `/api/simulation-scenarios/domain/${domainId}`
  );
}

export async function createSimulationScenario(
  request: SimulationScenarioRequest
): Promise<SimulationScenario> {
  return apiFetch<SimulationScenario>(
    "/api/simulation-scenarios",
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );
}

export async function updateSimulationScenario(
  id: string,
  request: SimulationScenarioRequest
): Promise<void> {
  await apiFetch(`/api/simulation-scenarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export async function deactivateSimulationScenario(
  id: string
): Promise<void> {
  await apiFetch(`/api/simulation-scenarios/${id}`, {
    method: "DELETE",
  });
}