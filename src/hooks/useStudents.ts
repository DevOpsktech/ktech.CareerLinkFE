import { useState, useEffect } from "react";
import { studentsApi } from "../api/studentsApi";
import type {
  Student,
  StudentSearchFilters,
  UpdateStudentProfileRequest,
} from "../types/student";

export const useStudents = (filters: StudentSearchFilters = {}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchStudents = async (searchFilters: StudentSearchFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await studentsApi.getStudents({
        ...filters,
        ...searchFilters,
      });

      // Handle the new API response structure
      const responseData = response.data || response;

      // Check if response is an array or has $values property
      if (Array.isArray(responseData)) {
        setStudents(responseData);
      } else if (
        responseData &&
        typeof responseData === "object" &&
        "$values" in responseData
      ) {
        setStudents((responseData as { $values: Student[] }).$values);
      } else {
        setStudents([]);
      }

      // Handle pagination if available
      if (
        responseData &&
        typeof responseData === "object" &&
        "pagination" in responseData
      ) {
        setPagination(
          (responseData as { pagination: typeof pagination }).pagination
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    students,
    loading,
    error,
    pagination,
    fetchStudents,
    refetch: () => fetchStudents(),
  };
};

export const useStudent = (id?: string, userId?: string) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudent = async () => {
    if (!id && !userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = id
        ? await studentsApi.getStudentById(id)
        : await studentsApi.getStudentByUserId(userId!);

      // Handle the new API response structure
      const responseData = response.data || response;
      setStudent(responseData as Student);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch student");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (
    profileData: UpdateStudentProfileRequest
  ): Promise<Student | null> => {
    if (!student) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await studentsApi.updateStudentProfile(
        student.id,
        profileData
      );
      const responseData = response.data || response;
      setStudent(responseData as Student);
      return responseData as Student;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async (skillData: {
    skillId: string;
    skillName: string;
    category: string;
    proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
  }): Promise<boolean> => {
    if (!student) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await studentsApi.addStudentSkill(student.id, skillData);
      const responseData = response.data || response;
      setStudent(responseData as Student);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add skill");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeSkill = async (skillId: string): Promise<boolean> => {
    if (!student) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await studentsApi.removeStudentSkill(
        student.id,
        skillId
      );
      const responseData = response.data || response;
      setStudent(responseData as Student);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove skill");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addExperience = async (
    experienceData: Omit<Student["experiences"][0], "id">
  ): Promise<boolean> => {
    if (!student) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await studentsApi.addStudentExperience(
        student.id,
        experienceData
      );
      const responseData = response.data || response;
      setStudent(responseData as Student);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add experience");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId]);

  return {
    student,
    loading,
    error,
    updateProfile,
    addSkill,
    removeSkill,
    addExperience,
    refetch: fetchStudent,
  };
};
