export interface AdminUser {
  id: string;
  name: string;
  email: string;
  employeeNumber: string | null;
  registrationSource: string;
  approvalStatus: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
}

export interface AssignRoleRequest {
  role: string;
}