import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "./ConfirmModal";
import { Logo, EmblemLogo } from "./Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface SidebarItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path?: string;
  onClick?: () => void;
  badge?: number;
  color?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItem: string;
  onItemClick: (key: string) => void;
  title: string;
  userRole: string;
  className?: string;
}

export function Sidebar({
  items,
  activeItem,
  onItemClick,
  userRole,
  className = "",
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileOpen(false);
    setShowLogoutConfirm(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "blue";
      case "Employer":
        return "green";
      case "Student":
        return "purple";
      default:
        return "gray";
    }
  };

  const roleColor = getRoleColor(userRole);

  const SidebarContent = () => (
    <div
      className={`h-full flex flex-col bg-primary border-r border-primary sidebar-transition ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-primary flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed ? (
            <div className="min-w-0 flex-1">
              <Logo size="lg" />
            </div>
          ) : (
            <EmblemLogo size="sm" />
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-secondary transition-colors flex-shrink-0 text-primary"
          >
            {isCollapsed ? <EmblemLogo size="sm" /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 sidebar-scroll overflow-y-auto min-h-0">
        {items.map((item) => {
          const isActive = activeItem === item.key;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => {
                onItemClick(item.key);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-lightest-blue text-dark-blue border border-lightest-purple"
                  : "text-secondary hover:bg-secondary hover:text-primary"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                size={15}
                className={`flex-shrink-0 ${
                  isActive
                    ? "text-medium-blue"
                    : "text-muted group-hover:text-secondary"
                }`}
              />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left font-medium truncate">
                    {item.label}
                  </span>
                  {/* {item.badge && item.badge > 0 && (
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full bg-${roleColor}-100 text-${roleColor}-700 flex-shrink-0`}
                    >
                      {item.badge}
                    </span>
                  )} */}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme Switcher */}
      {!isCollapsed && (
        <div className="px-4 py-2 border-t border-primary">
          <ThemeSwitcher />
        </div>
      )}

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-primary flex-shrink-0">
        {!isCollapsed && (
          <div className="mb-4 p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-lightest-blue flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-medium-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">
                  {user?.fullName}
                </p>
                <p className="text-xs text-secondary capitalize truncate">
                  {userRole}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary hover:bg-red-50 hover:text-red-600 transition-all duration-200 ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="font-medium truncate">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden mobile-menu-button p-2 bg-primary rounded-lg shadow-theme-md border border-primary hover:bg-secondary transition-colors text-primary"
      >
        <Menu size={20} />
      </button>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block ${className}`}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 sidebar-overlay flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/20 bg-opacity-50 animate-fade-in"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar */}
          <div className="mobile-sidebar bg-primary h-full sidebar-content animate-slide-in-left flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-primary flex items-center justify-between flex-shrink-0">
              <div className="min-w-0 flex-1">
                <Logo size="sm" showText={true} />
                <p className="text-sm text-secondary capitalize truncate mt-1">
                  {userRole} Dashboard
                </p>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary flex-shrink-0 ml-2 text-primary"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Navigation Items */}
            <nav className="flex-1 p-4 space-y-2 sidebar-scroll overflow-y-auto min-h-0">
              {items.map((item) => {
                const isActive = activeItem === item.key;
                const Icon = item.icon;

                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      onItemClick(item.key);
                      setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-lightest-blue text-dark-blue border border-lightest-purple"
                        : "text-secondary hover:bg-secondary hover:text-primary"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={`flex-shrink-0 ${
                        isActive ? "text-medium-blue" : "text-muted"
                      }`}
                    />
                    <span className="flex-1 text-left font-medium truncate">
                      {item.label}
                    </span>
                    {item.badge && item.badge > 0 && (
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full bg-${roleColor}-100 text-${roleColor}-700 flex-shrink-0`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Theme Switcher */}
            <div className="px-4 py-2 border-t border-primary">
              <ThemeSwitcher />
            </div>

            {/* Mobile User Profile & Logout */}
            <div className="p-4 border-t border-primary flex-shrink-0">
              <div className="mb-4 p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-lightest-blue flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-medium-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-secondary capitalize truncate">
                      {userRole}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-secondary hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              >
                <LogOut size={20} className="flex-shrink-0" />
                <span className="font-medium truncate">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
