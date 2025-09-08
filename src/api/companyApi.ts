/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type { Company } from "../types/employer";
import { apiClient } from "../utils/api";
import { mockCompanies } from "../constants/mockData";

export interface CreateCompanyRequest {
  name: string;
  industry: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  companySize?: "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+";
  foundedYear?: number;
}

export interface CompanySearchFilters {
  query?: string;
  industry?: string;
  companySize?: string;
  isVerified?: boolean;
  page?: number;
  limit?: number;
}

// Helper functions
const buildParams = (filters: CompanySearchFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, String(value));
  });
  return params.toString();
};

const createPagination = (data: any[]) => ({
  page: 1,
  limit: data.length,
  total: data.length,
  totalPages: 1,
});

const mockResponse = (data = mockCompanies, message = "Mock data") => ({
  data,
  success: true,
  message,
  pagination: createPagination(data),
});

const normalizeResponse = (res: any): PaginatedResponse<Company> => {
  if (res?.$values) return { ...mockResponse(res.$values), message: "Success" };
  if (res?.data?.$values)
    return { ...mockResponse(res.data.$values), message: "Success" };
  if (res?.data) return res;
  if (Array.isArray(res)) return { ...mockResponse(res), message: "Success" };
  return mockResponse(mockCompanies, "Fallback");
};

const validate = (value: any, name: string) => {
  if (!value?.trim?.()) throw new Error(`${name} is required`);
};

export const companyApi = {
  // Get companies with filters
  getCompanies: async (
    filters: CompanySearchFilters = {}
  ): Promise<PaginatedResponse<Company>> => {
    try {
      const params = buildParams(filters);
      const url = params ? `/companies?${params}` : "/companies";
      return normalizeResponse(await apiClient.get(url));
    } catch (error) {
      console.warn("API failed, using mock:", error);
      return mockResponse();
    }
  },

  // Get company by ID
  getCompanyById: async (id: string): Promise<ApiResponse<Company>> => {
    validate(id, "Company ID");
    return apiClient.get(`/companies/${encodeURIComponent(id)}`);
  },

  // Create company
  createCompany: async (
    data: CreateCompanyRequest
  ): Promise<ApiResponse<Company>> => {
    validate(data.name, "Company name");
    validate(data.industry, "Company industry");

    try {
      return await apiClient.post("/companies", data);
    } catch (error) {
      console.warn("Create failed, using mock:", error);
      return {
        data: {
          id: `mock-${Date.now()}`,
          ...data,
          logoUrl: data.logoUrl || "https://cdn.finedgecapital.com/logo.png",
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        success: true,
        message: "Created (mock)",
      };
    }
  },

  // Update company
  updateCompany: async (
    id: string,
    data: Partial<CreateCompanyRequest>
  ): Promise<ApiResponse<Company>> => {
    validate(id, "Company ID");
    return apiClient.put(`/companies/${encodeURIComponent(id)}`, data);
  },

  // Delete company
  deleteCompany: async (id: string): Promise<ApiResponse<boolean>> => {
    validate(id, "Company ID");
    return apiClient.delete(`/companies/${encodeURIComponent(id)}`);
  },

  // Toggle verification
  toggleCompanyVerification: async (
    id: string
  ): Promise<ApiResponse<Company>> => {
    validate(id, "Company ID");
    return apiClient.post(
      `/companies/${encodeURIComponent(id)}/toggle-verification`,
      {}
    );
  },
};
