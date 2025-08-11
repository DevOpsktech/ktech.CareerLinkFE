import React, { useState } from "react";
import { LoginPage } from "./components/auth/LoginPage";
import { Navigation } from "./components/Navigation";
import { AdminDashboard } from "./components/dashboards/AdminDashboard";
import { EmployerDashboard } from "./components/dashboards/EmployerDashboard";
import { StudentDashboard } from "./components/dashboards/StudentDashboard";
import type { UserRole } from "./types/user";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { user } = useAuth();
  const [currentRole, setCurrentRole] = useState<UserRole>(
    user?.role || "student"
  );

  // Update currentRole when user changes
  React.useEffect(() => {
    if (user?.role) {
      setCurrentRole(user.role);
    }
  }, [user?.role]);

  if (!user?.isAuthenticated) {
    return <LoginPage />;
  }

  const renderDashboard = () => {
    switch (currentRole) {
      case "admin":
        return <AdminDashboard />;
      case "employer":
        return <EmployerDashboard />;
      case "student":
        return <StudentDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentRole={currentRole} onRoleChange={setCurrentRole} />
      <main className="pt-16">{renderDashboard()}</main>
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
