import React from "react";

interface SkillsSectionProps {
  formData: {
    skills: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SkillsSection({ formData, onChange }: SkillsSectionProps) {
  return (
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
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        placeholder="e.g. JavaScript, React, Node.js (comma-separated)"
      />
      <p className="mt-1 text-sm text-gray-500">
        Enter skills separated by commas
      </p>
    </div>
  );
}
