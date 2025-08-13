import React, { useState } from "react";
import { Button } from "../ui/Button";
import { useJobs } from "../../hooks/useJobs";
import type { CreateJobRequest } from "../../types/job";

export function JobPostingForm() {
  const { createJob, loading } = useJobs();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jobData: CreateJobRequest = {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements,
      responsibilities: formData.responsibilities,
      salary:
        formData.salaryMin || formData.salaryMax
          ? {
              min: formData.salaryMin
                ? parseFloat(formData.salaryMin)
                : undefined,
              max: formData.salaryMax
                ? parseFloat(formData.salaryMax)
                : undefined,
              currency: formData.salaryCurrency,
              period: formData.salaryPeriod,
            }
          : undefined,
      location: formData.location,
      type: formData.type,
      experienceLevel: formData.experienceLevel,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      applicationDeadline: formData.applicationDeadline || undefined,
      isRemote: formData.isRemote,
    };

    const newJob = await createJob(jobData);
    if (newJob) {
      alert("Job posted successfully!");
      // Reset form
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
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="e.g. Software Engineer"
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Job Type *
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="experienceLevel"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Experience Level *
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              required
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="entry">Entry Level</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="applicationDeadline"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Application Deadline
            </label>
            <input
              type="date"
              id="applicationDeadline"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Location and Remote */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="e.g. New York, NY"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isRemote"
              name="isRemote"
              checked={formData.isRemote}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isRemote"
              className="ml-2 block text-sm text-gray-700"
            >
              Remote work available
            </label>
          </div>
        </div>
      </div>

      {/* Salary Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Salary Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label
              htmlFor="salaryMin"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Minimum Salary
            </label>
            <input
              type="number"
              id="salaryMin"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="50000"
            />
          </div>

          <div>
            <label
              htmlFor="salaryMax"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Maximum Salary
            </label>
            <input
              type="number"
              id="salaryMax"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="80000"
            />
          </div>

          <div>
            <label
              htmlFor="salaryCurrency"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Currency
            </label>
            <select
              id="salaryCurrency"
              name="salaryCurrency"
              value={formData.salaryCurrency}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="salaryPeriod"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Period
            </label>
            <select
              id="salaryPeriod"
              name="salaryPeriod"
              value={formData.salaryPeriod}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="hourly">Hourly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div>
        <label
          htmlFor="skills"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Required Skills *
        </label>
        <input
          type="text"
          id="skills"
          name="skills"
          required
          value={formData.skills}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="e.g. JavaScript, React, Node.js (comma-separated)"
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter skills separated by commas
        </p>
      </div>

      {/* Job Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Job Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          placeholder="Describe the role, responsibilities, and what makes this position exciting..."
        />
      </div>

      {/* Responsibilities */}
      <div>
        <label
          htmlFor="responsibilities"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Key Responsibilities
        </label>
        <textarea
          id="responsibilities"
          name="responsibilities"
          rows={4}
          value={formData.responsibilities}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          placeholder="List the main responsibilities (comma-separated)..."
        />
      </div>

      {/* Requirements */}
      <div>
        <label
          htmlFor="requirements"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Requirements *
        </label>
        <textarea
          id="requirements"
          name="requirements"
          required
          rows={4}
          value={formData.requirements}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          placeholder="List the required qualifications, experience, and skills..."
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </Button>
      </div>
    </form>
  );
}
