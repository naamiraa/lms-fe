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

export interface RegisterRequest {
  name: string;
  email: string;
  employeeNumber?: string | null;
  password: string;
}

export interface RegisterResponse {
  message: string;
}