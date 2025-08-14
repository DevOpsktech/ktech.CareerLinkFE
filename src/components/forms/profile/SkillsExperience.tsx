import React from "react";

interface SkillsExperienceProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function SkillsExperience({
  formData,
  onChange,
}: SkillsExperienceProps) {
  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="skills"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Skills *
        </label>
        <textarea
          id="skills"
          name="skills"
          required
          rows={3}
          value={formData.skills}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
          placeholder="List your technical and soft skills (e.g., JavaScript, React, Project Management, Communication)"
        />
      </div>

      <div>
        <label
          htmlFor="experience"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Experience & Projects
        </label>
        <textarea
          id="experience"
          name="experience"
          rows={4}
          value={formData.experience}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
          placeholder="Describe your work experience, internships, and notable projects..."
        />
      </div>
    </div>
  );
}
