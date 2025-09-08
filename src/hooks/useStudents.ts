import { useState, useEffect, useCallback, useRef } from "react";
import { studentsApi } from "../api/studentsApi";
import type {
  Student,
  StudentSearchFilters,
  UpdateStudentProfileRequest,
} from "../types/student";
import { useToast } from "../contexts/ToastContext";
import { cleanApiResponse } from "../utils/api";

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

  const { showError } = useToast();
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

        const responseData =
          (response as unknown as { data?: unknown }).data ?? response;

        let parsedStudents: Student[] = [];
        let newPagination = {
          page: 1,
          limit: (filters.limit || 10) as number,
          total: 0,
          totalPages: 0,
        };

        if (responseData && typeof responseData === "object") {
          const obj = responseData as Record<string, unknown>;

          // New .NET style: students.$values + top-level pagination
          if (
            "students" in obj &&
            obj.students &&
            typeof obj.students === "object" &&
            "$values" in (obj.students as Record<string, unknown>) &&
            Array.isArray((obj.students as Record<string, unknown>).$values)
          ) {
            parsedStudents = cleanApiResponse<Student[]>(
              (obj.students as { $values: unknown[] }).$values
            );

            if ("totalCount" in obj) {
              const totalCount =
                (obj.totalCount as number) ?? parsedStudents.length;
              const page = (obj.page as number) ?? 1;
              const pageSize = (obj.pageSize as number) ?? newPagination.limit;
              const totalPages =
                (obj.totalPages as number) ?? Math.ceil(totalCount / pageSize);

              newPagination = {
                page,
                limit: pageSize,
                total: totalCount,
                totalPages,
              };
            }
          }
          // Sometimes backend may respond with $values directly
          else if (
            "$values" in obj &&
            Array.isArray((obj as { $values: unknown[] }).$values)
          ) {
            parsedStudents = cleanApiResponse<Student[]>(
              (obj as { $values: unknown[] }).$values
            );
            newPagination = {
              page: 1,
              limit: newPagination.limit,
              total: parsedStudents.length,
              totalPages: Math.ceil(
                parsedStudents.length / newPagination.limit
              ),
            };
          }
          // Legacy pagination wrapper
          else if ("pagination" in obj && obj.pagination) {
            // When legacy pagination exists, try to read data array
            if (
              "data" in obj &&
              Array.isArray((obj as { data: unknown[] }).data)
            ) {
              parsedStudents = cleanApiResponse<Student[]>(
                (obj as { data: unknown[] }).data
              );
            }
            const p = obj.pagination as Record<string, number>;
            newPagination = {
              page: (p.page as number) || 1,
              limit: (p.limit as number) || newPagination.limit,
              total: (p.total as number) || parsedStudents.length,
              totalPages:
                (p.totalPages as number) ||
                Math.ceil(
                  ((p.total as number) || parsedStudents.length) /
                    ((p.limit as number) || newPagination.limit)
                ),
            };
          }
          // Plain array
          else if (Array.isArray(responseData)) {
            parsedStudents = cleanApiResponse<Student[]>(responseData);
            newPagination = {
              page: 1,
              limit: newPagination.limit,
              total: parsedStudents.length,
              totalPages: Math.ceil(
                parsedStudents.length / newPagination.limit
              ),
            };
          }
        }

        setStudents(parsedStudents);
        setPagination(newPagination);
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
    // Support fetching current student's profile (by auth token)
    const isProfileFetch = !id && !userId;

    if (!id && !userId && !isProfileFetch) return;

    const fetchKey = id || userId || "profile";

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
        : userId
        ? await studentsApi.getStudentByUserId(userId)
        : await studentsApi.getStudentProfile();

      const responseData =
        (response as unknown as { data?: unknown }).data ?? response;
      const cleaned = cleanApiResponse<Student>(responseData);
      setStudent(cleaned);
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
        const responseData =
          (response as unknown as { data?: unknown }).data ?? response;
        const updatedStudent = cleanApiResponse<Student>(responseData);

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
        const responseData =
          (response as unknown as { data?: unknown }).data ?? response;
        const updatedStudent = cleanApiResponse<Student>(responseData);

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
        const responseData =
          (response as unknown as { data?: unknown }).data ?? response;
        const updatedStudent = cleanApiResponse<Student>(responseData);

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
        const responseData =
          (response as unknown as { data?: unknown }).data ?? response;
        const updatedStudent = cleanApiResponse<Student>(responseData);

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
