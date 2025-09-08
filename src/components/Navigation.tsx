import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  Briefcase,
  GraduationCap,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ConfirmModal } from "./ui/ConfirmModal";
import { getRoleColor } from "../utils/reusables";
import NavButton from "./ui/NavButton";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const roles = [
    { key: "Admin", path: "/admin", label: "Admin", icon: Users },
    {
      key: "Employer",
      path: "/employer",
      label: "Employer",
      icon: Briefcase,
    },
    {
      key: "Student",
      path: "/student",
      label: "Student",
      icon: GraduationCap,
    },
  ];

  const isCurrentPath = (path: string) => location.pathname === path;

  const handleRoleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Career<span className="text-blue-600">Link</span>
              </h1>
              {user && (
                <span className="hidden md:block text-sm text-gray-500">
                  Welcome, {user.fullName}
                </span>
              )}
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-3">
              {/* {user?.role === "Admin" &&
                roles.map(({ key, path, label, icon: Icon }) => (
                  <NavButton
                    key={key}
                    active={isCurrentPath(path)}
                    label={label}
                    Icon={Icon}
                    color={getRoleColor(key)}
                    onClick={() => handleRoleNavigation(path)}
                  />
                ))} */}

              {/* Profile Link */}
              {/* <button
                onClick={() => navigate("/profile")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  isCurrentPath("/profile")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <User size={18} />
                <span>Profile</span>
              </button> */}

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-all"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2 animate-slide-down">
              {user?.role === "Admin" &&
                roles.map(({ key, path, label, icon: Icon }) => (
                  <NavButton
                    key={key}
                    active={isCurrentPath(path)}
                    label={label}
                    Icon={Icon}
                    color={getRoleColor(key)}
                    onClick={() => handleRoleNavigation(path)}
                  />
                ))}

              {/* Profile Link - Mobile */}
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  isCurrentPath("/profile")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <User size={18} />
                <span>Profile</span>
              </button>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-all"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
