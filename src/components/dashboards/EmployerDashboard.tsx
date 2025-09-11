import { useState } from "react";
import { DataTable } from "../ui/DataTable";
import { StudentSearch } from "../features/StudentSearch";
import Heading from "../ui/Heading";
import { useEmployerJobs } from "../../hooks/useEmployerJobs";
import Loader from "../ui/Loader";
import { JobPostingForm } from "../forms/job-posting-form/JobPostingForm";
import { Button } from "../ui/Button";
import { JobapplicationsList } from "../features/JobApplicantsList";
import UpdateJobModal from "../modals/job-post-Form/UpdateJobModal";
import { useAuth } from "../../contexts/AuthContext";
import { ConfirmModal } from "../ui/ConfirmModal";
import { useToast } from "../../contexts/ToastContext";
import { jobsApi } from "../../api/jobsApi";
import { DashboardLayout } from "../ui/DashboardLayout";
import {
  BriefcaseBusiness,
  Plus,
  LucideUsers2,
  Search,
  BarChart3,
  FileText,
  TrendingUp,
} from "lucide-react";

export function EmployerDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const { user } = useAuth();
  const { jobs, loading, error, refetch } = useEmployerJobs(user?.id || null);
  const { showSuccess, showError } = useToast();
  const [jobPendingDelete, setJobPendingDelete] = useState<{
    id: string;
    title?: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleBackToJobs = () => {
    setSelectedJobId(null);
    setActiveSection("jobs");
  };

  // Enhanced columns for My Jobs with actions
  const enhancedMyJobsColumns = [
    { key: "title", label: "Job Title" },
    { key: "location", label: "Location" },
    { key: "type", label: "Type" },
    {
      key: "applications",
      label: "Applications",
    },
    { key: "status", label: "Status" },
    { key: "posted", label: "Posted Date" },
  ];

  // Transform jobs data to match the expected format for DataTable
  const transformedJobsData = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    applications: job.applicationCount || "0",
    status: job.status || "Active",
    posted: job.postedDate
      ? new Date(job.postedDate).toLocaleDateString()
      : "N/A",
    location: job.location || "N/A",
    type: job.type || "N/A",
  }));

  const handleEditJob = (row: { id: string }) => {
    setEditingJobId(row.id);
  };

  const handleRequestDelete = (row: { id: string; title?: string }) => {
    setJobPendingDelete({ id: row.id, title: row.title });
  };

  const handleConfirmDelete = async () => {
    if (!jobPendingDelete || deleting) return;
    try {
      setDeleting(true);
      await jobsApi.deleteJob(jobPendingDelete.id);
      showSuccess("Job deleted successfully");
      setJobPendingDelete(null);
      refetch();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to delete job";
      showError(message);
    } finally {
      setDeleting(false);
    }
  };

  const editingJob = jobs.find((j) => j.id === editingJobId) || null;

  // Calculate total applications
  const totalApplications = jobs.reduce(
    (sum, job) => sum + (job.applicationCount || 0),
    0
  );

  // Sidebar navigation items
  const sidebarItems = [
    {
      key: "overview",
      label: "Overview",
      icon: BarChart3,
    },
    {
      key: "jobs",
      label: "My Jobs",
      icon: BriefcaseBusiness,
      badge: jobs.length,
    },
    {
      key: "post",
      label: "Post Job",
      icon: Plus,
    },
    {
      key: "applicants",
      label: "Job Applicants",
      icon: LucideUsers2,
      badge: totalApplications,
    },
    {
      key: "students",
      label: "Find Students",
      icon: Search,
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <Heading
              title="Employer Dashboard"
              description="Manage your job postings and find talent"
            />

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      Active Jobs
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {jobs.length}
                    </p>
                  </div>
                  <BriefcaseBusiness className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">
                      Total Applications
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {totalApplications}
                    </p>
                  </div>
                  <LucideUsers2 className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">
                      Avg. Applications
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {jobs.length > 0
                        ? Math.round(totalApplications / jobs.length)
                        : 0}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveSection("post")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover-lift transition-colors text-left focus-ring"
                >
                  <Plus className="w-8 h-8 text-green-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Post New Job</h4>
                  <p className="text-sm text-gray-500">
                    Create a new job posting
                  </p>
                </button>
                <button
                  onClick={() => setActiveSection("jobs")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover-lift transition-colors text-left focus-ring"
                >
                  <BriefcaseBusiness className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Manage Jobs</h4>
                  <p className="text-sm text-gray-500">
                    View and edit your job postings
                  </p>
                </button>
                <button
                  onClick={() => setActiveSection("applicants")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover-lift transition-colors text-left focus-ring"
                >
                  <LucideUsers2 className="w-8 h-8 text-purple-600 mb-2" />
                  <h4 className="font-medium text-gray-900">View Applicants</h4>
                  <p className="text-sm text-gray-500">
                    Review job applications
                  </p>
                </button>
                <button
                  onClick={() => setActiveSection("students")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover-lift transition-colors text-left focus-ring"
                >
                  <Search className="w-8 h-8 text-orange-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Find Students</h4>
                  <p className="text-sm text-gray-500">
                    Search for potential candidates
                  </p>
                </button>
              </div>
            </div>

            {/* Recent Jobs */}
            {jobs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Job Postings
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {jobs.slice(0, 3).map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {job.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {job.location} • {job.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {job.applicationCount || 0} applications
                          </p>
                          <p className="text-xs text-gray-500">{job.status}</p>
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
              title="My Job Postings"
              description="Manage your job postings"
            />

            {/* Back button when viewing applicants for specific job */}
            {selectedJobId && activeSection === "applicants" && (
              <div className="mb-4">
                <Button
                  variant="outline"
                  onClick={handleBackToJobs}
                  className="flex items-center space-x-2"
                >
                  ← Back to My Jobs
                </Button>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      My Job Postings
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={refetch}
                    disabled={loading}
                    className="flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Refresh</span>
                  </Button>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <Loader text="Loading Jobs..." />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">Error: {error}</p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.815-8.964-2.222m2.964-2.222A23.931 23.931 0 0012 9c3.183 0 6.22.815 8.964 2.222M12 15c-3.183 0-6.22-.815-8.964-2.222m2.964-2.222A23.931 23.931 0 0012 9c3.183 0 6.22.815 8.964 2.222"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-lg font-medium">
                    No jobs posted yet
                  </p>
                </div>
              ) : (
                <DataTable
                  columns={enhancedMyJobsColumns}
                  data={transformedJobsData}
                  showActions={true}
                  editJobs={true}
                  onEdit={handleEditJob}
                  onDelete={handleRequestDelete}
                />
              )}
            </div>
          </div>
        );

      case "post":
        return (
          <div className="space-y-6">
            <Heading
              title="Post a New Job"
              description="Create a new job posting"
            />
            <div className="bg-white rounded-xl shadow-sm p-6">
              <JobPostingForm />
            </div>
          </div>
        );

      case "applicants":
        return (
          <div className="space-y-6">
            <Heading
              title={
                selectedJobId
                  ? `Applicants for ${
                      jobs.find((job) => job.id === selectedJobId)?.title
                    }`
                  : "All Job Applicants"
              }
              description="Review and manage job applications"
            />
            <div className="bg-white rounded-xl shadow-sm p-6">
              <JobapplicationsList
                jobId={selectedJobId || undefined}
                title={
                  selectedJobId
                    ? `Applicants for ${
                        jobs.find((job) => job.id === selectedJobId)?.title
                      }`
                    : "All Job Applicants"
                }
              />
            </div>
          </div>
        );

      case "students":
        return (
          <div className="space-y-6">
            <Heading
              title="Find Students"
              description="Search for potential candidates"
            />
            <StudentSearch />
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <Heading
              title="Employer Dashboard"
              description="Manage your job postings and find talent"
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
      userRole="Employer"
    >
      {renderContent()}

      <UpdateJobModal
        isOpen={Boolean(editingJobId)}
        job={editingJob}
        onClose={() => setEditingJobId(null)}
        onUpdated={() => {
          setEditingJobId(null);
          refetch();
        }}
      />

      <ConfirmModal
        isOpen={Boolean(jobPendingDelete)}
        title="Delete Job"
        message={
          jobPendingDelete
            ? `Are you sure you want to delete "${
                jobPendingDelete.title || "this job"
              }"? This action cannot be undone.`
            : "Are you sure you want to delete this job? This action cannot be undone."
        }
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText={"Cancel"}
        onConfirm={handleConfirmDelete}
        onCancel={() => (!deleting ? setJobPendingDelete(null) : undefined)}
      />
    </DashboardLayout>
  );
}
