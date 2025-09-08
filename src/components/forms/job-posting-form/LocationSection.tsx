import { FormField } from "../../ui/FormField";
import type { BasicInfoProps } from "../../../types/job-post-form";

export default function LocationSection({
  formData,
  onChange,
}: BasicInfoProps) {
  const locationSection = {
    title: "Location",
    fields: [
      {
        id: "location",
        label: "Location",
        type: "text" as const,
        placeholder: "e.g. New York, NY",
        required: true,
      },
    ],
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {locationSection.title}{" "}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locationSection.fields.map((field) => (
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
