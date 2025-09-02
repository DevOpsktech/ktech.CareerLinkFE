import React, { useState } from "react";
import { User, Search, Bookmark } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useApplications } from "../../hooks/useApllications";
import { ProfileForm } from "../forms/profile/ProfileForm";
import Heading from "../ui/Heading";
import Tabs from "../ui/Tabs";
import {
  formatDate,
  formatStatus,
  getStatusColor,
} from "../../utils/reusables";
import Loader from "../ui/Loader";
import { JobSearch } from "../features/job-search/JobSearch";

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("jobs");
  const { user } = useAuth();
  const studentId = user?.student?.id;

  const { applications, loading, error, refetch } = useApplications(studentId);

  // Refetch applications when switching to the applied tab
  React.useEffect(() => {
    if (activeTab === "applied" && user?.id) {
      refetch();
    }
  }, [activeTab, user?.id, refetch]);

  const tabs = [
    { key: "jobs", label: "Find Jobs", icon: Search },
    { key: "applied", label: "Applied Jobs", icon: Bookmark },
    { key: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Heading
        title="Student Dashboard"
        description="Find your dream job and build your career"
      />

      {/* Tabs */}
      <Tabs
        tabs={tabs}
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
                Applied Jobs ({applications.length})
              </h2>
            </div>

            {loading ? (
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
                        Job Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {application.job?.title || "Job Title"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {application.job?.company?.name || "Company"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(application.appliedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {formatStatus(application.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(application.updatedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
