/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import BasicInfoSection from "../../forms/job-posting-form/BasicInfoSection";
import { Modal } from "../../ui/Modal";
import LocationSection from "../../forms/job-posting-form/LocationSection";
import SalarySection from "../../forms/job-posting-form/SalarySection";
import { SkillsSection } from "../../forms/job-posting-form/SkillSection";
import { DescriptionSection } from "../../forms/job-posting-form/DescriptionSection";
import { ResponsibilitiesSection } from "../../forms/job-posting-form/ResponsibilitiesSection";
import { RequirementsSection } from "../../forms/job-posting-form/RequirementsSection";
import { Button } from "../../ui/Button";
import type { Job, CreateJobRequest } from "../../../types/job";
import { jobsApi } from "../../../api/jobsApi";

interface UpdateJobModalProps {
  isOpen: boolean;
  job: Job | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export function UpdateJobModal({
  isOpen,
  job,
  onClose,
  onUpdated,
}: UpdateJobModalProps) {
  const initialState = useMemo(
    () => ({
      title: job?.title || "",
      description: job?.description || "",
      requirements: (Array.isArray((job as unknown as any)?.requirements)
        ? (job as unknown as any).requirements
        : (job as unknown as any)?.requirements?.$values || []
      ).join(", "),
      responsibilities: (Array.isArray(
        (job as unknown as any)?.responsibilities
      )
        ? (job as unknown as any).responsibilities
        : (job as unknown as any)?.responsibilities?.$values || []
      ).join(", "),
      salaryMin: job?.salaryMin ? String(job.salaryMin) : "",
      salaryMax: job?.salaryMax ? String(job.salaryMax) : "",
      salaryCurrency: job?.salaryCurrency || "USD",
      salaryPeriod:
        (job?.salaryPeriod as "hourly" | "monthly" | "yearly") || "yearly",
      location: job?.location || "",
      type:
        (job?.type as "full-time" | "part-time" | "internship" | "contract") ||
        "full-time",
      experienceLevel:
        (job?.experienceLevel as "entry" | "junior" | "mid" | "senior") ||
        "entry",
      skills: (Array.isArray((job as unknown as any)?.skills)
        ? (job as unknown as any).skills
        : (job as unknown as any)?.skills?.$values || []
      ).join(", "),
      applicationDeadline: job?.applicationDeadline || "",
      isRemote: Boolean(job?.isRemote),
    }),
    [job]
  );

  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    setFormData(initialState);
  }, [initialState]);

  if (!isOpen || !job) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job?.id) return;
    setSubmitting(true);
    try {
      const payload: Partial<CreateJobRequest> = {
        employerId: job.employerId,
        companyId: job.companyId,
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        responsibilities: formData.responsibilities
          ? formData.responsibilities
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
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
          .map((s: string) => s.trim())
          .filter(Boolean),
        applicationDeadline: formData.applicationDeadline || undefined,
        isRemote: formData.isRemote,
        status: job.status,
      };

      await jobsApi.updateJob(job.id, payload);
      alert("Job updated successfully!");
      onClose();
      onUpdated?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Update Job" 
      subtitle="Edit the job details below"
      size="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[65vh] overflow-y-auto">
          <BasicInfoSection formData={formData} onChange={handleChange} />
          <LocationSection formData={formData} onChange={handleChange} />
          <SalarySection formData={formData} onChange={handleChange} />
          <SkillsSection
            formData={formData}
            onChange={
              handleChange as unknown as React.ChangeEventHandler<HTMLInputElement>
            }
          />
          <DescriptionSection
            formData={formData}
            onChange={
              handleChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>
            }
          />
          <ResponsibilitiesSection
            formData={formData}
            onChange={
              handleChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>
            }
          />
          <RequirementsSection
            formData={formData}
            onChange={
              handleChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>
            }
          />

          <div className="flex space-x-3 pt-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Updating..." : "Update Job"}
            </Button>
          </div>
        </form>
    </Modal>
  );
}

export default UpdateJobModal;
