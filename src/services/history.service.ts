import { apiFetch } from "@/services/api";

import type {
  TrainingHistoryDetail,
  TrainingHistoryItem,
} from "@/types/history";

export async function getMyTrainingHistory(): Promise<
  TrainingHistoryItem[]
> {
  return apiFetch<TrainingHistoryItem[]>(
    "/api/training-history/me"
  );
}

export async function getTrainingHistoryDetail(
  sessionId: string
): Promise<TrainingHistoryDetail> {
  return apiFetch<TrainingHistoryDetail>(
    `/api/training-history/${sessionId}`
  );
}