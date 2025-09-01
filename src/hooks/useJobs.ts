import { useState, useEffect, useCallback, useRef } from "react";
import { jobsApi } from "../api/jobsApi";
import type { CreateJobRequest, Job, JobSearchFilters } from "../types/job";
import { cleanApiResponse, transformJobData } from "../utils/api";
import { useToast } from "../contexts/ToastContext";

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

  const { showSuccess, showError } = useToast();
  const lastFetchRef = useRef<string>("");
  const isInitializedRef = useRef(false);

  const fetchJobs = useCallback(
    async (searchFilters: JobSearchFilters = {}) => {
      const filterKey = JSON.stringify({ ...filters, ...searchFilters });

      // Prevent duplicate requests
      if (lastFetchRef.current === filterKey && isInitializedRef.current) {
        return;
      }

      setLoading(true);
      setError(null);
      lastFetchRef.current = filterKey;

      try {
        const response = await jobsApi.getJobs({
          ...filters,
          ...searchFilters,
        });

        // Handle the new API response structure
        const responseData = response.data || response;
        const cleanedJobs = cleanApiResponse(responseData as Job[]) as Job[];
        setJobs(cleanedJobs);

        // Handle pagination if available
        if (
          responseData &&
          typeof responseData === "object" &&
          "pagination" in responseData
        ) {
          setPagination(
            (responseData as { pagination: typeof pagination }).pagination
          );
        }

        isInitializedRef.current = true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch jobs";
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [filters, showError]
  );

  const createJob = useCallback(
    async (jobData: CreateJobRequest): Promise<Job | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await jobsApi.createJob(jobData);
        const newJob = transformJobData(response.data as Job) as unknown as Job;

        // Optimistically update the jobs list
        setJobs((prevJobs) => [newJob, ...prevJobs]);

        showSuccess("Job created successfully!");
        return newJob;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create job";
        setError(errorMessage);
        showError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError]
  );

  const updateJob = useCallback(
    async (
      id: string,
      jobData: Partial<CreateJobRequest>
    ): Promise<Job | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await jobsApi.updateJob(id, jobData);
        const updatedJob = transformJobData(
          response.data as Job
        ) as unknown as Job;

        // Optimistically update the jobs list
        setJobs((prevJobs) =>
          prevJobs.map((job) => (job.id === id ? updatedJob : job))
        );

        showSuccess("Job updated successfully!");
        return updatedJob;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update job";
        setError(errorMessage);
        showError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError]
  );

  const deleteJob = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await jobsApi.deleteJob(id);

        // Optimistically update the jobs list
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));

        showSuccess("Job deleted successfully!");
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete job";
        setError(errorMessage);
        showError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError]
  );

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

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
  const { showError } = useToast();
  const lastFetchRef = useRef<string>("");

  const fetchJob = useCallback(async () => {
    if (!id) return;

    // Prevent duplicate requests
    if (lastFetchRef.current === id) {
      return;
    }

    lastFetchRef.current = id;
    setLoading(true);
    setError(null);

    try {
      const response = await jobsApi.getJobById(id);
      // Handle the new API response structure
      const responseData = response.data || response;
      const cleanedJob = transformJobData(
        cleanApiResponse(responseData as Job)
      ) as unknown as Job;
      setJob(cleanedJob);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch job";
      setError(errorMessage);
      showError(errorMessage);
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  return {
    job,
    loading,
    error,
    refetch: fetchJob,
  };
};
