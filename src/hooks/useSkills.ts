import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/api";

export interface Skill {
  id: string;
  name: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSkillRequest {
  name: string;
  category: string;
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true); // Start with true to indicate initial loading
  const [error, setError] = useState<string | null>(null);

  // Fetch all skills
  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/skills`);
      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }
      const data = await response.json();

      // Handle the specific API response structure with $values
      const skillsArray = Array.isArray(data)
        ? data
        : data.$values && Array.isArray(data.$values)
        ? data.$values
        : data.skills && Array.isArray(data.skills)
        ? data.skills
        : data.data && Array.isArray(data.data)
        ? data.data
        : [];

      setSkills(skillsArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setSkills([]); // Ensure skills is always an array on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch skill by ID
  const fetchSkillById = async (id: string): Promise<Skill | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/skills/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch skill");
      }
      const data = await response.json();

      // Handle the response structure for single skill
      return data.$values ? data.$values[0] : data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    }
  };

  // Create new skill
  const createSkill = async (
    skillData: CreateSkillRequest
  ): Promise<Skill | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillData),
      });

      if (!response.ok) {
        throw new Error("Failed to create skill");
      }

      const newSkill = await response.json();

      // Handle the response structure - extract the actual skill object
      const skillObject = newSkill.$values ? newSkill.$values[0] : newSkill;

      setSkills((prev) => [...prev, skillObject]);
      return skillObject;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Initialize skills on mount
  useEffect(() => {
    fetchSkills();
  }, []);

  return {
    skills,
    loading,
    error,
    fetchSkills,
    fetchSkillById,
    createSkill,
  };
}
