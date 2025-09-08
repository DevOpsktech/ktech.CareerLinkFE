import type { ApiResponse, PaginatedResponse } from "../types/api";
import type {
  CreateEmployerRequest,
  Employer,
  EmployerSearchFilters,
} from "../types/employer";
import type { JobApplication } from "../types/job";
import { apiClient } from "../utils/api";

export const employersApi = {
  // Get all employers with filters
  getEmployers: async (
    filters: EmployerSearchFilters = {}
  ): Promise<PaginatedResponse<Employer>> => {
    const params = new URLSearchParams();
    if (filters.query) params.set("query", String(filters.query));
    if (filters.industry) params.set("industry", String(filters.industry));
    if (filters.companySize)
      params.set("companySize", String(filters.companySize));
    if (filters.isVerified !== undefined)
      params.set("isVerified", String(filters.isVerified));
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));

    const response = await apiClient.get<PaginatedResponse<Employer>>(
      `/employer/all?${params.toString()}`
    );
    return response as unknown as PaginatedResponse<Employer>;
  },

  // Get employer by ID
  getEmployerById: async (id: string): Promise<ApiResponse<Employer>> => {
    return apiClient.get<Employer>(`/employer/${id}`);
  },

  // Get employer by user ID
  getEmployerByUserId: async (
    userId: string
  ): Promise<ApiResponse<Employer>> => {
    return apiClient.get<Employer>(`/employer/by-user/${userId}`);
  },

  // Create new employer
  createEmployer: async (
    employerData: CreateEmployerRequest
  ): Promise<ApiResponse<Employer>> => {
    return apiClient.post<Employer>(`/employers`, employerData);
  },

  // Update employer
  updateEmployer: async (
    id: string,
    employerData: Partial<CreateEmployerRequest>
  ): Promise<ApiResponse<Employer>> => {
    return apiClient.put<Employer>(`/Admin/employers/${id}`, employerData);
  },

  // Delete employer
  deleteEmployer: async (id: string): Promise<ApiResponse<boolean>> => {
    return apiClient.delete<boolean>(`/Admin/employers/${id}`);
  },

  // Toggle employer status
  toggleEmployerStatus: async (id: string): Promise<ApiResponse<Employer>> => {
    return apiClient.post<Employer>(`/employers/${id}/toggle-status`, {});
  },

  // ----------------------
  // Job Applicants
  // ----------------------

  // Get all applicants for employer's jobs
  getJobApplicants: async (): Promise<ApiResponse<JobApplication[]>> => {
    return apiClient.get<JobApplication[]>(`/Employer/job-applicants`);
  },

  // Get applicants for specific job
  getJobApplicantsByJobId: async (
    jobId: string
  ): Promise<ApiResponse<JobApplication[]>> => {
    return apiClient.get<JobApplication[]>(`/Employer/job/${jobId}/applicants`);
  },

  // ----------------------
  // CV Views
  // ----------------------

  // Record CV view for a student
  recordCvView: async (studentId: string): Promise<ApiResponse<boolean>> => {
    return apiClient.post<boolean>(
      `/Employer/students/${studentId}/view-cv`,
      {}
    );
  },
};
