import type { ApiResponse, SearchResponse } from "../types/api";
import type {
  Job,
  CreateJobRequest,
  JobSearchFilters,
  JobApplication,
  ApplyToJobRequest,
} from "../types/job";
import { apiClient } from "../utils/api";

export const jobsApi = {
  // Get all jobs without search parameters (for initial load)
  getAllJobs: async (pageSize: number = 10): Promise<SearchResponse<Job>> => {
    const params = new URLSearchParams();
    params.set("pageSize", String(pageSize));
    params.set("page", "1");

    const response = await apiClient.get<SearchResponse<Job>>(
      `/Jobs?${params.toString()}`
    );
    return response as unknown as SearchResponse<Job>;
  },

  // Get all jobs with filters using the new search endpoint
  getJobs: async (
    filters: JobSearchFilters = {}
  ): Promise<SearchResponse<Job>> => {
    const params = new URLSearchParams();

    // New search parameters
    if (filters.q) params.set("q", String(filters.q));
    if (filters.location) params.set("location", String(filters.location));
    if (filters.isRemote !== undefined)
      params.set("isRemote", String(filters.isRemote));
    if (filters.type) params.set("type", String(filters.type));
    if (filters.experienceLevel)
      params.set("experienceLevel", String(filters.experienceLevel));
    if (filters.salaryMin) params.set("salaryMin", String(filters.salaryMin));
    if (filters.salaryMax) params.set("salaryMax", String(filters.salaryMax));
    if (filters.companyId) params.set("companyId", String(filters.companyId));
    if (filters.status) params.set("status", String(filters.status));
    if (filters.skills && filters.skills.length > 0)
      params.set("skills", filters.skills.join(","));
    if (filters.sortBy) params.set("sortBy", String(filters.sortBy));
    if (filters.sortOrder) params.set("sortOrder", String(filters.sortOrder));
    if (filters.page) params.set("page", String(filters.page));
    if (filters.pageSize) params.set("pageSize", String(filters.pageSize));

    // Legacy parameters for backward compatibility
    if (filters.query && !filters.q) params.set("q", String(filters.query));
    if (filters.jobType && !filters.type)
      params.set("type", String(filters.jobType));
    if (filters.company && !filters.companyId)
      params.set("companyId", String(filters.company));
    if (filters.limit && !filters.pageSize)
      params.set("pageSize", String(filters.limit));

    const response = await apiClient.get<SearchResponse<Job>>(
      `/Jobs/search?${params.toString()}`
    );
    return response as unknown as SearchResponse<Job>;
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
    applicationData: ApplyToJobRequest
  ): Promise<ApiResponse<JobApplication>> => {
    return apiClient.post<JobApplication>(
      `/Student/apply-to-job`,
      applicationData
    );
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
      `/JobApplications/student/${encodeURIComponent(studentId)}`
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
