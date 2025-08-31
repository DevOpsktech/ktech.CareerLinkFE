import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";
import type {
  AuthState,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  UpdateCredentials,
} from "../types/auth";

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
        throw new Error("No data received from login response");
      }

      const { token, user } = response.data;

      if (!token) {
        throw new Error("No token received from login response");
      }

      if (!user) {
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
      return true;
    } catch (error) {
      console.error("Login error:", error); // Debug log
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
      return true;
    } catch (error) {
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
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Profile update failed";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  };

  const deleteProfile = async (): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await authApi.deleteProfile();
      logout(); // Clear auth state after deletion
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Profile deletion failed";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
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
      } else {
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          error: null,
        });
        authApi.removeToken();
      }
    } catch (error) {
      console.error("Failed to refresh user session:", error);
      setAuthState({ user: null, token: null, isLoading: false, error: null });
      authApi.removeToken();
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
