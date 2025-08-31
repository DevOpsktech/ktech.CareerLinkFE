import React from "react";

interface RequirementsSectionProps {
  formData: {
    requirements: string;
  };
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function RequirementsSection({
  formData,
  onChange,
}: RequirementsSectionProps) {
  return (
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
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
        placeholder="List the required qualifications, experience, and skills (comma-separated)..."
      />
    </div>
  );
}
