export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
  role: "Student" | "Employer" | "Admin";
}

export interface UpdateCredentials {
  fullName?: string;
  email?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  userName: string;
  role: "Student" | "Employer" | "Admin";
  isAuthenticated: boolean;
}

export interface LoginResponse {
  token: string;
  expiration: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export interface RegisterResponse {
  message: string;
  role: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
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
