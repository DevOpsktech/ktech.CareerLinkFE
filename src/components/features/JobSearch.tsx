import React, { useState } from "react";
import { Search, MapPin, Clock, DollarSign, Building } from "lucide-react";
import { Button } from "../ui/Button";

export function JobSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    company: "",
  });

  const jobs = [
    {
      id: "1",
      title: "Software Engineering Intern",
      company: "TechCorp",
      location: "New York, NY",
      type: "Internship",
      salary: "$25/hour",
      description:
        "Join our dynamic development team and work on cutting-edge web applications.",
      posted: "2 days ago",
      skills: ["React", "JavaScript", "Python"],
    },
    {
      id: "2",
      title: "Marketing Assistant",
      company: "MarketPro",
      location: "Chicago, IL",
      type: "Part-time",
      salary: "$20/hour",
      description:
        "Support marketing campaigns and social media management for growing startup.",
      posted: "1 week ago",
      skills: ["Social Media", "Content Creation", "Analytics"],
    },
    {
      id: "3",
      title: "Data Analyst",
      company: "DataCo",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$70,000 - $85,000",
      description:
        "Analyze large datasets to derive business insights and support decision-making.",
      posted: "3 days ago",
      skills: ["SQL", "Python", "Tableau"],
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery, filters);
  };

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
                    {job.type}
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-1" />
                    {job.salary}
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
                <p className="text-xs text-gray-500">Posted {job.posted}</p>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                <Button variant="secondary" size="md">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-6">
        <Button variant="outline" size="lg">
          Load More Jobs
        </Button>
      </div>
    </div>
  );
}
