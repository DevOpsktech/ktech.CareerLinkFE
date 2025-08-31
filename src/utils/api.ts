import type { ApiResponse } from "../types/api";

const API_BASE_URL = "http://localhost:5000/api";
const MOCK_DELAY = 800; // Simulate network delay

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API response wrapper
export const mockApiCall = async <T>(
  data: T,
  shouldFail = false,
  errorMessage = "Something went wrong"
): Promise<ApiResponse<T>> => {
  await delay(MOCK_DELAY);

  if (shouldFail) {
    throw new Error(errorMessage);
  }

  return {
    data,
    success: true,
    message: "Success",
  };
};

// HTTP client wrapper
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        credentials: "include",
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Network error");
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

/**
 * Cleans API response by removing $id properties and circular references
 * This is needed for .NET JSON serialization responses
 */
export function cleanApiResponse<T>(data: any): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => cleanApiResponse(item)) as T;
  }

  if (typeof data === "object") {
    const cleaned: any = {};

    for (const [key, value] of Object.entries(data)) {
      // Skip $id properties
      if (key === "$id" || key === "$ref") {
        continue;
      }

      // Handle $values arrays
      if (key === "$values" && Array.isArray(value)) {
        return cleanApiResponse(value) as T;
      }

      // Recursively clean nested objects
      cleaned[key] = cleanApiResponse(value);
    }

    return cleaned as T;
  }

  return data as T;
}

/**
 * Transforms job data to match the expected format for components
 */
export function transformJobData(job: any) {
  const cleaned = cleanApiResponse(job) as any;

  return {
    ...cleaned,
    // Extract arrays from $values objects
    requirements: cleaned.requirements?.$values || cleaned.requirements || [],
    responsibilities:
      cleaned.responsibilities?.$values || cleaned.responsibilities || [],
    skills: cleaned.skills?.$values || cleaned.skills || [],
    // Handle salary format
    salary: {
      min: cleaned.salaryMin,
      max: cleaned.salaryMax,
      currency: cleaned.salaryCurrency,
      period: cleaned.salaryPeriod,
    },
    // Ensure company name is accessible
    company: cleaned.company?.name || cleaned.company || "Company",
  };
}
