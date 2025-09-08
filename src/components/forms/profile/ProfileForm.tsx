import React, { useEffect, useState } from "react";
import { Button } from "../../ui/Button";
import { PersonalInfo } from "./PersonalInfo";
import { EducationSection } from "./EducationSection";
import { CvUpload } from "./CvUpload";
import { SkillsSection } from "../job-posting-form/SkillSection";
import { useStudent } from "../../../hooks/useStudents";
import type { UpdateStudentProfileRequest } from "../../../types/student";

export function ProfileForm() {
  const { student, loading, updateProfile } = useStudent();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    university: "",
    major: "",
    graduationYear: "",
    gpa: "",
    bio: "",
    skills: "",
    experience: "",
    portfolio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    void e;
  };

  useEffect(() => {
    if (!student) return;
    setFormData((prev) => ({
      ...prev,
      name: student.fullName || "",
      email: student.email || "",
      phone: student.phone || "",
      university: student.university || "",
      major: student.major || "",
      graduationYear: student.graduationYear
        ? String(student.graduationYear)
        : "",
      gpa:
        student.gpa !== undefined && student.gpa !== null
          ? String(student.gpa)
          : "",
      bio: student.bio || "",
      portfolio: (student.portfolioUrl || student.linkedinUrl || "") as string,
      // skills and experience would be managed by dedicated flows; keep text as-is
      skills: "",
      experience: "",
    }));
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UpdateStudentProfileRequest = {
      name: formData.name || undefined,
      phone: formData.phone || undefined,
      university: formData.university || undefined,
      major: formData.major || undefined,
      graduationYear: formData.graduationYear
        ? Number(formData.graduationYear)
        : undefined,
      gpa: formData.gpa ? Number(formData.gpa) : undefined,
      bio: formData.bio || undefined,
      portfolioUrl: formData.portfolio || undefined,
    };

    await updateProfile(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PersonalInfo formData={formData} onChange={handleChange} />
      <EducationSection formData={formData} onChange={handleChange} />
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="gpa"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              GPA
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="4"
              id="gpa"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              placeholder="e.g., 3.8"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
              placeholder="Tell employers about yourself..."
            />
          </div>
        </div>
      </div>
      <SkillsSection formData={formData} onChange={handleChange} />
      <CvUpload onFileUpload={handleFileUpload} />

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
