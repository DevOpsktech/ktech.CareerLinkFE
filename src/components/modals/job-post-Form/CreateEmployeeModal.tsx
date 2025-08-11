import React, { useState } from "react";
import { X, Building, Mail, Tag } from "lucide-react";
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
    if (!formData.company.trim())
      newErrors.company = "Company name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.includes("@"))
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
    if (validateForm()) {
      onSubmit(formData);
    }
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
            id="company"
            name="company"
            label="Company Name *"
            value={formData.company}
            onChange={handleChange}
            placeholder="Enter company name"
            icon={<Building size={18} />}
            error={errors.company}
          />

          <InputField
            id="email"
            name="email"
            label="Email Address *"
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
            label="Industry *"
            value={formData.industry}
            onChange={handleChange}
            icon={<Tag size={18} />}
            options={[
              { value: "Technology", label: "Technology" },
              { value: "Finance", label: "Finance" },
              { value: "Healthcare", label: "Healthcare" },
              { value: "Education", label: "Education" },
              { value: "Manufacturing", label: "Manufacturing" },
              { value: "Retail", label: "Retail" },
              { value: "Consulting", label: "Consulting" },
              { value: "Other", label: "Other" },
            ]}
            error={errors.industry}
          />

          <PasswordField
            id="password"
            name="password"
            label="Password *"
            value={formData.password}
            onChange={handleChange}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword((v) => !v)}
            generatePassword={generatePassword}
            error={errors.password}
          />

          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password *"
            value={formData.confirmPassword}
            onChange={handleChange}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword((v) => !v)}
            error={errors.confirmPassword}
          />

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
