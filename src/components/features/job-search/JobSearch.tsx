import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../contexts/AuthContext";
import { useJobs } from "../../../hooks/useJobs";
import { useApplications } from "../../../hooks/useApllications";
import type { JobSearchFilters } from "../../../types/job";
import { JobSearchFilters as Filters } from "./JobSearchFilters";
import { JobList } from "./JobList";
import { JobPagination } from "./JobPagination";

export function JobSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<JobSearchFilters>({
    pageSize: 10,
  });

  const { user } = useAuth();
  const { jobs, loading, error, fetchJobs, fetchAllJobs, pagination } =
    useJobs();
  const { applyToJob, loading: applyingToJob } = useApplications();

  // Fetch all jobs by default when component mounts
  useEffect(() => {
    fetchAllJobs(10);
  }, []); // Only run once on mount

  const handleSearch = (searchFilters: JobSearchFilters) => {
    // Merge the search filters with existing filters
    const mergedFilters = { ...filters, ...searchFilters };
    setFilters(mergedFilters);

    // If no search criteria are provided, fetch all jobs
    if (
      !searchFilters.q &&
      !searchFilters.location &&
      !searchFilters.type &&
      !searchFilters.experienceLevel &&
      !searchFilters.isRemote &&
      !searchFilters.salaryMin &&
      !searchFilters.salaryMax &&
      !searchFilters.companyId &&
      !searchFilters.status &&
      (!searchFilters.skills || searchFilters.skills.length === 0)
    ) {
      fetchAllJobs(10);
    } else {
      fetchJobs(mergedFilters);
    }
  };

  const handleApplyToJob = async (jobId: string) => {
    if (!user || user.role !== "Student") return;
    await applyToJob({
      jobId,
      studentId: user.id,
      coverLetter: "I am interested in this position and would like to apply.",
    });
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    fetchJobs(updatedFilters);
  };

  return (
    <div className="space-y-6">
      <Filters
        searchQuery={searchQuery}
        filters={filters}
        onSearchQueryChange={setSearchQuery}
        onFilterChange={setFilters}
        onSubmit={handleSearch}
      />

      <JobList
        jobs={jobs}
        loading={loading}
        error={error}
        user={user}
        applying={applyingToJob}
        onRetry={() => fetchAllJobs(10)}
        onApply={handleApplyToJob}
        onViewDetails={(id: string) => navigate(`/jobs/${id}`)}
      />

      <JobPagination
        pagination={pagination}
        loading={loading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
