import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";
import type {
  AuthState,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  UpdateCredentials,
} from "../types/auth";
import { useToast } from "./ToastContext";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: UpdateCredentials) => Promise<boolean>;
  deleteProfile: () => Promise<boolean>;
  setUser: (user: AuthUser | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: false,
    error: null,
  });
  const { showSuccess, showError } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = authApi.getToken();
      if (token && !authApi.isTokenExpired()) {
        setAuthState((prev) => ({ ...prev, token, isLoading: true }));
        try {
          const response = await authApi.verifySession();
          if (response.data) {
            const user: AuthUser = {
              ...response.data,
              isAuthenticated: true,
            };
            setAuthState({ user, token, isLoading: false, error: null });
          } else {
            // Token is invalid, clear it
            authApi.removeToken();
            setAuthState({
              user: null,
              token: null,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          console.error("Failed to verify session:", error);
          showError("Failed to verify session");
          authApi.removeToken();
          setAuthState({
            user: null,
            token: null,
            isLoading: false,
            error: null,
          });
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.login(credentials);

      if (!response.data) {
        showError("No data received from login response");
        throw new Error("No data received from login response");
      }

      const { token, user } = response.data;

      if (!token) {
        showError("No token received from login response");
        throw new Error("No token received from login response");
      }

      if (!user) {
        showError("No user data received from login response");
        throw new Error("No user data received from login response");
      }

      // Store token
      authApi.storeToken(token);

      // Create AuthUser object
      const authUser: AuthUser = {
        ...user,
        userName: user.email, // Backend returns email as userName
        role: user.role as "Student" | "Employer" | "Admin",
        isAuthenticated: true,
      };

      setAuthState({ user: authUser, token, isLoading: false, error: null });
      showSuccess("Login successful");
      return true;
    } catch (error) {
      console.error("Login error:", error); // Debug log
      showError("Login failed");
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

  const register = async (
    credentials: RegisterCredentials
  ): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await authApi.register(credentials);
      setAuthState((prev) => ({ ...prev, isLoading: false, error: null }));
      showSuccess("Registration successful");
      return true;
    } catch (error) {
      showError("Registration failed");
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  };

  const logout = () => {
    authApi.removeToken();
    setAuthState({ user: null, token: null, isLoading: false, error: null });
  };

  const updateProfile = async (data: UpdateCredentials): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await authApi.updateProfile(data);

      // Refresh user data
      await refreshUser();
      setAuthState((prev) => ({ ...prev, isLoading: false, error: null }));
      showSuccess("Profile updated successfully");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Profile update failed";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      showError("Profile update failed");
      return false;
    }
  };

  const deleteProfile = async (): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await authApi.deleteProfile();
      logout(); // Clear auth state after deletion
      showSuccess("Profile deleted successfully");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Profile deletion failed";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      showError("Profile deletion failed");
      return false;
    }
  };

  const setUser = (user: AuthUser | null) => {
    setAuthState((prev) => ({ ...prev, user }));
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.verifySession();
      if (response.data) {
        const user: AuthUser = {
          ...response.data,
          isAuthenticated: true,
        };
        setAuthState((prev) => ({ ...prev, user }));
        showSuccess("User refreshed successfully");
      } else {
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          error: null,
        });
        authApi.removeToken();
        showError("User refresh failed");
      }
    } catch (error) {
      console.error("Failed to refresh user session:", error);
      setAuthState({ user: null, token: null, isLoading: false, error: null });
      authApi.removeToken();
      showError("User refresh failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateProfile,
        deleteProfile,
        setUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
