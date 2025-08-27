import { useState } from "react";
import { DataTable } from "../ui/DataTable";
import { StudentSearch } from "../features/StudentSearch";
import { myJobsColumns, myJobsData, tabs } from "../../constants";
import Heading from "../ui/Heading";
import Tabs from "../ui/Tabs";
import { useJobs } from "../../hooks/useJobs";
import Loader from "../ui/Loader";
import { JobPostingForm } from "../forms/job-posting-form/JobPostingForm";
import { useApplications } from "../../hooks/useApllications";
import { useAuth } from "../../contexts/AuthContext";
import { StudentActionsMenu } from "../features/StudentActionMenu";

export function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("jobs");
  const { loading } = useJobs();
  const { user } = useAuth();
  const {
    applications,
    loading: loadingApplications,
    error,
  } = useApplications(user?.id);

  const onViewCv = (cvUrl: string) => window.open(cvUrl, "_blank");
  const onShortlist = (student: any) => alert(`Shortlisted ${student.name}`);

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
            {loadingApplications ? (
              <div className="text-center py-8">
                <Loader text="Loading applications..." />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">
                  Error loading applications: {error}
                </p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  You haven't applied to any jobs yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name{" "}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Major{" "}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Graduation{" "}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Key Skills{" "}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GPA{" "}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {application.student?.name || "name not found"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {application.student?.major || "Company"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {application.student?.graduationYear ||
                            "year of graduation"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {application.student?.keySkills || "key skills"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {application.student?.gpa || "GPA"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <StudentActionsMenu
                            student={application.student}
                            onViewCv={onViewCv}
                            onShortlist={onShortlist}
                            onAccept={(s) => console.log("Accepted:", s)}
                            onRemove={(s) => console.log("Removed:", s)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
