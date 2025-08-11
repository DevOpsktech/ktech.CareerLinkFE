import { useState } from "react";
import { Button } from "../ui/Button";
import { Plus, Search } from "lucide-react";
import { CreateEmployerModal } from "../modals/job-post-Form/CreateEmployeeModal";

interface Employer {
  id: string;
  company: string;
  email: string;
  industry: string;
  jobs: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

export function EmployerManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [employers, setEmployers] = useState<Employer[]>([
    {
      id: "1",
      company: "TechCorp",
      email: "hr@techcorp.com",
      industry: "Technology",
      jobs: 15,
      status: "Active",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      company: "FinanceInc",
      email: "careers@financeinc.com",
      industry: "Finance",
      jobs: 8,
      status: "Active",
      createdAt: "2024-01-12",
    },
    {
      id: "3",
      company: "HealthCare Ltd",
      email: "jobs@healthcare.com",
      industry: "Healthcare",
      jobs: 12,
      status: "Inactive",
      createdAt: "2024-01-08",
    },
  ]);

  const employerColumns = [
    { key: "company", label: "Company" },
    { key: "email", label: "Email" },
    { key: "industry", label: "Industry" },
    { key: "jobs", label: "Jobs Posted" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created" },
  ];

  const handleCreateEmployer = (employerData: any) => {
    const newEmployer: Employer = {
      id: Date.now().toString(),
      company: employerData.company,
      email: employerData.email,
      industry: employerData.industry,
      jobs: 0,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setEmployers([...employers, newEmployer]);
    setIsCreateModalOpen(false);
  };

  const filteredEmployers = employers.filter(
    (employer) =>
      employer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employer.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Employer Management
          </h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search employers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="primary"
              className="flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add Employer
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {employerColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployers.map((employer) => (
              <tr key={employer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {employer.company}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employer.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employer.industry}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employer.jobs}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employer.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employer.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Deactivate
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateModalOpen && (
        <CreateEmployerModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateEmployer}
        />
      )}
    </div>
  );
}
