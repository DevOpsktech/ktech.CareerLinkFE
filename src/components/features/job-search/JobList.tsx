/* eslint-disable @typescript-eslint/no-explicit-any */
import Loader from "../../ui/Loader";
import ErrorBlock from "../../ui/ErrorBlock";
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
  appliedJobIds,
}: any) {
  if (error) {
    return (
      <div className="py-4">
        <ErrorBlock
          message={`Error loading jobs: ${error}`}
          onRetry={onRetry}
        />
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

  if (!jobs || jobs.length === 0) {
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
          hasApplied={appliedJobIds?.has?.(job.id)}
        />
      ))}
    </div>
  );
}
