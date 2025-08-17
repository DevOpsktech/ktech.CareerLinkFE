import React from "react";

interface ResponsibilitiesSectionProps {
  formData: {
    responsibilities: string;
  };
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function ResponsibilitiesSection({
  formData,
  onChange,
}: ResponsibilitiesSectionProps) {
  return (
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
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
        placeholder="List the main responsibilities (comma-separated)..."
      />
    </div>
  );
}
