import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";
import {
  Users,
  Briefcase,
  GraduationCap,
  Mail,
  Lock,
  User,
  AlertCircle,
} from "lucide-react";

type RegisterRole = "Student" | "Employer" | "Admin";

export function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<RegisterRole>("Student");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const navigate = useNavigate();
  const { register, login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await register({
      email: credentials.email,
      password: credentials.password,
      fullName: credentials.fullName,
      role: selectedRole,
    });

    if (success) {
      // After successful registration, log in
      const loginSuccess = await login({
        email: credentials.email,
        password: credentials.password,
      });
      if (loginSuccess) {
        const redirectPath =
          selectedRole === "Admin"
            ? "/admin"
            : selectedRole === "Employer"
            ? "/employer"
            : "/student";
        navigate(redirectPath, { replace: true });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const roles = [
    {
      key: "Student" as RegisterRole,
      label: "Student",
      icon: GraduationCap,
      color: "bg-teal-500 hover:bg-teal-600",
      description: "Looking for job opportunities",
    },
    {
      key: "Employer" as RegisterRole,
      label: "Employer",
      icon: Briefcase,
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Hiring talent for your company",
    },
    {
      key: "Admin" as RegisterRole,
      label: "Administrator",
      icon: Users,
      color: "bg-red-500 hover:bg-red-600",
      description: "System administration",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Career<span className="text-blue-600">Link</span>
          </h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Choose Your Role
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(({ key, label, icon: Icon, color, description }) => (
                <button
                  key={key}
                  onClick={() => setSelectedRole(key)}
                  className={`flex flex-col items-center p-3 rounded-lg text-white font-medium transition-all duration-200 ${
                    selectedRole === key
                      ? color
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                  title={description}
                >
                  <Icon size={20} className="mb-1" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  id="fullname"
                  name="fullName"
                  required
                  value={credentials.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="your-email@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
