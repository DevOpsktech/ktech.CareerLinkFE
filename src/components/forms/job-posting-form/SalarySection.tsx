import { FormField } from "../../ui/FormField";
import type { BasicInfoProps } from "../../../types/job-post-form";

export default function SalarySection({ formData, onChange }: BasicInfoProps) {
  const salarySection = {
    title: "Salary Information",
    fields: [
      {
        id: "salaryMin",
        label: "Minimum Salary",
        type: "number" as const,
        placeholder: "50000",
      },
      {
        id: "salaryMax",
        label: "Maximum Salary",
        type: "number" as const,
        placeholder: "80000",
      },
      {
        id: "salaryCurrency",
        label: "Currency",
        type: "select" as const,
        options: [
          { value: "USD", label: "USD" },
          { value: "EUR", label: "EUR" },
          { value: "GBP", label: "GBP" },
        ],
      },
      {
        id: "salaryPeriod",
        label: "Period",
        type: "select" as const,
        options: [
          { value: "hourly", label: "Hourly" },
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Yearly" },
        ],
      },
    ],
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {salarySection.title}{" "}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {salarySection.fields.map((field) => (
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
