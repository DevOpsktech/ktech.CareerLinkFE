import { useState, useEffect, useCallback } from "react";
import { employersApi } from "../api/employerApi";
import type { JobApplication } from "../types/job";
import { useToast } from "../contexts/ToastContext";

export const useEmployerJobApplicants = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useToast();

  const fetchJobApplicants = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await employersApi.getJobApplicants();
      const responseData = response.data || response;

      // Check if response is an array or has $values property
      if (Array.isArray(responseData)) {
        setApplications(responseData);
      } else if (
        responseData &&
        typeof responseData === "object" &&
        "$values" in responseData
      ) {
        setApplications(
          (responseData as { $values: JobApplication[] }).$values
        );
      } else {
        setApplications([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch job applicants";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const updateApplicationStatus = useCallback(
    async (
      applicationId: string,
      status: JobApplication["status"],
      notes?: string
    ): Promise<JobApplication | null> => {
      try {
        // TODO: Implement status update API call when available
        // For now, just update locally
        setApplications((prevApplications) =>
          prevApplications.map((app) =>
            app.id === applicationId ? { ...app, status } : app
          )
        );
        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update application status";
        showError(errorMessage);
        return null;
      }
    },
    [showError]
  );

  useEffect(() => {
    fetchJobApplicants();
  }, [fetchJobApplicants]);

  return {
    applications,
    loading,
    error,
    updateApplicationStatus,
    refetch: fetchJobApplicants,
  };
};
