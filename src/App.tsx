import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { preloadLogosAsync } from "./utils/logoPreloader";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { ProfilePage } from "./components/auth/ProfilePage";
import { AdminDashboard } from "./components/dashboards/AdminDashboard";
import { EmployerDashboard } from "./components/dashboards/EmployerDashboard";
import { StudentDashboard } from "./components/dashboards/StudentDashboard";
import JobDetailPage from "./components/pages/JobDetailPage";

function AppContent() {
  const { user } = useAuth();

  if (!user?.isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Routes>
        {/* Profile Route - Available to all authenticated users */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin Routes */}
        {user.role === "Admin" && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/employer" element={<EmployerDashboard />} />
            <Route path="/admin/student" element={<StudentDashboard />} />
          </>
        )}

        {/* Employer Routes */}
        {(user.role === "Employer" || user.role === "Admin") && (
          <Route path="/employer" element={<EmployerDashboard />} />
        )}

        {/* Student Routes */}
        {(user.role === "Student" || user.role === "Admin") && (
          <>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
          </>
        )}

        <Route path="/jobs/:id" element={<JobDetailPage />} />

        {/* Default redirects based on user role */}
        <Route
          path="/"
          element={
            <Navigate
              to={
                user.role === "Admin"
                  ? "/admin"
                  : user.role === "Employer"
                  ? "/employer"
                  : "/student"
              }
              replace
            />
          }
        />

        {/* Catch all - redirect to appropriate dashboard */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                user.role === "Admin"
                  ? "/admin"
                  : user.role === "Employer"
                  ? "/employer"
                  : "/student"
              }
              replace
            />
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  // Preload logo assets when app starts
  React.useEffect(() => {
    preloadLogosAsync();
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
