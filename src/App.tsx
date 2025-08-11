import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { AdminDashboard } from "./components/dashboards/AdminDashboard";
import { EmployerDashboard } from "./components/dashboards/EmployerDashboard";
import { StudentDashboard } from "./components/dashboards/StudentDashboard";
import type { UserRole } from "./types/user";

function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>("student");

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

export default App;
