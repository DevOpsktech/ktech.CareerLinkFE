import React, { useEffect, useState } from "react";
import { Building, Mail, PersonStanding, Phone } from "lucide-react";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { InputField } from "./InputField";
import type { Employer } from "../../../types/employer";

interface UpdateEmployerModalProps {
  isOpen: boolean;
  employer: Employer | null;
  onClose: () => void;
  onSubmit: (
    data: Partial<{
      fullName: string;
      position: string;
      email: string;
      phone: string;
    }>
  ) => void;
}

export function UpdateEmployerModal({
  isOpen,
  employer,
  onClose,
  onSubmit,
}: UpdateEmployerModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    position: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employer) {
      setFormData({
        fullName: employer.fullName || "",
        position: employer.position || "",
        email: employer.email || "",
        phone: employer.phone || "",
      });
    }
  }, [employer]);

  if (!isOpen || !employer) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit({
      fullName: formData.fullName,
      position: formData.position,
      email: formData.email,
      phone: formData.phone,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Employer" size="md">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-h-[65vh] overflow-y-auto"
      >
        <InputField
          label="Name"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
          placeholder="Enter employer name"
          icon={<PersonStanding size={18} />}
          error={errors.fullName}
        />

        <InputField
          label="Position"
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
          placeholder="Enter employer position"
          icon={<Building size={18} />}
        />

        <InputField
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
          placeholder="hr@company.com"
          icon={<Mail size={18} />}
          error={errors.email}
        />

        <InputField
          label="Phone"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
          placeholder="+91-9876543210"
          icon={<Phone size={18} />}
        />

        <div className="flex space-x-3 pt-4 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Update Employer
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default UpdateEmployerModal;
