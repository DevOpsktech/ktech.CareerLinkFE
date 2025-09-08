import React, { useState, useRef, useEffect } from "react";
import {
  useSkills,
  type Skill,
  type CreateSkillRequest,
} from "../../../hooks/useSkills";
import { useAuth } from "../../../contexts/AuthContext";

interface SkillsSectionProps {
  formData: {
    skills: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SkillsSection({ formData, onChange }: SkillsSectionProps) {
  const { skills = [], loading, createSkill } = useSkills(); // Default to empty array
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize selected skills from formData
  useEffect(() => {
    if (formData.skills && Array.isArray(skills) && skills.length > 0) {
      const skillNames = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
      const matchedSkills = skills.filter((skill) =>
        skillNames.includes(skill.name)
      );
      setSelectedSkills(matchedSkills);
    }
  }, [formData.skills, skills]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsCreatingSkill(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter skills based on search term and exclude already selected
  const filteredSkills = (skills || []).filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedSkills.find((selected) => selected.id === skill.id)
  );

  // Check if search term matches existing skill
  const exactMatch = (skills || []).find(
    (skill) => skill.name.toLowerCase() === searchTerm.toLowerCase()
  );

  // Update formData when selectedSkills changes
  const updateFormData = (newSelectedSkills: Skill[]) => {
    const skillsString = newSelectedSkills
      .map((skill) => skill.name)
      .join(", ");
    const syntheticEvent = {
      target: {
        name: "skills",
        value: skillsString,
        type: "text",
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  const handleSkillSelect = (skill: Skill) => {
    const newSelectedSkills = [...selectedSkills, skill];
    setSelectedSkills(newSelectedSkills);
    updateFormData(newSelectedSkills);
    setSearchTerm("");
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const handleSkillRemove = (skillToRemove: Skill) => {
    const newSelectedSkills = selectedSkills.filter(
      (skill) => skill.id !== skillToRemove.id
    );
    setSelectedSkills(newSelectedSkills);
    updateFormData(newSelectedSkills);
  };

  const handleCreateSkill = async () => {
    if (!isAdmin) return; // Only Admin can create skills
    if (!newSkillName.trim() || !newSkillCategory.trim()) return;

    const skillData: CreateSkillRequest = {
      name: newSkillName.trim(),
      category: newSkillCategory.trim(),
    };

    const createdSkill = await createSkill(skillData);
    if (createdSkill) {
      handleSkillSelect(createdSkill);
      setNewSkillName("");
      setNewSkillCategory("");
      setIsCreatingSkill(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredSkills.length > 0) {
        handleSkillSelect(filteredSkills[0]);
      } else if (searchTerm && !exactMatch && isAdmin) {
        setIsCreatingSkill(true);
        setNewSkillName(searchTerm);
      }
    } else if (
      e.key === "Backspace" &&
      !searchTerm &&
      selectedSkills.length > 0
    ) {
      handleSkillRemove(selectedSkills[selectedSkills.length - 1]);
    }
  };

  const categories = [
    "Frontend Development",
    "Backend Development",
    "Database",
    "DevOps",
    "Mobile Development",
    "Design",
    "Project Management",
    "Other",
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <label
        htmlFor="skills"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Required Skills *
      </label>

      {/* Selected Skills Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedSkills.map((skill) => (
          <div
            key={skill.id}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
          >
            <span>{skill.name}</span>
            <button
              type="button"
              onClick={() => handleSkillRemove(skill)}
              className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleInputKeyDown}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Search and select skills..."
        />

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-2 text-gray-500">Loading skills...</div>
            ) : (
              <>
                {/* Existing Skills */}
                {filteredSkills.length > 0 && (
                  <div>
                    {filteredSkills.slice(0, 10).map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => handleSkillSelect(skill)}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex justify-between items-center"
                      >
                        <span>{skill.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {skill.category}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Create New Skill Option */}
                {isAdmin && searchTerm && !exactMatch && !isCreatingSkill && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingSkill(true);
                      setNewSkillName(searchTerm);
                    }}
                    className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-t border-gray-200"
                  >
                    + Create "{searchTerm}" as new skill
                  </button>
                )}

                {/* Create Skill Form */}
                {isAdmin && isCreatingSkill && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Skill Name
                        </label>
                        <input
                          type="text"
                          value={newSkillName}
                          onChange={(e) => setNewSkillName(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter skill name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={newSkillCategory}
                          onChange={(e) => setNewSkillCategory(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleCreateSkill}
                          disabled={
                            !newSkillName.trim() ||
                            !newSkillCategory.trim() ||
                            loading
                          }
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {loading ? "Creating..." : "Create"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingSkill(false);
                            setNewSkillName("");
                            setNewSkillCategory("");
                          }}
                          className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* No Results */}
                {!loading && filteredSkills.length === 0 && !searchTerm && (
                  <div className="px-4 py-2 text-gray-500">
                    Start typing to search skills...
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <p className="mt-1 text-sm text-gray-500">
        {isAdmin
          ? "Search and select skills, or create new ones if they don't exist"
          : "Search and select skills from the existing list. Only admins can add new skills."}
      </p>
    </div>
  );
}
