import React from "react";
import { Users, Briefcase, GraduationCap, Menu, X, LogOut } from "lucide-react";
import type { UserRole } from "../types/user";
import { useAuth } from "../contexts/AuthContext";

interface NavigationProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function Navigation({ currentRole, onRoleChange }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const roles = [
    { key: "admin" as UserRole, label: "Admin", icon: Users },
    { key: "employer" as UserRole, label: "Employer", icon: Briefcase },
    { key: "student" as UserRole, label: "Student", icon: GraduationCap },
  ];

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-red-500 hover:bg-red-600";
      case "employer":
        return "bg-blue-500 hover:bg-blue-600";
      case "student":
        return "bg-teal-500 hover:bg-teal-600";
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Career<span className="text-blue-600">Link</span>
              </h1>
              {user && (
                <div className="hidden pt-2 md:block text-sm text-gray-600">
                  Welcome, {user.name}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user?.role === "admin" &&
              roles.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => onRoleChange(key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                    currentRole === key
                      ? getRoleColor(key)
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {user?.role === "admin" &&
              roles.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    onRoleChange(key);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                    currentRole === key
                      ? getRoleColor(key)
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
