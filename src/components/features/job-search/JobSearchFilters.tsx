import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import type { JobSearchFilters } from "../../../types/job";
import { Button } from "../../ui/Button";
import {
  jobTypeOptions,
  experienceLevelOptions,
  jobStatusOptions,
  sortByOptions,
  sortOrderOptions,
  pageSizeOptions,
} from "../../../constants";

interface Props {
  searchQuery?: string;
  filters: JobSearchFilters;
  onSearchQueryChange: (value: string) => void;
  onFilterChange: (filters: JobSearchFilters) => void;
  onSubmit: (filters: JobSearchFilters) => void;
}

export function JobSearchFilters({
  searchQuery,
  filters,
  onSearchQueryChange,
  onFilterChange,
  onSubmit,
}: Props) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<JobSearchFilters>(filters);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    filters.skills || []
  );

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
    setSelectedSkills(filters.skills || []);
  }, [filters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchFilters: JobSearchFilters = {
      q: searchQuery || undefined,
      location: localFilters.location || undefined,
      type: localFilters.type || undefined,
      experienceLevel: localFilters.experienceLevel || undefined,
      isRemote: localFilters.isRemote,
      salaryMin: localFilters.salaryMin || undefined,
      salaryMax: localFilters.salaryMax || undefined,
      companyId: localFilters.companyId || undefined,
      status: localFilters.status || undefined,
      skills: selectedSkills.length > 0 ? selectedSkills : undefined,
      sortBy: localFilters.sortBy || undefined,
      sortOrder: localFilters.sortOrder || undefined,
      page: 1,
      pageSize: localFilters.pageSize || 10,
    };
    onSubmit(searchFilters);
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const clearFilters = () => {
    const emptyFilters: JobSearchFilters = { pageSize: 10 };
    setLocalFilters(emptyFilters);
    setSelectedSkills([]);
    onSearchQueryChange("");
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = () => {
    return !!(
      searchQuery ||
      localFilters.location ||
      localFilters.type ||
      localFilters.experienceLevel ||
      localFilters.isRemote !== undefined ||
      localFilters.salaryMin ||
      localFilters.salaryMax ||
      localFilters.companyId ||
      localFilters.status ||
      selectedSkills.length > 0 ||
      localFilters.sortBy ||
      localFilters.sortOrder
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Find Your Dream Job
        </h2>
        {hasActiveFilters() && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X size={16} />
            Clear Filters
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search jobs by title, description, or location..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            />
          </div>
          <Button type="submit" variant="secondary">
            Search Jobs
          </Button>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  value={localFilters.type || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      type: e.target.value as
                        | "full-time"
                        | "part-time"
                        | "internship"
                        | "contract"
                        | undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">All Types</option>
                  {jobTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={localFilters.experienceLevel || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      experienceLevel: e.target.value as
                        | "entry"
                        | "junior"
                        | "mid"
                        | "senior"
                        | undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">All Levels</option>
                  {experienceLevelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Salary
                </label>
                <input
                  type="number"
                  placeholder="Min salary"
                  value={localFilters.salaryMin || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      salaryMin: Number(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Salary
                </label>
                <input
                  type="number"
                  placeholder="Max salary"
                  value={localFilters.salaryMax || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      salaryMax: Number(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Company and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Status
                </label>
                <select
                  value={localFilters.status || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      status: e.target.value as
                        | "active"
                        | "closed"
                        | "draft"
                        | undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">All Statuses</option>
                  {jobStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
