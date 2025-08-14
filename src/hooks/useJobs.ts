import { useState, useEffect } from "react";
import { jobsApi } from "../api/jobsApi";
import type { PaginatedResponse } from "../types/api";
import type { CreateJobRequest, Job, JobSearchFilters } from "../types/job";

export const useJobs = (filters: JobSearchFilters = {}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchJobs = async (searchFilters: JobSearchFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response: PaginatedResponse<Job> = await jobsApi.getJobs({
        ...filters,
        ...searchFilters,
      });

      setJobs(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: CreateJobRequest): Promise<Job | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await jobsApi.createJob(jobData);
      await fetchJobs(); // Refresh the list
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (
    id: string,
    jobData: Partial<CreateJobRequest>
  ): Promise<Job | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await jobsApi.updateJob(id, jobData);
      await fetchJobs(); // Refresh the list
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update job");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await jobsApi.deleteJob(id);
      await fetchJobs(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    error,
    pagination,
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
    refetch: () => fetchJobs(),
  };
};

export const useJob = (id: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await jobsApi.getJobById(id);
      setJob(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch job");
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  return {
    job,
    loading,
    error,
    refetch: fetchJob,
  };
};
