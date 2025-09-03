import { useState, useEffect, useCallback, useRef } from "react";
import { jobsApi } from "../api/jobsApi";
import type { CreateJobRequest, Job, JobSearchFilters } from "../types/job";
import { cleanApiResponse, transformJobData } from "../utils/api";
import { parseJobsResponse } from "../utils/responseParser";
import { useToast } from "../contexts/ToastContext";

export const useJobs = () => {
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

  const fetchAllJobs = useCallback(
    async (pageSize: number = 10) => {
      const filterKey = `all-jobs-${pageSize}`;

      // Prevent duplicate requests
      if (lastFetchRef.current === filterKey && isInitializedRef.current) {
        return;
      }

      setLoading(true);
      setError(null);
      lastFetchRef.current = filterKey;

      try {
        const response = await jobsApi.getAllJobs(pageSize);

        // Parse the response using the utility function
        const parsedResponse = parseJobsResponse(response, pageSize);

        setJobs(parsedResponse.jobs);
        setPagination(parsedResponse.pagination);

        isInitializedRef.current = true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch jobs";
        setError(errorMessage);
        // Call showError directly instead of depending on it
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [] // No dependencies - function will be stable
  );

  const fetchJobs = useCallback(
    async (searchFilters: JobSearchFilters = {}) => {
      const filterKey = JSON.stringify(searchFilters);

      // Prevent duplicate requests
      if (lastFetchRef.current === filterKey && isInitializedRef.current) {
        return;
      }

      setLoading(true);
      setError(null);
      lastFetchRef.current = filterKey;

      try {
        const response = await jobsApi.getJobs(searchFilters);

        // Parse the response using the utility function
        const parsedResponse = parseJobsResponse(
          response,
          searchFilters.pageSize || 10
        );

        setJobs(parsedResponse.jobs);
        setPagination(parsedResponse.pagination);

        isInitializedRef.current = true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch jobs";
        setError(errorMessage);
        // Call showError directly instead of depending on it
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [] // No dependencies - function will be stable
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
    // Only fetch jobs on initial mount with default filters
    if (!isInitializedRef.current) {
      fetchAllJobs(10);
    }
  }, []); // Empty dependency array - only run once on mount

  return {
    jobs,
    loading,
    error,
    pagination,
    fetchJobs,
    fetchAllJobs,
    createJob,
    updateJob,
    deleteJob,
    refetch: () => fetchAllJobs(10),
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
      // Call showError directly instead of depending on it
      showError(errorMessage);
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, [id]); // Only depend on id

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]); // Only depend on id, not fetchJob

  return {
    job,
    loading,
    error,
    refetch: fetchJob,
  };
};
