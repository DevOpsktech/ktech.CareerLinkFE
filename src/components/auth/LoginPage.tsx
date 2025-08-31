import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AdminLogin } from "./AdminLogin";
import { EmployerLogin } from "./EmployerLogin";
import { StudentLogin } from "./StudentLogin";
import { Users, Briefcase, GraduationCap } from "lucide-react";

type LoginRole = "Student" | "Employer" | "Admin";

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<LoginRole>("Student");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (user?.isAuthenticated) {
      const redirectPath =
        user.role === "Admin"
          ? "/admin"
          : user.role === "Employer"
          ? "/employer"
          : "/student";
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  const roles = [
    {
      key: "Admin" as LoginRole,
      label: "Administrator",
      icon: Users,
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      key: "Employer" as LoginRole,
      label: "Employer",
      icon: Briefcase,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      key: "Student" as LoginRole,
      label: "Student",
      icon: GraduationCap,
      color: "bg-teal-500 hover:bg-teal-600",
    },
  ];

  const renderLoginForm = () => {
    switch (selectedRole) {
      case "Admin":
        return <AdminLogin />;
      case "Employer":
        return <EmployerLogin />;
      case "Student":
        return <StudentLogin />;
      default:
        return <StudentLogin />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Career<span className="text-blue-600">Link</span>
          </h1>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Choose Your Role
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  onClick={() => setSelectedRole(key)}
                  className={`flex flex-col items-center p-3 rounded-lg text-white font-medium transition-all duration-200 ${
                    selectedRole === key
                      ? color
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                >
                  <Icon size={20} className="mb-1" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <div className="border-t border-gray-100 pt-6">
            {renderLoginForm()}
          </div>
        </div>
      </div>
    </div>
  );
}
