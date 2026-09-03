import { apiFetch } from "@/services/api";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export async function login(
  payload: LoginRequest
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
