import React, { createContext, useContext, useState, useEffect } from "react";
import type { AuthState, AuthUser } from "../types/auth";

interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string,
    role: "admin" | "employer"
  ) => Promise<boolean>;
  loginWithMicrosoft: () => Promise<boolean>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("careerlink_user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState((prev) => ({ ...prev, user }));
      } catch (error) {
        localStorage.removeItem("careerlink_user");
        console.log("Error parsing saved user data:", error);
      }
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    role: "admin" | "employer"
  ): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call - replace with actual authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
          setAuthState({ user, isLoading: false, error: null });
          localStorage.setItem("careerlink_user", JSON.stringify(user));
          return true;
        }
      } else if (role === "employer") {
        // Mock employer validation - replace with actual database check
        const mockEmployers = [
          {
            email: "hr@techcorp.com",
            password: "tech123",
            name: "TechCorp HR",
            company: "TechCorp",
          },
          {
            email: "careers@financeinc.com",
            password: "finance123",
            name: "Finance Inc HR",
            company: "Finance Inc",
          },
        ];

        const employer = mockEmployers.find(
          (emp) => emp.email === email && emp.password === password
        );
        if (employer) {
          const user: AuthUser = {
            id: "employer-1",
            email,
            name: employer.name,
            role: "employer",
            isAuthenticated: true,
          };
          setAuthState({ user, isLoading: false, error: null });
          localStorage.setItem("careerlink_user", JSON.stringify(user));
          return true;
        }
      }

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Invalid credentials",
      }));
      return false;
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Login failed",
      }));
      console.log("Error parsing saved user data:", error);
      return false;
    }
  };

  const loginWithMicrosoft = async (): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate Microsoft OAuth - replace with actual MSAL implementation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful OAuth response
      const user: AuthUser = {
        id: "student-1",
        email: "student@university.edu",
        name: "Haider Ghadi",
        role: "student",
        isAuthenticated: true,
      };

      setAuthState({ user, isLoading: false, error: null });
      localStorage.setItem("careerlink_user", JSON.stringify(user));
      return true;
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Microsoft login failed",
      }));
      console.log("Error parsing saved user data:", error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({ user: null, isLoading: false, error: null });
    localStorage.removeItem("careerlink_user");
  };

  const setUser = (user: AuthUser | null) => {
    setAuthState((prev) => ({ ...prev, user }));
    if (user) {
      localStorage.setItem("careerlink_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("careerlink_user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        loginWithMicrosoft,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
