import { useState } from "react";
import { useEmployers } from "../../hooks/useEmployers";
import { DataTable } from "../ui/DataTable";
import { Button } from "../ui/Button";
import { CreateEmployerModal } from "../modals/job-post-Form/CreateEmployeeModal";
import { Plus, Search, Building2, Mail, Phone, MapPin } from "lucide-react";
import type { Employer } from "../../types/employer";

export function EmployerManagement() {
  const { employers, loading, error, createEmployer, deleteEmployer } =
    useEmployers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredEmployers = employers.filter(
    (employer) =>
      employer.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "company" as keyof Employer,
      label: "Company",
      render: (employer: Employer) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {employer.company.name}
            </div>
            <div className="text-sm text-gray-500">
              {employer.company.industry}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "name" as keyof Employer,
      label: "Contact Person",
      render: (employer: Employer) => (
        <div>
          <div className="font-medium text-gray-900">{employer.name}</div>
          <div className="text-sm text-gray-500">
            {employer.position || "N/A"}
          </div>
        </div>
      ),
    },
    {
      key: "email" as keyof Employer,
      label: "Contact Info",
      render: (employer: Employer) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            {employer.email}
          </div>
          {employer.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              {employer.phone}
            </div>
          )}
          {(employer.company.city || employer.company.state) && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {employer.company.city}
              {employer.company.city && employer.company.state ? ", " : ""}
              {employer.company.state}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "actions" as keyof Employer,
      label: "Actions",
      render: (employer: Employer) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Handle edit employer
              console.log("Edit employer:", employer.id);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm("Are you sure you want to delete this employer?")) {
                deleteEmployer(employer.id);
              }
            }}
            className="text-red-600 hover:text-red-700 hover:border-red-300"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleCreateEmployer = async (employerData: any) => {
    try {
      await createEmployer(employerData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create employer:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading employers: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Employer Management
          </h2>
          <p className="text-gray-600">
            Manage employer accounts and company information
          </p>
        </div>
        <Button
          className="flex items-center justify-center"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Employer
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search employers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <DataTable data={filteredEmployers} columns={columns} />
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
