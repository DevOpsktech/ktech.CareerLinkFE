import type { ApiResponse, PaginatedResponse } from "../types/api";
import type {
  CreateJobRequest,
  Job,
  JobApplication,
  JobSearchFilters,
} from "../types/job";
import { apiClient } from "../utils/api";

export const jobsApi = {
  // Get all jobs with filters
  getJobs: async (
    filters: JobSearchFilters = {}
  ): Promise<PaginatedResponse<Job>> => {
    const params = new URLSearchParams();
    if (filters.query) params.set("query", String(filters.query));
    if (filters.location) params.set("location", String(filters.location));
    if (filters.jobType) params.set("jobType", String(filters.jobType));
    if (filters.company) params.set("company", String(filters.company));
    if (filters.experienceLevel)
      params.set("experienceLevel", String(filters.experienceLevel));
    if (filters.isRemote !== undefined)
      params.set("isRemote", String(filters.isRemote));
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));

    const response = await apiClient.get<PaginatedResponse<Job>>(
      `/jobs?${params.toString()}`
    );
    return response as unknown as PaginatedResponse<Job>;
  },

  // Get job by ID
  getJobById: async (id: string): Promise<ApiResponse<Job>> => {
    return apiClient.get<Job>(`/jobs/${id}`);
  },

  // Create new job
  createJob: async (jobData: CreateJobRequest): Promise<ApiResponse<Job>> => {
    return apiClient.post<Job>(`/jobs`, jobData);
  },

  // Update job
  updateJob: async (
    id: string,
    jobData: Partial<CreateJobRequest>
  ): Promise<ApiResponse<Job>> => {
    return apiClient.put<Job>(`/jobs/${id}`, jobData);
  },

  // Delete job
  deleteJob: async (id: string): Promise<ApiResponse<boolean>> => {
    return apiClient.delete<boolean>(`/jobs/${id}`);
  },

  // Get jobs by employer
  getJobsByEmployer: async (
    employerId: string
  ): Promise<ApiResponse<Job[]>> => {
    return apiClient.get<Job[]>(
      `/jobs?employerId=${encodeURIComponent(employerId)}`
    );
  },

  // ----------------------
  // Job Applications
  // ----------------------

  // Apply to job (create application)
  applyToJob: async (
    jobId: string,
    studentId: string,
    applicationData: {
      coverLetter?: string;
      resumeUrl?: string;
    }
  ): Promise<ApiResponse<JobApplication>> => {
    return apiClient.post<JobApplication>(`/JobApplications`, {
      jobId,
      studentId,
      ...applicationData,
    });
  },

  // Get all applications (optionally filter by jobId)
  getJobApplications: async (
    jobId?: string
  ): Promise<ApiResponse<JobApplication[]>> => {
    const url = jobId
      ? `/JobApplications?jobId=${encodeURIComponent(jobId)}`
      : `/JobApplications`;
    return apiClient.get<JobApplication[]>(url);
  },

  // Get student applications
  getStudentApplications: async (
    studentId: string
  ): Promise<ApiResponse<JobApplication[]>> => {
    return apiClient.get<JobApplication[]>(
      `/JobApplications?studentId=${encodeURIComponent(studentId)}`
    );
  },

  // Update application status
  updateApplicationStatus: async (
    applicationId: string,
    status: JobApplication["status"],
    notes?: string
  ): Promise<ApiResponse<JobApplication>> => {
    return apiClient.put<JobApplication>(`/JobApplications/${applicationId}`, {
      status,
      notes,
    });
  },

  // Delete application
  deleteApplication: async (
    applicationId: string
  ): Promise<ApiResponse<boolean>> => {
    return apiClient.delete<boolean>(`/JobApplications/${applicationId}`);
  },
};
