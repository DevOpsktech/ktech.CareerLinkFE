/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import BasicInfoSection from "../../forms/job-posting-form/BasicInfoSection";
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
    <div className="fixed inset-0 bg-black/10 bg-opacity-10 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Update Job</h2>
            <p className="text-sm text-gray-600 mt-1">
              Edit the job details below
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={submitting}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
      </div>
    </div>
  );
}

export default UpdateJobModal;
