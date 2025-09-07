/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { X, Building, Tag, Globe, MapPin, Phone, Users } from "lucide-react";
import { Button } from "../ui/Button";
import { InputField } from "./job-post-Form/InputField";
import { SelectField } from "./job-post-Form/SelectField";

interface CreateCompanyModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateCompanyModal({
  onClose,
  onSubmit,
}: CreateCompanyModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    description: "",
    website: "",
    logoUrl: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    companySize: "",
    foundedYear: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Company name is required";
    if (!formData.industry) newErrors.industry = "Industry is required";
    if (formData.website && !formData.website.match(/^https?:\/\/.+/))
      newErrors.website = "Please enter a valid website URL";
    if (
      formData.foundedYear &&
      (parseInt(formData.foundedYear) < 1800 ||
        parseInt(formData.foundedYear) > new Date().getFullYear())
    )
      newErrors.foundedYear = "Please enter a valid founded year";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        foundedYear: formData.foundedYear
          ? parseInt(formData.foundedYear)
          : undefined,
      };
      onSubmit(submitData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 w-full max-w-2xl">
          <div className="border-b border-gray-100">
            <div className="px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Company
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Company Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name"
              icon={<Building size={18} />}
              error={errors.name}
              required
            />

            <SelectField
              id="industry"
              name="industry"
              label="Industry"
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
              required
            />
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the company"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Website"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.company.com"
                icon={<Globe size={18} />}
                error={errors.website}
              />
              <InputField
                label="Logo URL"
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://www.company.com/logo.png"
                icon={<Globe size={18} />}
                error={errors.logoUrl}
              />

              <InputField
                label="Phone"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1-234-567-8900"
                icon={<Phone size={18} />}
                error={errors.phone}
              />
            </div>

            <InputField
              label="Address"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address"
              icon={<MapPin size={18} />}
              error={errors.address}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="City"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                icon={<MapPin size={18} />}
                error={errors.city}
              />

              <InputField
                label="State"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State/Province"
                icon={<MapPin size={18} />}
                error={errors.state}
              />

              <InputField
                label="Country"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                icon={<MapPin size={18} />}
                error={errors.country}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                id="companySize"
                name="companySize"
                label="Company Size"
                value={formData.companySize}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select company size" },
                  { value: "1-10", label: "1-10 employees" },
                  { value: "11-50", label: "11-50 employees" },
                  { value: "51-200", label: "51-200 employees" },
                  { value: "201-500", label: "201-500 employees" },
                  { value: "501-1000", label: "501-1000 employees" },
                  { value: "1000+", label: "1000+ employees" },
                ]}
                icon={<Users size={18} />}
                error={errors.companySize}
              />

              <InputField
                label="Founded Year"
                id="foundedYear"
                name="foundedYear"
                type="number"
                value={formData.foundedYear}
                onChange={handleChange}
                placeholder="2020"
                icon={<Building size={18} />}
                error={errors.foundedYear}
                min="1800"
                max={new Date().getFullYear().toString()}
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Company Registration
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>
                • Company will be created and available for employer assignment
              </li>
              <li>• Company details can be updated after creation</li>
              <li>• Admin can verify the company later if needed</li>
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
              Create Company
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
