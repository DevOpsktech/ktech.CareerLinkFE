import { useState } from "react";
import { DataTable } from "../ui/DataTable";
import { StudentSearch } from "../features/StudentSearch";
import { tabs } from "../../constants";
import Heading from "../ui/Heading";
import Tabs from "../ui/Tabs";
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

export function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("jobs");
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
    setActiveTab("jobs");
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Heading
        title="Employer Dashboard"
        description="Manage your job postings and find talent"
      />

      {/* Back button when viewing applicants for specific job */}
      {selectedJobId && activeTab === "applicants" && (
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
        )}

        {activeTab === "post" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Post a New Job
            </h2>
            <JobPostingForm />
          </div>
        )}

        {activeTab === "applicants" && (
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
        )}

        {activeTab === "students" && <StudentSearch />}
      </div>

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
    </div>
  );
}
