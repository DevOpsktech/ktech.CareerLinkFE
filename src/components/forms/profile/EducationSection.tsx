import React from "react";

interface EducationSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export function EducationSection({
  formData,
  onChange,
}: EducationSectionProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="university"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            University *
          </label>
          <input
            type="text"
            id="university"
            name="university"
            required
            value={formData.university}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            placeholder="University of Technology"
          />
        </div>

        <div>
          <label
            htmlFor="major"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Major/Field of Study *
          </label>
          <select
            id="major"
            name="major"
            required
            value={formData.major}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
          >
            <option value="">All Majors</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Business Administration">
              Business Administration
            </option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="graduationYear"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Graduation Year *
          </label>
          <select
            id="graduationYear"
            name="graduationYear"
            required
            value={formData.graduationYear}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
          >
            <option value="">Select Year</option>
            {Array.from({ length: 10 }, (_, i) => 2024 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
