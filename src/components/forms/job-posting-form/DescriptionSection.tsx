import React from "react";

interface DescriptionSectionProps {
  formData: {
    description: string;
  };
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function DescriptionSection({
  formData,
  onChange,
}: DescriptionSectionProps) {
  return (
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
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
        placeholder="Describe the role, responsibilities, and what makes this position exciting..."
      />
    </div>
  );
}
