import type { ApiResponse } from "../types/api";

export const API_BASE_URL = "http://localhost:5000/api";
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

// Get JWT token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("careerlink_token");
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

      // Get auth token
      const token = getAuthToken();

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add custom headers if provided
      if (options.headers) {
        Object.assign(headers, options.headers);
      }

      // Add Authorization header if token exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        headers,
        credentials: "include",
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const responseData = await response.json();

      // Check if the response already has the ApiResponse structure
      if (
        responseData &&
        typeof responseData === "object" &&
        "data" in responseData
      ) {
        return responseData as ApiResponse<T>;
      }

      // If not, wrap it in the ApiResponse structure
      return {
        data: responseData as T,
        success: true,
        message: "Success",
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Network error");
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
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
export function cleanApiResponse<T>(data: unknown): T {
  console.log("cleanApiResponse called with:", data);

  if (data === null || data === undefined) {
    return data as T;
  }

  if (Array.isArray(data)) {
    console.log("cleanApiResponse: Processing array");
    return data.map((item) => cleanApiResponse(item)) as T;
  }

  if (typeof data === "object") {
    console.log(
      "cleanApiResponse: Processing object with keys:",
      Object.keys(data as Record<string, unknown>)
    );
    const cleaned: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(
      data as Record<string, unknown>
    )) {
      // Skip $id properties
      if (key === "$id" || key === "$ref") {
        console.log("cleanApiResponse: Skipping", key);
        continue;
      }

      // Handle $values arrays
      if (key === "$values" && Array.isArray(value)) {
        console.log("cleanApiResponse: Found $values array, returning early");
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
export function transformJobData(job: unknown) {
  const cleaned = cleanApiResponse(job) as Record<string, unknown>;

  return {
    ...cleaned,
    // Extract arrays from $values objects
    requirements:
      (cleaned.requirements as Record<string, unknown>)?.$values ||
      cleaned.requirements ||
      [],
    responsibilities:
      (cleaned.responsibilities as Record<string, unknown>)?.$values ||
      cleaned.responsibilities ||
      [],
    skills:
      (cleaned.skills as Record<string, unknown>)?.$values ||
      cleaned.skills ||
      [],
    // Handle salary format
    salary: {
      min: cleaned.salaryMin,
      max: cleaned.salaryMax,
      currency: cleaned.salaryCurrency,
      period: cleaned.salaryPeriod,
    },
    // Ensure company name is accessible
    company:
      (cleaned.company as Record<string, unknown>)?.name ||
      cleaned.company ||
      "Company",
  };
}
