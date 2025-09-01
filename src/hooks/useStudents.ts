import { useState, useEffect, useCallback, useRef } from "react";
import { studentsApi } from "../api/studentsApi";
import type {
  Student,
  StudentSearchFilters,
  UpdateStudentProfileRequest,
} from "../types/student";
import { useToast } from "../contexts/ToastContext";

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

  const { showSuccess, showError } = useToast();
  const lastFetchRef = useRef<string>("");
  const isInitializedRef = useRef(false);

  const fetchStudents = useCallback(
    async (searchFilters: StudentSearchFilters = {}) => {
      const filterKey = JSON.stringify({ ...filters, ...searchFilters });

      // Prevent duplicate requests
      if (lastFetchRef.current === filterKey && isInitializedRef.current) {
        return;
      }

      setLoading(true);
      setError(null);
      lastFetchRef.current = filterKey;

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

        isInitializedRef.current = true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch students";
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [filters, showError]
  );

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

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
  const { showSuccess, showError } = useToast();
  const lastFetchRef = useRef<string>("");

  const fetchStudent = useCallback(async () => {
    if (!id && !userId) return;

    const fetchKey = id || userId || "";

    // Prevent duplicate requests
    if (lastFetchRef.current === fetchKey) {
      return;
    }

    lastFetchRef.current = fetchKey;
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
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch student";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id, userId, showError]);

  const updateProfile = useCallback(
    async (
      profileData: UpdateStudentProfileRequest
    ): Promise<Student | null> => {
      if (!student) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await studentsApi.updateStudentProfile(profileData);
        const responseData = response.data || response;
        const updatedStudent = responseData as Student;

        // Optimistically update the student
        setStudent(updatedStudent);

        showSuccess("Profile updated successfully!");
        return updatedStudent;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update profile";
        setError(errorMessage);
        showError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [student, showSuccess, showError]
  );

  const addSkill = useCallback(
    async (skillData: {
      skillId: string;
      skillName: string;
      category: string;
      proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
    }): Promise<boolean> => {
      if (!student) return false;

      setLoading(true);
      setError(null);

      try {
        const response = await studentsApi.addStudentSkill(
          student.id,
          skillData
        );
        const responseData = response.data || response;
        const updatedStudent = responseData as Student;

        // Optimistically update the student
        setStudent(updatedStudent);

        showSuccess("Skill added successfully!");
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add skill";
        setError(errorMessage);
        showError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [student, showSuccess, showError]
  );

  const removeSkill = useCallback(
    async (skillId: string): Promise<boolean> => {
      if (!student) return false;

      setLoading(true);
      setError(null);

      try {
        const response = await studentsApi.removeStudentSkill(
          student.id,
          skillId
        );
        const responseData = response.data || response;
        const updatedStudent = responseData as Student;

        // Optimistically update the student
        setStudent(updatedStudent);

        showSuccess("Skill removed successfully!");
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to remove skill";
        setError(errorMessage);
        showError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [student, showSuccess, showError]
  );

  const addExperience = useCallback(
    async (
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
        const updatedStudent = responseData as Student;

        // Optimistically update the student
        setStudent(updatedStudent);

        showSuccess("Experience added successfully!");
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add experience";
        setError(errorMessage);
        showError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [student, showSuccess, showError]
  );

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

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
