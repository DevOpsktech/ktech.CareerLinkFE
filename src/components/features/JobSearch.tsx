import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Clock, DollarSign, Building } from "lucide-react";
import { Button } from "../ui/Button";
import { useJobs } from "../../hooks/useJobs";
import { useAuth } from "../../contexts/AuthContext";
import { useApplications } from "../../hooks/useApllications";
import type { JobSearchFilters } from "../../types/job";
import Loader from "../ui/Loader";

export function JobSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    company: "",
  });

  const { user } = useAuth();
  const { jobs, loading, error, fetchJobs, pagination } = useJobs();
  const { applyToJob, loading: applyingToJob } = useApplications();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const searchFilters: JobSearchFilters = {
      query: searchQuery || undefined,
      location: filters.location || undefined,
      jobType: filters.jobType || undefined,
      company: filters.company || undefined,
      page: 1,
    };

    fetchJobs(searchFilters);
  };

  const handleApplyToJob = async (jobId: string) => {
    if (!user || user.role !== "student") return;

    const application = await applyToJob(jobId, user.id, {
      coverLetter: "I am interested in this position and would like to apply.",
    });

    if (application) {
      alert("Application submitted successfully!");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatSalary = (job: any) => {
    if (!job.salary) return "Salary not specified";

    const { min, max, period } = job.salary;
    const formatAmount = (amount: number) => {
      if (period === "hourly") return `$${amount}`;
      return `${amount.toLocaleString()}`;
    };

    if (min && max) {
      return `${formatAmount(min)} - ${formatAmount(max)}${
        period === "hourly" ? "/hour" : period === "yearly" ? "/year" : "/month"
      }`;
    } else if (min) {
      return `From ${formatAmount(min)}${
        period === "hourly" ? "/hour" : period === "yearly" ? "/year" : "/month"
      }`;
    }
    return "Competitive salary";
  };

  const formatJobType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading jobs: {error}</p>
        <Button onClick={() => fetchJobs()} variant="primary">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Find Your Dream Job
        </h2>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <Button type="submit" variant="secondary">
              Search Jobs
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                <option value="new-york">New York, NY</option>
                <option value="chicago">Chicago, IL</option>
                <option value="san-francisco">San Francisco, CA</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                value={filters.jobType}
                onChange={(e) =>
                  setFilters({ ...filters, jobType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                placeholder="Company name"
                value={filters.company}
                onChange={(e) =>
                  setFilters({ ...filters, company: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Job Listings */}
      {loading ? (
        <div className="text-center py-8">
          <Loader text="Loading jobs..." />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No jobs found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Building size={16} className="mr-1" />
                      {job.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      {formatJobType(job.type)}
                    </div>
                    <div className="flex items-center">
                      <DollarSign size={16} className="mr-1" />
                      {formatSalary(job)}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Posted {formatPostedDate(job.postedDate)}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                  <div className="space-y-2 ">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="w-full md:w-auto mr-2"
                    >
                      View Details
                    </Button>
                    {user?.role === "student" && (
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => handleApplyToJob(job.id)}
                        disabled={applyingToJob}
                        className="w-full md:w-auto"
                      >
                        {applyingToJob ? "Applying..." : "Quick Apply"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {pagination.totalPages > 1 && (
        <div className="text-center pt-6">
          <div className="flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              size="md"
              onClick={() =>
                fetchJobs({
                  ...filters,
                  query: searchQuery,
                  page: pagination.page - 1,
                })
              }
              disabled={pagination.page <= 1 || loading}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="md"
              onClick={() =>
                fetchJobs({
                  ...filters,
                  query: searchQuery,
                  page: pagination.page + 1,
                })
              }
              disabled={pagination.page >= pagination.totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
