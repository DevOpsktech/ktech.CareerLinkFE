/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { employersApi } from "../api/employerApi";
import type { JobApplication } from "../types/job";
import { useToast } from "../contexts/ToastContext";
import { cleanApiResponse } from "../utils/api";

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
      const rawData =
        (response as unknown as { data?: unknown }).data ?? response;

      // Clean .NET style payloads ($id/$values) into plain JS objects/arrays
      const cleaned = cleanApiResponse<unknown>(rawData);

      // If backend returns the new grouped shape: Array<{ jobId, jobTitle, applicants: [...] }>
      const isGrouped =
        Array.isArray(cleaned) &&
        cleaned.length > 0 &&
        typeof cleaned[0] === "object" &&
        cleaned[0] !== null &&
        "applicants" in (cleaned[0] as Record<string, unknown>);

      if (isGrouped) {
        type RawApplicant = {
          applicationId?: string;
          id?: string;
          jobId?: string;
          studentId?: string;
          studentName?: string;
          studentEmail?: string;
          coverLetter?: string;
          status?: string;
          appliedDate?: string;
          appliedAt?: string;
          reviewedDate?: string | null;
        };

        type RawGroup = {
          jobId?: string;
          jobTitle?: string;
          companyName?: string;
          postedDate?: string;
          applicationCount?: number;
          applicants?: RawApplicant[];
        };

        const groups = cleaned as RawGroup[];

        const flattened: JobApplication[] = groups.flatMap((group) => {
          const applicants = Array.isArray(group.applicants)
            ? group.applicants
            : [];

          return applicants.map((app) => {
            const fullName = (app.studentName || "").trim();
            const [firstName, ...rest] = fullName.split(" ");
            const lastName = rest.join(" ").trim();

            // Normalize status: map unknown/new statuses to closest existing
            const rawStatus = (app.status || "").toLowerCase();
            const normalizedStatus: JobApplication["status"] =
              rawStatus === "submitted"
                ? "pending"
                : (rawStatus as JobApplication["status"]) || "pending";

            const appliedAt =
              app.appliedDate || app.appliedAt || new Date().toISOString();
            const reviewedAt = app.reviewedDate ?? undefined;

            const mapped: JobApplication = {
              id: app.applicationId || app.id || "",
              jobId: group.jobId || app.jobId || "",
              studentId: app.studentId || "",
              jobTitle: group.jobTitle || "",
              coverLetter: app.coverLetter,
              status: normalizedStatus,
              appliedAt,
              updatedAt: reviewedAt || appliedAt,
              reviewedAt,
              // Provide a lightweight student object to satisfy UI expectations
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              student: {
                firstName: firstName || undefined,
                lastName: lastName || undefined,
                email: app.studentEmail || undefined,
              } as any,
            };

            return mapped;
          });
        });

        setApplications(flattened);
      } else if (Array.isArray(cleaned)) {
        // Already a flat array
        setApplications(cleaned as JobApplication[]);
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
      status: JobApplication["status"]
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
