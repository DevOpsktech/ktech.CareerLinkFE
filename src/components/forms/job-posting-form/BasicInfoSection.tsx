import { FormField } from "../../ui/FormField";
import type { BasicInfoProps } from "../../../types/job-post-form";

export default function BasicInfoSection({
  formData,
  onChange,
}: BasicInfoProps) {
  const fields = [
    {
      id: "title",
      label: "Job Title",
      type: "text" as const,
      placeholder: "e.g. Software Engineer",
      required: true,
    },
    {
      id: "type",
      label: "Job Type",
      type: "select" as const,
      required: true,
      options: [
        { value: "full-time", label: "Full-time" },
        { value: "part-time", label: "Part-time" },
        { value: "internship", label: "Internship" },
      ],
    },
    {
      id: "experienceLevel",
      label: "Experience Level",
      type: "select" as const,
      required: true,
      options: [
        { value: "entry", label: "Entry Level" },
        { value: "junior", label: "Junior" },
        { value: "mid", label: "Mid Level" },
        { value: "senior", label: "Senior" },
      ],
    },
    {
      id: "applicationDeadline",
      label: "Application Deadline",
      type: "date" as const,
    },
  ];

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Basic Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <FormField
            key={field.id}
            {...field}
            value={formData[field.id] || ""}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}
