import { useState } from "react";
import { useEmployers } from "../../hooks/useEmployers";
import { DataTable } from "../ui/DataTable";
import { Button } from "../ui/Button";
import { CreateEmployerModal } from "../modals/job-post-Form/CreateEmployerModal";
import { CreateCompanyModal } from "../modals/CreateCompanyModal";
import { UpdateEmployerModal } from "../modals/job-post-Form/UpdateEmployerModal";
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
import { ConfirmModal } from "../ui/ConfirmModal";
import { useToast } from "../../contexts/ToastContext";

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
  const { employers, loading, deleteEmployer, updateEmployer } = useEmployers();
  const { register, error } = useAuth();
  const { showSuccess, showError } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateEmployerModalOpen, setIsCreateEmployerModalOpen] =
    useState(false);
  const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] =
    useState(false);
  const [isUpdateEmployerModalOpen, setIsUpdateEmployerModalOpen] =
    useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(
    null
  );

  const search = searchTerm.toLowerCase();
  const filteredEmployers = employers.filter((employer) => {
    const companyName = employer.company?.name ?? "";
    const email = employer.email ?? "";
    const fullName = employer.fullName ?? "";
    return (
      companyName.toLowerCase().includes(search) ||
      email.toLowerCase().includes(search) ||
      fullName.toLowerCase().includes(search)
    );
  });

  const columns = [
    {
      key: "company" as keyof Employer,
      label: "Company",
      render: (employer: Employer) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate">
              {employer.company?.name ?? "N/A"}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {employer.company?.industry ?? "N/A"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "name" as keyof Employer,
      label: "Contact Person",
      render: (employer: Employer) => (
        <div className="min-w-0">
          <div className="font-medium text-gray-900 truncate">
            {employer.fullName}
          </div>
          <div className="text-sm text-gray-500 truncate">
            {employer.position || "N/A"}
          </div>
        </div>
      ),
    },
    {
      key: "email" as keyof Employer,
      label: "Contact Info",
      render: (employer: Employer) => (
        <div className="space-y-1 min-w-0">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{employer.email}</span>
          </div>
          {employer.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{employer.phone}</span>
            </div>
          )}
          {(employer.company?.city || employer.company?.state) && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {employer.company?.city}
                {employer.company?.city && employer.company?.state ? ", " : ""}
                {employer.company?.state}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "actions" as keyof Employer,
      label: "Actions",
      render: (employer: Employer) => (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm"
            onClick={() => {
              setSelectedEmployer(employer);
              setIsUpdateEmployerModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:border-red-300"
            onClick={() => {
              setSelectedEmployer(employer);
              setIsConfirmOpen(true);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleConfirmDelete = () => {
    if (selectedEmployer) {
      deleteEmployer(selectedEmployer.id);
    }
    setIsConfirmOpen(false);
    setSelectedEmployer(null);
  };

  const handleCreateCompany = async (companyData: CreateCompanyRequest) => {
    try {
      const response = await companyApi.createCompany(companyData);
      if (response.success) {
        showSuccess("Company created successfully!");
        setIsCreateCompanyModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to create company:", error);
      showError("Failed to create company!");
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
        showSuccess("Employer created successfully!");
        setIsCreateEmployerModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to create employer:", error);
      showError("Failed to create employer!");
    }
  };

  const handleUpdateEmployer = async (
    data: Partial<{
      fullName: string;
      position: string;
      companyId: string;
      email: string;
      phone: string;
    }>
  ) => {
    if (!selectedEmployer) return;
    try {
      await updateEmployer(selectedEmployer.id, {
        fullName: data.fullName,
        position: data.position,
        phone: data.phone,
        email: data.email,
        company: data.companyId,
      });
      setIsUpdateEmployerModalOpen(false);
      setSelectedEmployer(null);
    } catch {
      // error toasts handled in hook
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
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Employer Management
          </h2>
          <p className="text-gray-600">
            Manage employer accounts and company information
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            className="flex items-center justify-center w-full sm:w-auto"
            onClick={() => setIsCreateCompanyModalOpen(true)}
          >
            <Building className="w-4 h-4 mr-2" />
            Add Company
          </Button>
          <Button
            className="flex items-center justify-center w-full sm:w-auto"
            onClick={() => setIsCreateEmployerModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Employer
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200">
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

      {isUpdateEmployerModalOpen && (
        <UpdateEmployerModal
          isOpen={isUpdateEmployerModalOpen}
          employer={selectedEmployer}
          onClose={() => {
            setIsUpdateEmployerModalOpen(false);
            setSelectedEmployer(null);
          }}
          onSubmit={handleUpdateEmployer}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Employer"
        message={`Are you sure you want to delete ${
          selectedEmployer?.email || "this employer"
        }?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setSelectedEmployer(null);
        }}
      />
    </div>
  );
}
