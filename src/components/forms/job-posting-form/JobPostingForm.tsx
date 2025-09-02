import React, { useState } from "react";
import { useJobs } from "../../../hooks/useJobs";
import type { CreateJobRequest } from "../../../types/job";
import BasicInfoSection from "./BasicInfoSection";
import LocationSection from "./LocationSection";
import SalarySection from "./SalarySection";
import { SkillsSection } from "./SkillSection";
import { DescriptionSection } from "./DescriptionSection";
import { ResponsibilitiesSection } from "./ResponsibilitiesSection";
import { RequirementsSection } from "./RequirementsSection";
import { FormActions } from "./FormActions";
import { useAuth } from "../../../contexts/AuthContext";

interface JobPostingFormProps {
  onJobCreated?: () => void;
}

export function JobPostingForm({ onJobCreated }: JobPostingFormProps) {
  const { createJob, loading } = useJobs();
  const { user } = useAuth();
  const company_id = user?.employer?.company?.id;
  const employer_id = user?.employer?.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    responsibilities: "",
    salary: "",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "USD",
    salaryPeriod: "yearly" as "hourly" | "monthly" | "yearly",
    location: "",
    type: "full-time" as "full-time" | "part-time" | "internship",
    experienceLevel: "entry" as "entry" | "junior" | "mid" | "senior",
    skills: "",
    applicationDeadline: "",
    isRemote: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jobData: CreateJobRequest = {
      employerId: employer_id,
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      responsibilities: formData.responsibilities
        ? formData.responsibilities
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
        : undefined,
      salaryMin: formData.salaryMin
        ? parseFloat(formData.salaryMin)
        : undefined,
      salaryMax: formData.salaryMax
        ? parseFloat(formData.salaryMax)
        : undefined,
      salaryCurrency: formData.salaryCurrency,
      salaryPeriod: formData.salaryPeriod,
      location: formData.location,
      type: formData.type,
      experienceLevel: formData.experienceLevel,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      applicationDeadline: formData.applicationDeadline || undefined,
      isRemote: formData.isRemote,
      companyId: company_id,
    };

    const newJob = await createJob(jobData);
    if (newJob) {
      alert("Job posted successfully!");
      setFormData({
        title: "",
        description: "",
        requirements: "",
        responsibilities: "",
        salary: "",
        salaryMin: "",
        salaryMax: "",
        salaryCurrency: "USD",
        salaryPeriod: "yearly",
        location: "",
        type: "full-time",
        experienceLevel: "entry",
        skills: "",
        applicationDeadline: "",
        isRemote: false,
      });

      // Call the callback to refresh the jobs list
      onJobCreated?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInfoSection formData={formData} onChange={handleChange} />
      <LocationSection formData={formData} onChange={handleChange} />
      <SalarySection formData={formData} onChange={handleChange} />
      <SkillsSection formData={formData} onChange={handleChange} />
      <DescriptionSection formData={formData} onChange={handleChange} />
      <ResponsibilitiesSection formData={formData} onChange={handleChange} />
      <RequirementsSection formData={formData} onChange={handleChange} />
      <FormActions loading={loading} />
    </form>
  );
}
