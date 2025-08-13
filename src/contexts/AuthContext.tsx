import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";
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
  refreshUser: () => Promise<void>;
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
      const response = await authApi.login(email, password, role);
      const user = response.data;
      setAuthState({ user, isLoading: false, error: null });
      localStorage.setItem("careerlink_user", JSON.stringify(user));
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  };

  const loginWithMicrosoft = async (): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.loginWithMicrosoft();
      const user = response.data;
      setAuthState({ user, isLoading: false, error: null });
      localStorage.setItem("careerlink_user", JSON.stringify(user));
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Microsoft login failed";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  };

  const logout = () => {
    authApi.logout().catch(console.error); // Fire and forget
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

  const refreshUser = async () => {
    try {
      const response = await authApi.verifySession();
      if (response.data) {
        setAuthState((prev) => ({ ...prev, user: response.data }));
      } else {
        setAuthState({ user: null, isLoading: false, error: null });
        localStorage.removeItem("careerlink_user");
      }
    } catch (error) {
      console.error("Failed to refresh user session:", error);
      setAuthState({ user: null, isLoading: false, error: null });
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
        refreshUser,
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
