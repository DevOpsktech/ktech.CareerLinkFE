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
  console.log("parseJobsResponse called with:", response);
  console.log("Response type:", typeof response);
  console.log(
    "Response keys:",
    response ? Object.keys(response) : "null/undefined"
  );

  let jobs: Job[] = [];
  let pagination = {
    page: 1,
    limit: defaultPageSize,
    total: 0,
    totalPages: 0,
  };

  if (!response || typeof response !== "object") {
    console.log("Response is null/undefined or not an object, returning empty");
    return { jobs, pagination };
  }

  // Handle ApiResponse wrapper from apiClient
  let actualResponse = response;
  if ("data" in response && response.data !== undefined) {
    console.log("Found ApiResponse wrapper, extracting data");
    actualResponse = response.data;
  }

  // Check for the new search response structure with items
  if ("items" in actualResponse && Array.isArray(actualResponse.items)) {
    console.log("Found items structure");
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
    console.log("Found $values structure");
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
    console.log("Found jobs.$values structure");
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
    console.log("Found legacy pagination structure");
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
    console.log("Found array structure");
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

  console.log("Parsed result:", { jobs, pagination });
  return { jobs, pagination };
}
