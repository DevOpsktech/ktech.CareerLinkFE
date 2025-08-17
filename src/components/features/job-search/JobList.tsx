/* eslint-disable @typescript-eslint/no-explicit-any */
import Loader from "../../ui/Loader";
import { JobCard } from "./JobCard";

export function JobList({
  jobs,
  loading,
  error,
  user,
  onRetry,
  onApply,
  applying,
  onViewDetails,
}: any) {
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading jobs: {error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-teal-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader text="Loading jobs..." />
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No jobs found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job: any) => (
        <JobCard
          key={job.id}
          job={job}
          user={user}
          onViewDetails={() => onViewDetails(job.id)}
          onApply={() => onApply(job.id)}
          applying={applying}
        />
      ))}
    </div>
  );
}
