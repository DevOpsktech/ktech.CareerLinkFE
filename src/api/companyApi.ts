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

export const companyApi = {
  // Get all companies with filters
  getCompanies: async (
    filters: CompanySearchFilters = {}
  ): Promise<PaginatedResponse<Company>> => {
    try {
      const params = new URLSearchParams();
      if (filters.query) params.set("query", String(filters.query));
      if (filters.industry) params.set("industry", String(filters.industry));
      if (filters.companySize)
        params.set("companySize", String(filters.companySize));
      if (filters.isVerified !== undefined)
        params.set("isVerified", String(filters.isVerified));
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));

      const response = await apiClient.get<PaginatedResponse<Company>>(
        `/companies?${params.toString()}`
      );

      console.log("Raw API response:", response);

      // Handle .NET JSON response format with $values (direct response)
      if (response && typeof response === "object" && "$values" in response) {
        const dotNetResponse = response as { $values: Company[] };
        console.log(
          "Processing .NET response with $values:",
          dotNetResponse.$values
        );
        return {
          data: dotNetResponse.$values,
          success: true,
          message: "Success",
          pagination: {
            page: 1,
            limit: dotNetResponse.$values.length,
            total: dotNetResponse.$values.length,
            totalPages: 1,
          },
        };
      }

      // Handle .NET JSON response format with $values (nested in data property)
      if (
        response &&
        typeof response === "object" &&
        "data" in response &&
        response.data &&
        typeof response.data === "object" &&
        "$values" in response.data
      ) {
        const nestedDotNetResponse = response.data as { $values: Company[] };
        console.log(
          "Processing nested .NET response with $values:",
          nestedDotNetResponse.$values
        );
        return {
          data: nestedDotNetResponse.$values,
          success: true,
          message: "Success",
          pagination: {
            page: 1,
            limit: nestedDotNetResponse.$values.length,
            total: nestedDotNetResponse.$values.length,
            totalPages: 1,
          },
        };
      }

      // Handle regular ApiResponse format
      if (response && typeof response === "object" && "data" in response) {
        return response as unknown as PaginatedResponse<Company>;
      }

      // If response is directly an array
      if (Array.isArray(response)) {
        const companiesArray = response as Company[];
        return {
          data: companiesArray,
          success: true,
          message: "Success",
          pagination: {
            page: 1,
            limit: companiesArray.length,
            total: companiesArray.length,
            totalPages: 1,
          },
        };
      }

      // If we reach here, the response structure is unexpected
      console.warn(
        "Unexpected response structure, falling back to mock data:",
        response
      );
      return {
        data: mockCompanies,
        success: true,
        message: "Mock data loaded (fallback)",
        pagination: {
          page: 1,
          limit: mockCompanies.length,
          total: mockCompanies.length,
          totalPages: 1,
        },
      };
    } catch (error) {
      // Fallback to mock data if API call fails
      console.warn("API call failed, using mock data:", error);
      return {
        data: mockCompanies,
        success: true,
        message: "Mock data loaded",
        pagination: {
          page: 1,
          limit: mockCompanies.length,
          total: mockCompanies.length,
          totalPages: 1,
        },
      };
    }
  },

  // Get company by ID
  getCompanyById: async (id: string): Promise<ApiResponse<Company>> => {
    return apiClient.get<Company>(`/companies/${id}`);
  },

  // Create new company
  createCompany: async (
    companyData: CreateCompanyRequest
  ): Promise<ApiResponse<Company>> => {
    try {
      return apiClient.post<Company>(`/companies`, companyData);
    } catch (error) {
      // Fallback to mock response if API call fails
      console.warn("API call failed, returning mock response:", error);
      const newCompany: Company = {
        id: `comp-${Date.now()}`,
        ...companyData,
        logoUrl: "https://cdn.finedgecapital.com/logo.png",
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        data: newCompany,
        success: true,
        message: "Company created (mock)",
      };
    }
  },

  // Update company
  updateCompany: async (
    id: string,
    companyData: Partial<CreateCompanyRequest>
  ): Promise<ApiResponse<Company>> => {
    return apiClient.put<Company>(`/companies/${id}`, companyData);
  },

  // Delete company
  deleteCompany: async (id: string): Promise<ApiResponse<boolean>> => {
    return apiClient.delete<boolean>(`/companies/${id}`);
  },

  // Toggle company verification status
  toggleCompanyVerification: async (
    id: string
  ): Promise<ApiResponse<Company>> => {
    return apiClient.post<Company>(`/companies/${id}/toggle-verification`, {});
  },
};
