import { useState, useEffect, useCallback } from "react";
import { jobsApi } from "../api/jobsApi";
import type { Job } from "../types/job";
import { cleanApiResponse, transformJobData } from "../utils/api";
import { useToast } from "../contexts/ToastContext";

export const useEmployerJobs = (employerId: string | null) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useToast();

  const fetchEmployerJobs = useCallback(async () => {
    if (!employerId) {
      setJobs([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await jobsApi.getJobsByEmployer(employerId);

      // Handle the API response structure
      const responseData = response.data || response;
      const cleanedJobs = cleanApiResponse(responseData as Job[]) as Job[];
      const transformedJobs = cleanedJobs.map(
        (job) => transformJobData(job) as unknown as Job
      );

      setJobs(transformedJobs);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch employer jobs";
      setError(errorMessage);
      showError(errorMessage);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [employerId, showError]);

  useEffect(() => {
    fetchEmployerJobs();
  }, [fetchEmployerJobs]);

  const refetch = useCallback(() => {
    fetchEmployerJobs();
  }, [fetchEmployerJobs]);

  return {
    jobs,
    loading,
    error,
    refetch,
  };
};
