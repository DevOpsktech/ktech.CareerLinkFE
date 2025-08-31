import { useState, useEffect } from "react";
import { jobsApi } from "../api/jobsApi";
import type { JobApplication } from "../types/job";

export const useApplications = (studentId?: string, jobId?: string) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    if (!studentId && !jobId) return;

    setLoading(true);
    setError(null);

    try {
      const response = studentId
        ? await jobsApi.getStudentApplications(studentId)
        : await jobsApi.getJobApplications(jobId!);

      // Handle the new API response structure
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
      setError(
        err instanceof Error ? err.message : "Failed to fetch applications"
      );
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (
    jobId: string,
    studentId: string,
    applicationData: {
      coverLetter?: string;
      resumeUrl?: string;
    }
  ): Promise<JobApplication | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await jobsApi.applyToJob(
        jobId,
        studentId,
        applicationData
      );
      await fetchApplications(); // Refresh the list
      const responseData = response.data || response;
      return responseData as JobApplication;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply to job");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (
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
      await fetchApplications(); // Refresh the list
      const responseData = response.data || response;
      return responseData as JobApplication;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update application status"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, jobId]);

  return {
    applications,
    loading,
    error,
    applyToJob,
    updateApplicationStatus,
    refetch: fetchApplications,
  };
};
