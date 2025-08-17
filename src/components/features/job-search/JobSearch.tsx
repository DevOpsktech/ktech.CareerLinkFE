import { useState } from "react";
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
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    company: "",
  });

  const { user } = useAuth();
  const { jobs, loading, error, fetchJobs, pagination } = useJobs();
  const { applyToJob, loading: applyingToJob } = useApplications();

  const handleSearch = (searchFilters: JobSearchFilters) =>
    fetchJobs(searchFilters);

  const handleApplyToJob = async (jobId: string) => {
    if (!user || user.role !== "student") return;
    const application = await applyToJob(jobId, user.id, {
      coverLetter: "I am interested in this position and would like to apply.",
    });
    if (application) alert("Application submitted successfully!");
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
        onRetry={() => fetchJobs()}
        onApply={handleApplyToJob}
        onViewDetails={(id: string) => navigate(`/jobs/${id}`)}
      />

      <JobPagination
        pagination={pagination}
        loading={loading}
        onPageChange={(page: number) =>
          fetchJobs({ ...filters, query: searchQuery, page })
        }
      />
    </div>
  );
}
