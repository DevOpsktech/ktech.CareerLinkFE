import { useState } from "react";
import { ProfileForm } from "../forms/profile/ProfileForm";
import { DataTable } from "../ui/DataTable";
import { JobSearch } from "../features/JobSearch";
import {
  appliedJobsColumns,
  appliedJobsData,
  studentTabs,
} from "../../constants";
import Heading from "../ui/Heading";

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("jobs");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Heading
        title="Student Dashboard"
        description="Find your dream job and build your career"
      />

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {studentTabs.map(({ key, label, icon: Icon }) => (
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
