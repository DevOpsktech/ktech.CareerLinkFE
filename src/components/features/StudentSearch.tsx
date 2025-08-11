import React, { useState } from "react";
import { Search, Filter, Download, X } from "lucide-react";
import { Button } from "../ui/Button";
import { studentColumns, studentData } from "../../constants";
import { StudentTable } from "../ui/StudentTable";

export function StudentSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    major: "",
    graduationYear: "",
    skills: "",
  });
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [selectedCv, setSelectedCv] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery, filters);
  };

  const openCvModal = (cvUrl: string) => {
    setSelectedCv(cvUrl);
    setCvModalOpen(true);
  };

  const handleShortlist = (student: any) => {
    console.log("Shortlisted student:", student);
  };

  return (
    <div className="space-y-6">
      {/* Search + Filters */}
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
            Search Results
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

        <StudentTable
          columns={studentColumns}
          data={studentData}
          onViewCv={openCvModal}
          onShortlist={handleShortlist}
          actions={true}
        />
      </div>

      {/* CV Modal */}
      {cvModalOpen && selectedCv && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full relative">
            <button
              onClick={() => setCvModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Student CV</h2>
              <iframe
                src={selectedCv}
                className="w-full h-[70vh] border rounded"
                title="Student CV"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
