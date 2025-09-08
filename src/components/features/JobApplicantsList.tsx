import { useState } from "react";
import type { JobApplication } from "../../types/job";
import Loader from "../ui/Loader";
import ErrorBlock from "../ui/ErrorBlock";
import { useToast } from "../../contexts/ToastContext";
import { ApplicantDetailModal } from "./ApplicantDetailModal";
import { useEmployerJobApplicants } from "../../hooks/useEmployerJobApplicants";
import { Button } from "../ui/Button";
import { formatDate } from "../../utils/reusables";

interface JobapplicationsListProps {
  jobId?: string; // Optional - if provided, shows applications for specific job
  title?: string;
}

export function JobapplicationsList({
  jobId,
  title,
}: JobapplicationsListProps) {
  const [selectedApplicant, setSelectedApplicant] =
    useState<JobApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showError } = useToast();
  const { applications, loading, error, updateApplicationStatus, refetch } =
    useEmployerJobApplicants();

  const handleApplicantClick = (applicant: JobApplication) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (
    applicationId: string,
    newStatus: JobApplication["status"]
  ) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
    } catch {
      showError("Failed to update application status");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader text="Loading applications..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <ErrorBlock message={error} onRetry={refetch} />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">
          {jobId
            ? "No applications for this job yet."
            : "No job applications found."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {title || (jobId ? "Job applications" : "All Job applications")}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {applications.length} applicant
              {applications.length !== 1 ? "s" : ""}
            </div>
            <Button
              variant="outline"
              size="sm"
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

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  {!jobId && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications &&
                  applications.map((applicant) => (
                    <tr
                      key={applicant.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleApplicantClick(applicant)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {applicant.student?.firstName?.[0] || "A"}
                                {applicant.student?.lastName?.[0] || "P"}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {applicant.student?.firstName}{" "}
                              {applicant.student?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {applicant.student?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      {!jobId && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {applicant.jobTitle || "Job Title"}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(applicant.appliedAt)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(applicant.id, "shortlisted");
                            }}
                          >
                            Shortlist
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(applicant.id, "rejected");
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <ApplicantDetailModal
          applicant={selectedApplicant}
          isOpen={isModalOpen}
          onClose={closeModal}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
}
