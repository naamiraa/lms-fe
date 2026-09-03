export type UserRole = "ADMIN" | "INSTRUCTOR" | "PARTICIPANT";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
  roles: UserRole[];
}
