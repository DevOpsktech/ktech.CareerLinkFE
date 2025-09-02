import { useState, useEffect, useCallback, useRef } from "react";
import { jobsApi } from "../api/jobsApi";
import type { JobApplication, ApplyToJobRequest } from "../types/job";
import { useToast } from "../contexts/ToastContext";

export const useApplications = (studentId?: string, jobId?: string) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();
  const lastFetchRef = useRef<string>("");

  const fetchApplications = useCallback(async () => {
    if (!studentId && !jobId) return;

    const fetchKey = studentId || jobId || "";

    // Prevent duplicate requests
    if (lastFetchRef.current === fetchKey) {
      return;
    }

    lastFetchRef.current = fetchKey;
    setLoading(true);
    setError(null);

    try {
      const response = studentId
        ? await jobsApi.getStudentApplications(studentId)
        : await jobsApi.getJobsByEmployer(jobId!);

      // Handle the new API response structure
      const responseData = response.data || response;

      // Check if response is an array or has $values property
      if (Array.isArray(responseData)) {
        setApplications(responseData.map((item) => item as JobApplication));
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
        err instanceof Error ? err.message : "Failed to fetch applications";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [studentId, jobId, showError]);

  const applyToJob = useCallback(
    async (
      applicationData: ApplyToJobRequest
    ): Promise<JobApplication | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await jobsApi.applyToJob(applicationData);
        const responseData = response.data || response;
        const newApplication = responseData as JobApplication;

        // Optimistically update the applications list
        setApplications((prevApplications) => [
          newApplication,
          ...prevApplications,
        ]);

        showSuccess("Application submitted successfully!");
        return newApplication;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to apply to job";
        setError(errorMessage);
        showError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError]
  );

  const updateApplicationStatus = useCallback(
    async (
      applicationId: string,
      status: JobApplication["status"],
      notes?: string
    ): Promise<JobApplication | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await jobsApi.updateApplicationStatus(
          applicationId,
          status,
          notes
        );
        const responseData = response.data || response;
        const updatedApplication = responseData as JobApplication;

        // Optimistically update the applications list
        setApplications((prevApplications) =>
          prevApplications.map((app) =>
            app.id === applicationId ? updatedApplication : app
          )
        );

        showSuccess("Application status updated successfully!");
        return updatedApplication;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update application status";
        setError(errorMessage);
        showError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError]
  );

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    applyToJob,
    updateApplicationStatus,
    refetch: fetchApplications,
  };
};
