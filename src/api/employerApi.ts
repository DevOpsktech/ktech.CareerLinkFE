import { mockCompanies, mockEmployers } from "../constants/mockData";
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type {
  CreateEmployerRequest,
  Employer,
  EmployerSearchFilters,
} from "../types/employer";
import { mockApiCall } from "../utils/api";

// Mock employer storage
const employers = [...mockEmployers];

export const employersApi = {
  // Get all employers with filters
  getEmployers: async (
    filters: EmployerSearchFilters = {}
  ): Promise<PaginatedResponse<Employer>> => {
    let filteredEmployers = [...employers];

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredEmployers = filteredEmployers.filter(
        (employer) =>
          employer.name.toLowerCase().includes(query) ||
          employer.email.toLowerCase().includes(query) ||
          employer.company.name.toLowerCase().includes(query)
      );
    }

    if (filters.industry) {
      filteredEmployers = filteredEmployers.filter((employer) =>
        employer.company.industry
          .toLowerCase()
          .includes(filters.industry!.toLowerCase())
      );
    }

    if (filters.companySize) {
      filteredEmployers = filteredEmployers.filter(
        (employer) => employer.company.companySize === filters.companySize
      );
    }

    if (filters.isVerified !== undefined) {
      filteredEmployers = filteredEmployers.filter(
        (employer) => employer.company.isVerified === filters.isVerified
      );
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEmployers = filteredEmployers.slice(startIndex, endIndex);

    const response = await mockApiCall(paginatedEmployers);

    return {
      ...response,
      pagination: {
        page,
        limit,
        total: filteredEmployers.length,
        totalPages: Math.ceil(filteredEmployers.length / limit),
      },
    };
  },

  // Get employer by ID
  getEmployerById: async (id: string): Promise<ApiResponse<Employer>> => {
    const employer = employers.find((e) => e.id === id);
    if (!employer) {
      throw new Error("Employer not found");
    }
    return mockApiCall(employer);
  },

  // Get employer by user ID
  getEmployerByUserId: async (
    userId: string
  ): Promise<ApiResponse<Employer>> => {
    const employer = employers.find((e) => e.userId === userId);
    if (!employer) {
      throw new Error("Employer not found");
    }
    return mockApiCall(employer);
  },

  // Create new employer
  createEmployer: async (
    employerData: CreateEmployerRequest
  ): Promise<ApiResponse<Employer>> => {
    // Check if company exists or create new one
    let company = mockCompanies.find(
      (c) => c.name.toLowerCase() === employerData.company.toLowerCase()
    );

    if (!company) {
      company = {
        id: `comp-${Date.now()}`,
        name: employerData.company,
        industry: employerData.industry,
        description: employerData.description,
        website: employerData.website,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockCompanies.push(company);
    }

    const newEmployer: Employer = {
      id: `emp-${Date.now()}`,
      userId: `user-emp-${Date.now()}`,
      companyId: company.id,
      name: employerData.name || "HR Representative",
      email: employerData.email,
      position: employerData.position,
      phone: employerData.phone,
      company,
      createdBy: "admin-1", // This would come from the authenticated admin
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    employers.push(newEmployer);
    return mockApiCall(newEmployer);
  },

  // Update employer
  updateEmployer: async (
    id: string,
    employerData: Partial<CreateEmployerRequest>
  ): Promise<ApiResponse<Employer>> => {
    const employerIndex = employers.findIndex((e) => e.id === id);
    if (employerIndex === -1) {
      throw new Error("Employer not found");
    }

    employers[employerIndex] = {
      ...employers[employerIndex],
      name: employerData.name || employers[employerIndex].name,
      position: employerData.position || employers[employerIndex].position,
      phone: employerData.phone || employers[employerIndex].phone,
      updatedAt: new Date().toISOString(),
    };

    // Update company info if provided
    if (
      employerData.company ||
      employerData.industry ||
      employerData.website ||
      employerData.description
    ) {
      const companyIndex = mockCompanies.findIndex(
        (c) => c.id === employers[employerIndex].companyId
      );
      if (companyIndex !== -1) {
        mockCompanies[companyIndex] = {
          ...mockCompanies[companyIndex],
          name: employerData.company || mockCompanies[companyIndex].name,
          industry:
            employerData.industry || mockCompanies[companyIndex].industry,
          website: employerData.website || mockCompanies[companyIndex].website,
          description:
            employerData.description || mockCompanies[companyIndex].description,
          updatedAt: new Date().toISOString(),
        };
        employers[employerIndex].company = mockCompanies[companyIndex];
      }
    }

    return mockApiCall(employers[employerIndex]);
  },

  // Delete employer
  deleteEmployer: async (id: string): Promise<ApiResponse<boolean>> => {
    const employerIndex = employers.findIndex((e) => e.id === id);
    if (employerIndex === -1) {
      throw new Error("Employer not found");
    }

    employers.splice(employerIndex, 1);
    return mockApiCall(true);
  },

  // Toggle employer status
  toggleEmployerStatus: async (id: string): Promise<ApiResponse<Employer>> => {
    const employerIndex = employers.findIndex((e) => e.id === id);
    if (employerIndex === -1) {
      throw new Error("Employer not found");
    }

    // This would typically update the user's isActive status
    employers[employerIndex].updatedAt = new Date().toISOString();

    return mockApiCall(employers[employerIndex]);
  },
};
