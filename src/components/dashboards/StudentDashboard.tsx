import React, { useState } from "react";
import { ProfileForm } from "../forms/ProfileForm";
import { DataTable } from "../ui/DataTable";
import { User, Search, Bookmark } from "lucide-react";
import { JobSearch } from "../features/JobSearch";

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("jobs");

  const appliedJobsColumns = [
    { key: "title", label: "Job Title" },
    { key: "company", label: "Company" },
    { key: "appliedDate", label: "Applied Date" },
    { key: "status", label: "Status" },
  ];

  const appliedJobsData = [
    {
      id: "1",
      title: "Software Intern",
      company: "TechCorp",
      appliedDate: "2024-01-20",
      status: "Under Review",
    },
    {
      id: "2",
      title: "Marketing Assistant",
      company: "MarketPro",
      appliedDate: "2024-01-18",
      status: "Interview Scheduled",
    },
    {
      id: "3",
      title: "Data Analyst",
      company: "DataCo",
      appliedDate: "2024-01-15",
      status: "Rejected",
    },
  ];

  const tabs = [
    { key: "jobs", label: "Find Jobs", icon: Search },
    { key: "applied", label: "Applied Jobs", icon: Bookmark },
    { key: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Student Dashboard
        </h1>
        <p className="text-gray-600">
          Find your dream job and build your career
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "jobs" && <JobSearch />}

        {activeTab === "applied" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Applied Jobs
              </h2>
            </div>
            <DataTable columns={appliedJobsColumns} data={appliedJobsData} />
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Complete Your Profile
            </h2>
            <ProfileForm />
          </div>
        )}
      </div>
    </div>
  );
}
