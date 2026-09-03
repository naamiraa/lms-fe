import type { LoginResponse, UserRole } from "@/types/auth";

const TOKEN_KEY = "lms_token";
const USER_KEY = "lms_user";

export function saveAuth(data: LoginResponse) {
  localStorage.setItem(TOKEN_KEY, data.token);

  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      userId: data.userId,
      name: data.name,
      email: data.email,
      roles: data.roles,
    })
  );
}

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as {
      userId: string;
      name: string;
      email: string;
      roles: UserRole[];
    };
  } catch {
    return null;
  }
}


export function getDashboardPath(
  roles: UserRole[]
): string {
  if (roles.includes("ADMIN")) {
    return "/admin/dashboard";
  }

  if (roles.includes("INSTRUCTOR")) {
    return "/instructor/dashboard";
  }

  return "/dashboard";
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
