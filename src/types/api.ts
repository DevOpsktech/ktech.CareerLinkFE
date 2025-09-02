export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// New interface for the enhanced search endpoint
export interface SearchResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters?: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: string;
}

export interface DotNetListResponse<T> {
  $id: string;
  $values: T[];
}

export interface ApiError {
  message: string;
  code?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
}
