import { useState } from "react";
import { useEmployers } from "../../hooks/useEmployers";
import { DataTable } from "../ui/DataTable";
import { Button } from "../ui/Button";
import { CreateEmployerModal } from "../modals/job-post-Form/CreateEmployerModal";
import { CreateCompanyModal } from "../modals/CreateCompanyModal";
import {
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  MapPin,
  Building,
} from "lucide-react";
import type { Employer } from "../../types/employer";
import { useAuth } from "../../contexts/AuthContext";
import { companyApi } from "../../api/companyApi";
import type { CreateCompanyRequest } from "../../api/companyApi";

interface EmployerFormData {
  name: string;
  position: string;
  companyId: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export function EmployerManagement() {
  const { employers, loading, deleteEmployer } = useEmployers();
  const { register, error } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateEmployerModalOpen, setIsCreateEmployerModalOpen] =
    useState(false);
  const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] =
    useState(false);

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

  const handleCreateCompany = async (companyData: CreateCompanyRequest) => {
    try {
      const response = await companyApi.createCompany(companyData);
      if (response.success) {
        console.log("Company created successfully:", response.data);
        setIsCreateCompanyModalOpen(false);
        // Optionally refresh companies list or show success message
      }
    } catch (error) {
      console.error("Failed to create company:", error);
    }
  };

  const handleCreateEmployer = async (employerData: EmployerFormData) => {
    try {
      // First register the user with role "Employer"
      const registerResponse = await register({
        email: employerData.email,
        password: employerData.password,
        fullName: employerData.name,
        companyId: employerData.companyId,
        position: employerData.position,
        phone: employerData.phone,
        role: "Employer",
      });

      if (registerResponse) {
        // Then create the employer profile with additional data
        // This would typically be done after successful registration
        // For now, we'll just log the employer data that would be sent
        console.log("Employer profile data:", {
          userId: "1003", // Would come from registration response
          companyId: employerData.companyId,
          name: employerData.name,
          email: employerData.email,
          position: employerData.position,
          phone: employerData.phone,
        });

        setIsCreateEmployerModalOpen(false);
      }
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
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex items-center justify-center"
            onClick={() => setIsCreateCompanyModalOpen(true)}
          >
            <Building className="w-4 h-4 mr-2" />
            Add Company
          </Button>
          <Button
            className="flex items-center justify-center"
            onClick={() => setIsCreateEmployerModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Employer
          </Button>
        </div>
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

      {isCreateCompanyModalOpen && (
        <CreateCompanyModal
          onClose={() => setIsCreateCompanyModalOpen(false)}
          onSubmit={handleCreateCompany}
        />
      )}

      {isCreateEmployerModalOpen && (
        <CreateEmployerModal
          onClose={() => setIsCreateEmployerModalOpen(false)}
          onSubmit={handleCreateEmployer}
        />
      )}
    </div>
  );
}
