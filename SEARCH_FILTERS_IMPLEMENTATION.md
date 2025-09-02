# Job Search & Filter Implementation

This document describes the frontend implementation of the enhanced job search and filter features that integrate with the backend `/api/Jobs/search` endpoint.

## Features Implemented

### 1. Enhanced Search Parameters

The frontend now supports all the search parameters from the backend API:

- **Text Search (`q`)**: Search across job title, description, and location
- **Location**: Filter by specific job location
- **Remote Work (`isRemote`)**: Filter remote/on-site jobs
- **Job Type (`type`)**: Filter by full-time, part-time, internship, or contract
- **Experience Level**: Filter by entry, junior, mid, or senior level
- **Salary Range**: Filter by minimum and maximum salary
- **Company ID**: Filter by specific company
- **Job Status**: Filter by active, closed, or draft status
- **Skills**: Filter by comma-separated skills
- **Sorting**: Sort by title, location, salary, posted date, or applications
- **Sort Order**: Ascending or descending order
- **Pagination**: Page number and items per page

### 2. UI Components Updated

#### JobSearchFilters Component
- **Basic Filters**: Location, Job Type, Experience Level, Remote Work
- **Advanced Filters**: Salary range, Company ID, Job Status, Skills selection
- **Sorting Options**: Sort by and sort order dropdowns
- **Pagination Control**: Results per page selection
- **Collapsible Interface**: Advanced filters are hidden by default
- **Clear Filters**: Button to reset all active filters

#### JobSearch Component
- **State Management**: Properly manages filter state and search queries
- **API Integration**: Calls the new search endpoint with all filter parameters
- **Pagination**: Handles page changes with filter persistence

### 3. API Integration

#### jobsApi.getJobs()
- Updated to use `/Jobs/search` endpoint
- Maps all filter parameters to query string parameters
- Maintains backward compatibility with legacy parameters
- Returns `SearchResponse<Job>` type for better type safety

#### useJobs Hook
- Handles the new API response structure
- Maps pagination from `pageSize` to `limit` for compatibility
- Supports both new and legacy response formats

### 4. Type Definitions

#### JobSearchFilters Interface
```typescript
export interface JobSearchFilters {
  q?: string; // Text search
  location?: string;
  isRemote?: boolean;
  type?: "full-time" | "part-time" | "internship" | "contract";
  experienceLevel?: "entry" | "junior" | "mid" | "senior";
  salaryMin?: number;
  salaryMax?: number;
  companyId?: string;
  status?: "active" | "closed" | "draft";
  skills?: string[];
  sortBy?: "title" | "location" | "salary" | "posted" | "applications";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  // Legacy fields for backward compatibility
  query?: string;
  jobType?: string;
  company?: string;
  limit?: number;
}
```

#### SearchResponse Interface
```typescript
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
```

## Usage

### Basic Search
```typescript
const filters: JobSearchFilters = {
  q: "software engineer",
  location: "San Francisco",
  type: "full-time"
};
fetchJobs(filters);
```

### Advanced Search with Sorting
```typescript
const filters: JobSearchFilters = {
  q: "react developer",
  isRemote: true,
  experienceLevel: "mid",
  salaryMin: 80000,
  salaryMax: 120000,
  sortBy: "salary",
  sortOrder: "desc",
  page: 1,
  pageSize: 20
};
fetchJobs(filters);
```

### Skills Filter
```typescript
const filters: JobSearchFilters = {
  skills: ["React", "TypeScript", "Node.js"]
};
fetchJobs(filters);
```

## Backward Compatibility

The implementation maintains backward compatibility with existing code:

- Legacy parameters (`query`, `jobType`, `company`, `limit`) are automatically mapped to new parameters
- The existing pagination structure is preserved in the UI
- Existing components continue to work without modification

## Future Enhancements

1. **Company Search**: Add company name search functionality
2. **Saved Searches**: Allow users to save and reuse search filters
3. **Filter Presets**: Predefined filter combinations for common searches
4. **Advanced Skills**: Skill proficiency levels and categories
5. **Geolocation**: Location-based search with radius options
6. **Job Alerts**: Email notifications for new jobs matching saved criteria

## Testing

To test the new features:

1. Navigate to the job search page
2. Try different filter combinations
3. Verify that the API calls include the correct parameters
4. Check that pagination works correctly
5. Test the clear filters functionality
6. Verify that advanced filters toggle properly

## API Endpoint

The frontend now calls:
```
GET /api/Jobs/search?q={query}&location={location}&type={type}&experienceLevel={level}&isRemote={boolean}&salaryMin={min}&salaryMax={max}&companyId={id}&status={status}&skills={skills}&sortBy={field}&sortOrder={direction}&page={page}&pageSize={size}
```

All parameters are optional and will be omitted if not provided.
