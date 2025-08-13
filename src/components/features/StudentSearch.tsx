import React, { useState } from "react";
import { Search, Filter, Download, Star } from "lucide-react";
import { Button } from "../ui/Button";
import { useStudents } from "../../hooks/useStudents";
import type { StudentSearchFilters } from "../../types/student";

export function StudentSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    major: "",
    graduationYear: "",
    skills: "",
  });

  const { students, loading, error, fetchStudents, pagination } = useStudents();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const searchFilters: StudentSearchFilters = {
      query: searchQuery || undefined,
      major: filters.major || undefined,
      graduationYear: filters.graduationYear
        ? parseInt(filters.graduationYear)
        : undefined,
      skills: filters.skills
        ? filters.skills.split(",").map((s) => s.trim())
        : undefined,
      page: 1,
    };

    fetchStudents(searchFilters);
  };

  const handleDownloadCV = (student: any) => {
    if (student.cvUrl) {
      window.open(student.cvUrl, "_blank");
    } else {
      alert("CV not available for this student");
    }
  };

  const handleShortlist = (student: any) => {
    // This would typically call an API to add to shortlist
    alert(`${student.name} has been added to your shortlist!`);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading students: {error}</p>
        <Button onClick={() => fetchStudents()} variant="primary">
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
          Find Students
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
                  placeholder="Search students by name, skills, or major..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <Button type="submit" variant="primary">
              Search
            </Button>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Major
              </label>
              <select
                value={filters.major}
                onChange={(e) =>
                  setFilters({ ...filters, major: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Majors</option>
                <option value="computer-science">Computer Science</option>
                <option value="business">Business Administration</option>
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Graduation Year
              </label>
              <select
                value={filters.graduationYear}
                onChange={(e) =>
                  setFilters({ ...filters, graduationYear: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Years</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <input
                type="text"
                placeholder="e.g. JavaScript, Marketing"
                value={filters.skills}
                onChange={(e) =>
                  setFilters({ ...filters, skills: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Search Results */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Search Results ({pagination.total} students found)
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" />
              More Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No students found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Major
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Graduation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GPA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.major || "Not specified"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.graduationYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {student.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill.id}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {skill.skillName}
                          </span>
                        ))}
                        {student.skills.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{student.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.gpa ? student.gpa.toFixed(1) : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadCV(student)}
                      >
                        <Download size={14} className="mr-1" />
                        View CV
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleShortlist(student)}
                      >
                        <Star size={14} className="mr-1" />
                        Shortlist
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex justify-center items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  fetchStudents({
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
                size="sm"
                onClick={() =>
                  fetchStudents({
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
    </div>
  );
}
