export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "employer" | "student";
  isAuthenticated: boolean;
}

export interface EmployerAccount {
  id: string;
  email: string;
  password: string;
  company: string;
  industry: string;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}
