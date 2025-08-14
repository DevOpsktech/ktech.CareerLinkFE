import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useJob } from "../../hooks/useJobs";
import { useAuth } from "../../contexts/AuthContext";
import { useApplications } from "../../hooks/useApllications";
import { JobApplicationModal } from "../modals/job-post-Form/JobApplicationModal";
import Loader from "../ui/Loader";
import {
  formatDeadline,
  formatJobType,
  formatPostedDate,
  formatSalary,
} from "../jobDetail/JobDetailFunctions";
import {
  JobHeader,
  JobSummary,
  JobRequirements,
  JobDescription,
  JobResponsibilities,
  ApplyButton,
  SuccessMessage,
  ShareJob,
  CompanyInfo,
} from "../jobDetail";
import JobNotFound from "../jobDetail/JobNotFound";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { job, loading, error } = useJob(id!);
  const {
    applications,
    applyToJob,
    loading: applyingToJob,
  } = useApplications();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Check if user has already applied to this job
  const hasApplied = applications.some(
    (app) => app.jobId === id && app.studentId === user?.id
  );

  const handleApply = async (applicationData: {
    coverLetter: string;
    resumeUrl?: string;
  }) => {
    if (!user || !id) return;

    const application = await applyToJob(id, user.id, applicationData);
    if (application) {
      setShowApplicationModal(false);
      setApplicationSuccess(true);
      setTimeout(() => setApplicationSuccess(false), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader text="Loading job details..." />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return <JobNotFound error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        {applicationSuccess && <SuccessMessage />}

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </button>
        </div>

        {/* Job Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <JobHeader
              formatDeadline={formatDeadline}
              formatJobType={formatJobType}
              formatPostedDate={formatPostedDate}
              formatSalary={formatSalary}
              job={job}
              key={job.id}
            />

            {/* Apply Button */}
            <ApplyButton
              applyingToJob={applyingToJob}
              hasApplied={hasApplied}
              onApplyClick={() => setShowApplicationModal(true)}
              user={user}
              key={user?.id || "apply-button"}
            />
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <JobDescription description={job.description} />

            {/* Responsibilities */}
            <JobResponsibilities responsibilities={job.responsibilities} />

            {/* Requirements */}
            <JobRequirements requirements={job.requirements} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Summary */}
            <JobSummary
              formatDeadline={formatDeadline}
              formatJobType={formatJobType}
              formatPostedDate={formatPostedDate}
              formatSalary={formatSalary}
              job={job}
              key={job.id}
            />

            {/* Company Info */}
            <CompanyInfo job={job} key={job.id} />

            {/* Share Job */}
            <ShareJob job={job} key={job.id} />
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <JobApplicationModal
          job={job}
          onClose={() => setShowApplicationModal(false)}
          onSubmit={handleApply}
          isSubmitting={applyingToJob}
        />
      )}
    </div>
  );
}
