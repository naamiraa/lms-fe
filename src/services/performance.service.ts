import { apiFetch } from "@/services/api";
import type { PerformanceEvaluation } from "@/types/performance";

export async function getPerformanceEvaluation(
  sessionId: string
): Promise<PerformanceEvaluation> {
  return apiFetch<PerformanceEvaluation>(
    `/api/performance-evaluations/session/${sessionId}`
  );
}