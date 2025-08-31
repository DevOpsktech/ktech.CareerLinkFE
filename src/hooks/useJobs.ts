import { useState, useEffect } from "react";
import { jobsApi } from "../api/jobsApi";
import type { CreateJobRequest, Job, JobSearchFilters } from "../types/job";
import { cleanApiResponse, transformJobData } from "../utils/api";

export const useJobs = (filters: JobSearchFilters = {}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async (searchFilters: JobSearchFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await jobsApi.getJobs({
        ...filters,
        ...searchFilters,
      });

      // Clean and transform the response
      const responseData = (response as any).data || response;
      const cleanedJobs = cleanApiResponse(responseData).map(transformJobData);
      setJobs(cleanedJobs);
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
      return transformJobData(response.data);
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
      return transformJobData(response.data);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    jobs,
    loading,
    error,
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
      // Clean and transform the response
      const responseData = (response as any).data || response;
      const cleanedJob = transformJobData(cleanApiResponse(responseData));
      setJob(cleanedJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch job");
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    job,
    loading,
    error,
    refetch: fetchJob,
  };
};
