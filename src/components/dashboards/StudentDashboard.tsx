import React, { useState } from "react";
import {
  User,
  Search,
  Bookmark,
  BarChart3,
  FileText,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useApplications } from "../../hooks/useApllications";
import { ProfileForm } from "../forms/profile/ProfileForm";
import Heading from "../ui/Heading";
import {
  formatDate,
  formatStatus,
  getStatusColor,
} from "../../utils/reusables";
import Loader from "../ui/Loader";
import { JobSearch } from "../features/job-search/JobSearch";
import ErrorBlock from "../ui/ErrorBlock";
import { DashboardLayout } from "../ui/DashboardLayout";

export function StudentDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const { user } = useAuth();
  const studentId = user?.student?.id;

  const { applications, loading, error, refetch } = useApplications(studentId);

  // Refetch applications when switching to the applied tab
  React.useEffect(() => {
    if (activeSection === "applied" && user?.id) {
      refetch();
    }
  }, [activeSection, user?.id, refetch]);

  // Calculate application statistics
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(
    (app) => app.status === "pending"
  ).length;
  const acceptedApplications = applications.filter(
    (app) => app.status === "accepted"
  ).length;

  // Sidebar navigation items
  const sidebarItems = [
    {
      key: "overview",
      label: "Overview",
      icon: BarChart3,
    },
    {
      key: "jobs",
      label: "Find Jobs",
      icon: Search,
    },
    {
      key: "applied",
      label: "Applied Jobs",
      icon: Bookmark,
      badge: totalApplications,
    },
    {
      key: "profile",
      label: "Profile",
      icon: User,
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <Heading
              title="Student Dashboard"
              description="Find your dream job and build your career"
            />

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">
                      Total Applications
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {totalApplications}
                    </p>
                  </div>
                  <Bookmark className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">
                      Pending Reviews
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {pendingApplications}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      Accepted
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {acceptedApplications}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveSection("jobs")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover-lift transition-colors text-left focus-ring"
                >
                  <Search className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Find Jobs</h4>
                  <p className="text-sm text-gray-500">
                    Browse and search for job opportunities
                  </p>
                </button>
                <button
                  onClick={() => setActiveSection("applied")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover-lift transition-colors text-left focus-ring"
                >
                  <Bookmark className="w-8 h-8 text-purple-600 mb-2" />
                  <h4 className="font-medium text-gray-900">
                    View Applications
                  </h4>
                  <p className="text-sm text-gray-500">
                    Track your job application status
                  </p>
                </button>
                <button
                  onClick={() => setActiveSection("profile")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover-lift transition-colors text-left focus-ring"
                >
                  <User className="w-8 h-8 text-green-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Update Profile</h4>
                  <p className="text-sm text-gray-500">
                    Complete your profile information
                  </p>
                </button>
              </div>
            </div>

            {/* Recent Applications */}
            {applications.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Applications
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((application) => (
                      <div
                        key={application.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {application.job?.title || "Job Title"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {application.job?.company?.name || "Company"}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {formatStatus(application.status)}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(application.appliedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "jobs":
        return (
          <div className="space-y-6">
            <Heading
              title="Find Jobs"
              description="Browse and search for job opportunities"
            />
            <JobSearch />
          </div>
        );

      case "applied":
        return (
          <div className="space-y-6">
            <Heading
              title="Applied Jobs"
              description="Track your job application status"
            />
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
                <div className="p-6">
                  <ErrorBlock
                    message={`Error loading applications: ${error}`}
                    onRetry={refetch}
                  />
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Bookmark className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium">
                    You haven't applied to any jobs yet.
                  </p>
                  <p className="text-gray-500 mt-2">
                    Start by browsing available jobs and applying to positions
                    that interest you.
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
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <Heading
              title="Complete Your Profile"
              description="Update your profile information and skills"
            />
            <div className="bg-white rounded-xl shadow-sm p-6">
              <ProfileForm />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <Heading
              title="Student Dashboard"
              description="Find your dream job and build your career"
            />
            <div className="text-center py-12">
              <p className="text-gray-500">
                Select a section from the sidebar to get started.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeItem={activeSection}
      onItemClick={setActiveSection}
      title="CareerLink"
      userRole="Student"
    >
      {renderContent()}
    </DashboardLayout>
  );
}
