import type { ApiResponse, PaginatedResponse } from "../types/api";
import type {
  Student,
  StudentSearchFilters,
  UpdateStudentProfileRequest,
} from "../types/student";
import type { JobApplication, ApplyToJobRequest } from "../types/job";
import { apiClient } from "../utils/api";

export const studentsApi = {
  // Get all students with filters
  getStudents: async (
    filters: StudentSearchFilters = {}
  ): Promise<PaginatedResponse<Student>> => {
    const params = new URLSearchParams();
    if (filters.query) params.set("query", String(filters.query));
    if (filters.major) params.set("major", String(filters.major));
    if (filters.graduationYear)
      params.set("graduationYear", String(filters.graduationYear));
    if (filters.gpa) params.set("gpa", String(filters.gpa));
    if (filters.skills && filters.skills.length > 0)
      params.set("skills", filters.skills.join(","));
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));

    const response = await apiClient.get<PaginatedResponse<Student>>(
      `/Student/search?${params.toString()}`
    );
    return response as unknown as PaginatedResponse<Student>;
  },

  // Get student by ID
  getStudentById: async (id: string): Promise<ApiResponse<Student>> => {
    return apiClient.get<Student>(`/Student/${id}`);
  },

  // Get current student's profile (by token)
  getStudentProfile: async (): Promise<ApiResponse<Student>> => {
    return apiClient.get<Student>(`/Student/profile`);
  },

  // Get student by user ID
  getStudentByUserId: async (userId: string): Promise<ApiResponse<Student>> => {
    return apiClient.get<Student>(`/Student/${userId}`);
  },

  // Update student profile
  updateStudentProfile: async (
    profileData: UpdateStudentProfileRequest
  ): Promise<ApiResponse<Student>> => {
    return apiClient.put<Student>(`/Student/profile`, profileData);
  },

  // Add student skill
  addStudentSkill: async (
    studentId: string,
    skillData: {
      skillId: string;
      skillName: string;
      category: string;
      proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
    }
  ): Promise<ApiResponse<Student>> => {
    return apiClient.post<Student>(`/students/${studentId}/skills`, skillData);
  },

  // Remove student skill
  removeStudentSkill: async (
    studentId: string,
    skillId: string
  ): Promise<ApiResponse<Student>> => {
    return apiClient.delete<Student>(
      `/students/${studentId}/skills/${encodeURIComponent(skillId)}`
    );
  },

  // Add student experience
  addStudentExperience: async (
    studentId: string,
    experienceData: Omit<Student["experiences"][0], "id">
  ): Promise<ApiResponse<Student>> => {
    return apiClient.post<Student>(
      `/students/${studentId}/experiences`,
      experienceData
    );
  },

  // Update student experience
  updateStudentExperience: async (
    studentId: string,
    experienceId: string,
    experienceData: Partial<Omit<Student["experiences"][0], "id">>
  ): Promise<ApiResponse<Student>> => {
    return apiClient.put<Student>(
      `/students/${studentId}/experiences/${encodeURIComponent(experienceId)}`,
      experienceData
    );
  },

  // Remove student experience
  removeStudentExperience: async (
    studentId: string,
    experienceId: string
  ): Promise<ApiResponse<Student>> => {
    return apiClient.delete<Student>(
      `/students/${studentId}/experiences/${encodeURIComponent(experienceId)}`
    );
  },

  // Apply to job using the new Student API endpoint
  applyToJob: async (
    applicationData: ApplyToJobRequest
  ): Promise<ApiResponse<JobApplication>> => {
    return apiClient.post<JobApplication>(
      `/Student/apply-to-job`,
      applicationData
    );
  },
};
