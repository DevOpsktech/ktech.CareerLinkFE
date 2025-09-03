import type { Job } from "../types/job";
import { cleanApiResponse } from "./api";

export interface ParsedJobsResponse {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function parseJobsResponse(
  response: any,
  defaultPageSize: number = 10
): ParsedJobsResponse {
  let jobs: Job[] = [];
  let pagination = {
    page: 1,
    limit: defaultPageSize,
    total: 0,
    totalPages: 0,
  };

  if (!response || typeof response !== "object") {
    return { jobs, pagination };
  }

  // Handle ApiResponse wrapper from apiClient
  let actualResponse = response;
  if ("data" in response && response.data !== undefined) {
    actualResponse = response.data;
  }

  // Check for the new search response structure with items
  if ("items" in actualResponse && Array.isArray(actualResponse.items)) {
    jobs = cleanApiResponse(actualResponse.items) as Job[];
    pagination = {
      page: actualResponse.pagination?.page || 1,
      limit: actualResponse.pagination?.pageSize || defaultPageSize,
      total: actualResponse.pagination?.total || jobs.length,
      totalPages:
        actualResponse.pagination?.totalPages ||
        Math.ceil(
          (actualResponse.pagination?.total || jobs.length) /
            (actualResponse.pagination?.pageSize || defaultPageSize)
        ),
    };
  }
  // Check for the response structure with $values (all jobs)
  else if (
    "$values" in actualResponse &&
    Array.isArray(actualResponse.$values)
  ) {
    jobs = cleanApiResponse(actualResponse.$values) as Job[];
    pagination = {
      page: 1,
      limit: defaultPageSize,
      total: jobs.length,
      totalPages: Math.ceil(jobs.length / defaultPageSize),
    };
  }
  // Check for the response structure with jobs.$values (search response)
  else if (
    "jobs" in actualResponse &&
    actualResponse.jobs &&
    typeof actualResponse.jobs === "object" &&
    "$values" in actualResponse.jobs &&
    Array.isArray(actualResponse.jobs.$values)
  ) {
    jobs = cleanApiResponse(actualResponse.jobs.$values) as Job[];
    if (
      "totalCount" in actualResponse &&
      typeof actualResponse.totalCount === "number"
    ) {
      pagination = {
        page: actualResponse.page || 1,
        limit: actualResponse.pageSize || defaultPageSize,
        total: actualResponse.totalCount,
        totalPages:
          actualResponse.totalPages ||
          Math.ceil(
            actualResponse.totalCount /
              (actualResponse.pageSize || defaultPageSize)
          ),
      };
    }
  }
  // Check for legacy pagination structure
  else if ("pagination" in actualResponse && actualResponse.pagination) {
    if ("data" in actualResponse && Array.isArray(actualResponse.data)) {
      jobs = cleanApiResponse(actualResponse.data) as Job[];
    }
    pagination = {
      page: actualResponse.pagination.page || 1,
      limit: actualResponse.pagination.limit || defaultPageSize,
      total: actualResponse.pagination.total || jobs.length,
      totalPages:
        actualResponse.pagination.totalPages ||
        Math.ceil(
          (actualResponse.pagination.total || jobs.length) /
            (actualResponse.pagination.limit || defaultPageSize)
        ),
    };
  }
  // Fallback to array of jobs
  else if (Array.isArray(actualResponse)) {
    jobs = cleanApiResponse(actualResponse) as Job[];
    pagination = {
      page: 1,
      limit: defaultPageSize,
      total: jobs.length,
      totalPages: Math.ceil(jobs.length / defaultPageSize),
    };
  } else {
    console.log(
      "No matching structure found, response structure:",
      actualResponse
    );
  }

  return { jobs, pagination };
}
