import React from "react";
import { Sidebar } from "./Sidebar";

interface SidebarItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path?: string;
  onClick?: () => void;
  badge?: number;
  color?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  activeItem: string;
  onItemClick: (key: string) => void;
  title: string;
  userRole: string;
  className?: string;
}

export function DashboardLayout({
  children,
  sidebarItems,
  activeItem,
  onItemClick,
  title,
  userRole,
  className = "",
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        items={sidebarItems}
        activeItem={activeItem}
        onItemClick={onItemClick}
        title={title}
        userRole={userRole}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className={`min-h-screen ${className}`}>
          {/* Content */}
          <div className="p-4 lg:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
