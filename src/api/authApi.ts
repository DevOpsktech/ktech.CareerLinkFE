import type { ApiResponse } from "../types/api";
import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  UpdateCredentials,
  LoginResponse,
  RegisterResponse,
} from "../types/auth";
import { apiClient } from "../utils/api";

export const authApi = {
  // Register new user
  register: async (
    credentials: RegisterCredentials
  ): Promise<ApiResponse<RegisterResponse>> => {
    return apiClient.post<RegisterResponse>("/auth/register", credentials);
  },

  // Login user
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post<LoginResponse>("/auth/login", credentials);
  },

  // Get user profile
  getProfile: async (): Promise<ApiResponse<AuthUser>> => {
    return apiClient.get<AuthUser>("/auth/profile");
  },

  // Update user profile
  updateProfile: async (
    data: UpdateCredentials
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.put<{ message: string }>("/auth/update", data);
  },

  // Delete user profile
  deleteProfile: async (): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.delete<{ message: string }>("/auth/delete");
  },

  // Verify token/session
  verifySession: async (): Promise<ApiResponse<AuthUser | null>> => {
    try {
      const response = await apiClient.get<AuthUser>("/auth/profile");
      return response;
    } catch (error) {
      // If token is invalid or expired, return null
      return { data: null, success: false, message: "Session expired" };
    }
  },

  // Store token in localStorage
  storeToken: (token: string): void => {
    localStorage.setItem("careerlink_token", token);
  },

  // Get token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem("careerlink_token");
  },

  // Remove token from localStorage
  removeToken: (): void => {
    localStorage.removeItem("careerlink_token");
  },

  // Check if token is expired
  isTokenExpired: (): boolean => {
    const token = localStorage.getItem("careerlink_token");
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch (error) {
      return true;
    }
  },
};
