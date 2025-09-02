import React, { useState } from "react";
import type { JobApplication } from "../../types/job";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useToast } from "../../contexts/ToastContext";

interface ApplicantDetailModalProps {
  applicant: JobApplication;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (
    applicationId: string,
    status: JobApplication["status"]
  ) => void;
}

export function ApplicantDetailModal({
  applicant,
  isOpen,
  onClose,
  onStatusUpdate,
}: ApplicantDetailModalProps) {
  const [updating, setUpdating] = useState(false);
  const { showSuccess, showError } = useToast();

  if (!isOpen) return null;

  const getStatusColor = (status: JobApplication["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "interview_scheduled":
        return "bg-purple-100 text-purple-800";
      case "interviewed":
        return "bg-indigo-100 text-indigo-800";
      case "offered":
        return "bg-emerald-100 text-emerald-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusUpdate = async (newStatus: JobApplication["status"]) => {
    setUpdating(true);
    try {
      await onStatusUpdate(applicant.id, newStatus);
      showSuccess(
        `Application status updated to ${newStatus.replace("_", " ")}`
      );
      onClose();
    } catch (error) {
      showError("Failed to update application status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusOptions = () => {
    const currentStatus = applicant.status;
    const allStatuses: JobApplication["status"][] = [
      "pending",
      "reviewing",
      "shortlisted",
      "interview_scheduled",
      "interviewed",
      "offered",
      "accepted",
      "rejected",
      "withdrawn",
    ];

    return allStatuses.filter((status) => status !== currentStatus);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Applicant Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Applicant Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">
                Applicant Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-sm text-gray-900">
                    {applicant.student?.firstName} {applicant.student?.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">
                    {applicant.student?.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Applied Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(applicant.appliedAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Current Status
                  </label>{" "}
                  {applicant.status}
                </div>
              </div>
            </div>

            {/* Job Information */}
            {applicant.job && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">
                  Job Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Job Title
                    </label>
                    <p className="text-sm text-gray-900">
                      {applicant.job.title}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Company
                    </label>
                    <p className="text-sm text-gray-900">
                      {applicant.job.company}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Location
                    </label>
                    <p className="text-sm text-gray-900">
                      {applicant.job.location}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Job Type
                    </label>
                    <p className="text-sm text-gray-900">
                      {applicant.job.type}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Cover Letter */}
            {applicant.coverLetter && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Cover Letter</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {applicant.coverLetter}
                </p>
              </div>
            )}

            {/* Resume */}
            {applicant.resumeUrl && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Resume</h4>
                <a
                  href={applicant.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  View Resume
                </a>
              </div>
            )}

            {/* Status Update */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Update Status</h4>
              <div className="flex flex-wrap gap-2">
                {getStatusOptions().map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(status)}
                    disabled={updating}
                  >
                    {status.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
