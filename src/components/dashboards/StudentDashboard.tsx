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
import Tabs from "../ui/Tabs";

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("jobs");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Heading
        title="Student Dashboard"
        description="Find your dream job and build your career"
      />

      {/* Tabs */}
      <Tabs
        tabs={studentTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTabFor="student"
      />

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
