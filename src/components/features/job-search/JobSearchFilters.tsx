import React from "react";
import { Search } from "lucide-react";
import type { JobSearchFilters } from "../../../types/job";
import { Button } from "../../ui/Button";

interface Props {
  searchQuery: string;
  filters: { location: string; jobType: string; company: string };
  onSearchQueryChange: (value: string) => void;
  onFilterChange: (filters: {
    location: string;
    jobType: string;
    company: string;
  }) => void;
  onSubmit: (filters: JobSearchFilters) => void;
}

export function JobSearchFilters({
  searchQuery,
  filters,
  onSearchQueryChange,
  onFilterChange,
  onSubmit,
}: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      query: searchQuery || undefined,
      location: filters.location || undefined,
      jobType: filters.jobType || undefined,
      company: filters.company || undefined,
      page: 1,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Find Your Dream Job
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search jobs by title, company, or skills..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            />
          </div>
          <Button type="submit" variant="secondary">
            Search Jobs
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              value={filters.location}
              onChange={(e) =>
                onFilterChange({ ...filters, location: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Locations</option>
              <option value="new-york">New York, NY</option>
              <option value="chicago">Chicago, IL</option>
              <option value="san-francisco">San Francisco, CA</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <select
              value={filters.jobType}
              onChange={(e) =>
                onFilterChange({ ...filters, jobType: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              placeholder="Company name"
              value={filters.company}
              onChange={(e) =>
                onFilterChange({ ...filters, company: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
