import React, { useState } from "react";
import { Button } from "../../ui/Button";
import { PersonalInfo } from "./PersonalInfo";
import { EducationSection } from "./EducationSection";
import { SkillsExperience } from "./SkillsExperience";
import { CvUpload } from "./CvUpload";
import { useAuth } from "../../../contexts/AuthContext";
import { useStudent } from "../../../hooks/useStudents";

export function ProfileForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    major: "",
    graduationYear: 0,
    skills: "",
    experience: "",
    portfolio: "",
  });

  const { user } = useAuth();
  const { updateProfile } = useStudent(user?.id);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("CV uploaded:", file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile updated:", formData);
    updateProfile({ ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PersonalInfo formData={formData} onChange={handleChange} />
      <EducationSection formData={formData} onChange={handleChange} />
      <SkillsExperience formData={formData} onChange={handleChange} />
      <CvUpload onFileUpload={handleFileUpload} />

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save Profile
        </Button>
      </div>
    </form>
  );
}
