import type { ApiResponse } from "../types/api";
import type { AuthUser } from "../types/auth";
import { mockApiCall } from "../utils/api";

export const authApi = {
  // Admin/Employer login
  login: async (
    email: string,
    password: string,
    role: "admin" | "employer"
  ): Promise<ApiResponse<AuthUser>> => {
    // Mock authentication logic
    if (role === "admin") {
      if (email === "admin@careerlink.com" && password === "admin123") {
        const user: AuthUser = {
          id: "admin-1",
          email,
          name: "System Administrator",
          role: "admin",
          isAuthenticated: true,
        };
        return mockApiCall(user);
      }
    } else if (role === "employer") {
      // Mock employer validation
      const mockEmployers = [
        {
          email: "hr@techcorp.com",
          password: "tech123",
          name: "Sarah Johnson",
          id: "emp-1",
        },
        {
          email: "careers@financeinc.com",
          password: "finance123",
          name: "Michael Chen",
          id: "emp-2",
        },
      ];

      const employer = mockEmployers.find(
        (emp) => emp.email === email && emp.password === password
      );
      if (employer) {
        const user: AuthUser = {
          id: employer.id,
          email,
          name: employer.name,
          role: "employer",
          isAuthenticated: true,
        };
        return mockApiCall(user);
      }
    }

    throw new Error("Invalid credentials");
  },

  // Microsoft OAuth login for students
  loginWithMicrosoft: async (): Promise<ApiResponse<AuthUser>> => {
    // Mock successful OAuth response
    const user: AuthUser = {
      id: "student-1",
      email: "student@university.edu",
      name: "John Student",
      role: "student",
      isAuthenticated: true,
    };

    return mockApiCall(user);
  },

  // Logout
  logout: async (): Promise<ApiResponse<boolean>> => {
    return mockApiCall(true);
  },

  // Verify token/session
  verifySession: async (): Promise<ApiResponse<AuthUser | null>> => {
    const savedUser = localStorage.getItem("careerlink_user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return mockApiCall(user);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        return mockApiCall(null);
      }
    }
    return mockApiCall(null);
  },

  // Change password
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<boolean>> => {
    // Mock password change
    return mockApiCall(true);
  },

  // Reset password
  resetPassword: async (email: string): Promise<ApiResponse<boolean>> => {
    // Mock password reset
    return mockApiCall(true);
  },
};
