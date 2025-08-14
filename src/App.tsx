import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginPage } from "./components/auth/LoginPage";
import { Navigation } from "./components/Navigation";
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-16">
        <Routes>
          {/* Admin Routes */}
          {user.role === "admin" && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/employer" element={<EmployerDashboard />} />
              <Route path="/admin/student" element={<StudentDashboard />} />
            </>
          )}

          {/* Employer Routes */}
          {(user.role === "employer" || user.role === "admin") && (
            <Route path="/employer" element={<EmployerDashboard />} />
          )}

          {/* Student Routes */}
          {(user.role === "student" || user.role === "admin") && (
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
                  user.role === "admin"
                    ? "/admin"
                    : user.role === "employer"
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
                  user.role === "admin"
                    ? "/admin"
                    : user.role === "employer"
                    ? "/employer"
                    : "/student"
                }
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
