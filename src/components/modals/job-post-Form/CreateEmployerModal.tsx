import React, { useState, useEffect } from "react";
import { X, Building, Mail, PersonStanding, Phone } from "lucide-react";
import { Button } from "../../ui/Button";
import { InputField } from "./InputField";
import { SelectField } from "./SelectField";
import { PasswordField } from "./PasswordField";
import { companyApi } from "../../../api/companyApi";
import type { Company } from "../../../types/employer";

interface CreateEmployerModalProps {
  onClose: () => void;
  onSubmit: (data: EmployerFormData) => void;
}

interface EmployerFormData {
  name: string;
  position: string;
  companyId: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export function CreateEmployerModal({
  onClose,
  onSubmit,
}: CreateEmployerModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [formData, setFormData] = useState<EmployerFormData>({
    name: "",
    position: "",
    companyId: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companyApi.getCompanies({ limit: 100 });
        // The response should be a PaginatedResponse with data property containing the array
        const companiesData = response?.data || [];
        setCompanies(Array.isArray(companiesData) ? companiesData : []);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        setCompanies([]);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password, confirmPassword: password }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.companyId) newErrors.companyId = "Company is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (formData.email && !formData.email.includes("@"))
      newErrors.email = "Valid email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/10  bg-opacity-10 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Create Employer Account
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <InputField
            label="Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter employer name"
            icon={<PersonStanding size={18} />}
            error={errors.name}
          />

          <InputField
            label="Position"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Enter employer position"
            icon={<Building size={18} />}
            error={errors.position}
          />

          <SelectField
            id="companyId"
            name="companyId"
            label="Company"
            value={formData.companyId}
            onChange={handleChange}
            options={[
              {
                value: "",
                label: loadingCompanies
                  ? "Loading companies..."
                  : "Select company",
              },
              ...(Array.isArray(companies)
                ? companies.map((company) => ({
                    value: company.id,
                    label: `${company.name} (${company.industry})`,
                  }))
                : []),
            ]}
            icon={<Building size={18} />}
            error={errors.companyId}
            disabled={loadingCompanies}
          />

          <InputField
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="hr@company.com"
            icon={<Mail size={18} />}
            error={errors.email}
          />

          <InputField
            label="Phone"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91-9876543210"
            icon={<Phone size={18} />}
            error={errors.phone}
          />

          {/* <PasswordField
            value={formData.password}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword((prev) => !prev)}
            onGenerate={generatePassword}
            label="password"
            onChange={handleChange}
            error={errors.password}
          /> */}
          <PasswordField
            label="password"
            name="password"
            onChange={handleChange}
            onToggleShowPassword={() => setShowPassword((prev) => !prev)}
            showPassword={showPassword}
            id="password"
            generatePassword={generatePassword}
            value={formData.password}
          />
          {/* <PasswordField
            label="confirm password"
            name="confirm-password"
            onChange={handleChange}
            showPassword={showPassword}
            id="confirm-password"
            value={formData.confirmPassword}
          /> */}

          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            showPassword={showPassword}
            id="confirmPassword"
            value={formData.confirmPassword}
            onToggleShowPassword={() => setShowPassword((prev) => !prev)}
            error={errors.confirmPassword}
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Account Setup
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Employer will receive login credentials via email</li>
              <li>• They can change their password after first login</li>
              <li>• Account will be active immediately after creation</li>
            </ul>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
