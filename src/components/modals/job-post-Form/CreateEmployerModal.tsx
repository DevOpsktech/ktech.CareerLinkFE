import React, { useState } from "react";
import { X, Building, Mail, Tag, PersonStanding } from "lucide-react";
import { Button } from "../../ui/Button";
import { InputField } from "./InputField";
import { SelectField } from "./SelectField";
import { PasswordField } from "./PasswordField";

interface CreateEmployerModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateEmployerModal({
  onClose,
  onSubmit,
}: CreateEmployerModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    company: "",
    email: "",
    industry: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!formData.company) newErrors.company = "Company is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (formData.email && !formData.email.includes("@"))
      newErrors.email = "Valid email is required";
    if (!formData.industry) newErrors.industry = "Industry is required";
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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

          <InputField
            label="Company"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Enter company name"
            icon={<Building size={18} />}
            error={errors.company}
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

          <SelectField
            id="industry"
            name="industry"
            label="industry"
            value={formData.industry}
            onChange={handleChange}
            options={[
              { value: "", label: "Select industry" },
              { value: "IT", label: "IT" },
              { value: "Finance", label: "Finance" },
              { value: "Healthcare", label: "Healthcare" },
              { value: "Education", label: "Education" },
              { value: "Manufacturing", label: "Manufacturing" },
              { value: "Retail", label: "Retail" },
              { value: "Energy", label: "Energy" },
              { value: "Transportation", label: "Transportation" },
              { value: "Agriculture", label: "Agriculture" },
              { value: "Government", label: "Government" },
              { value: "Non-profit", label: "Non-profit" },
              { value: "Entertainment", label: "Entertainment" },
            ]}
            icon={<Tag size={18} />}
            error={errors.industry}
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

          <InputField
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            // icon={<Lock size={18} />}
            error={errors.confirmPassword}
            // showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((prev) => !prev)}
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
