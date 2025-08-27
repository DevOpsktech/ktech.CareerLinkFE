import { useState } from "react";
import { DataTable } from "../ui/DataTable";
import { StudentSearch } from "../features/StudentSearch";
import {
  myJobsColumns,
  myJobsData,
  studentColumns,
  tabs,
} from "../../constants";
import { StudentTable } from "../ui/StudentTable";
import Heading from "../ui/Heading";
import Tabs from "../ui/Tabs";
import { useJobs } from "../../hooks/useJobs";
import Loader from "../ui/Loader";
import { JobPostingForm } from "../forms/job-posting-form/JobPostingForm";
import { useApplications } from "../../hooks/useApllications";
import { useAuth } from "../../contexts/AuthContext";

export function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("jobs");
  const { loading } = useJobs();
  const { user } = useAuth();
  const { applications } = useApplications(user?.id);
  console.log("Applications:", applications);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Heading
        title="Employer Dashboard"
        description="Manage your job postings and find talent"
      />
      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTabFor="employer"
      />
      {/* Tab Content */}
      <div>
        {activeTab === "jobs" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                My Job Postings
              </h2>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <Loader text="Loading Jobs..." />
              </div>
            ) : (
              <DataTable
                columns={myJobsColumns}
                data={myJobsData}
                showActions
              />
            )}
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

        {activeTab === "student-applied" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Students Who Applied
            </h2>
            <StudentTable
              columns={studentColumns}
              data={applications}
              onViewCv={(cvUrl) => window.open(cvUrl, "_blank")}
              actions={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
