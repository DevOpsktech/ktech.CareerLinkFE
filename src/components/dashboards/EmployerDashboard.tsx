import { useState } from "react";
import { JobPostingForm } from "../forms/JobPostingForm";
import { DataTable } from "../ui/DataTable";
import { StudentSearch } from "../features/StudentSearch";
import { myJobsColumns, myJobsData, tabs } from "../../constants";

export function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("jobs");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Employer Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your job postings and find talent
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
                    ? "border-blue-500 text-blue-600"
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
        {activeTab === "jobs" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                My Job Postings
              </h2>
            </div>
            <DataTable columns={myJobsColumns} data={myJobsData} showActions />
          </div>
        )}

        {activeTab === "post" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Post a New Job
            </h2>
            <JobPostingForm />
          </div>
        )}

        {activeTab === "students" && <StudentSearch />}
      </div>
    </div>
  );
}
