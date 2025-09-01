import { useState, useEffect, useCallback, useRef } from "react";
import type {
  CreateEmployerRequest,
  Employer,
  EmployerSearchFilters,
} from "../types/employer";
import { employersApi } from "../api/employerApi";
import { useToast } from "../contexts/ToastContext";

export const useEmployers = (filters: EmployerSearchFilters = {}) => {
  const [employers, setEmployers] = useState<Employer[]>([]);
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

  const fetchEmployers = useCallback(
    async (searchFilters: EmployerSearchFilters = {}) => {
      const filterKey = JSON.stringify({ ...filters, ...searchFilters });

      // Prevent duplicate requests
      if (lastFetchRef.current === filterKey && isInitializedRef.current) {
        return;
      }

      setLoading(true);
      setError(null);
      lastFetchRef.current = filterKey;

      try {
        const response = await employersApi.getEmployers({
          ...filters,
          ...searchFilters,
        });

        // Handle the new API response structure
        const responseData = response.data || response;

        // Check if response is an array or has $values property
        if (Array.isArray(responseData)) {
          setEmployers(responseData);
        } else if (
          responseData &&
          typeof responseData === "object" &&
          "$values" in responseData
        ) {
          setEmployers((responseData as { $values: Employer[] }).$values);
        } else {
          setEmployers([]);
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
          err instanceof Error ? err.message : "Failed to fetch employers";
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [filters, showError]
  );

  const createEmployer = useCallback(
    async (employerData: CreateEmployerRequest): Promise<Employer | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await employersApi.createEmployer(employerData);
        const responseData = response.data || response;
        const newEmployer = responseData as Employer;

        // Optimistically update the employers list
        setEmployers((prevEmployers) => [newEmployer, ...prevEmployers]);

        showSuccess("Employer created successfully!");
        return newEmployer;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create employer";
        setError(errorMessage);
        showError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError]
  );

  const updateEmployer = useCallback(
    async (
      id: string,
      employerData: Partial<CreateEmployerRequest>
    ): Promise<Employer | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await employersApi.updateEmployer(id, employerData);
        const responseData = response.data || response;
        const updatedEmployer = responseData as Employer;

        // Optimistically update the employers list
        setEmployers((prevEmployers) =>
          prevEmployers.map((employer) =>
            employer.id === id ? updatedEmployer : employer
          )
        );

        showSuccess("Employer updated successfully!");
        return updatedEmployer;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update employer";
        setError(errorMessage);
        showError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError]
  );

  const deleteEmployer = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await employersApi.deleteEmployer(id);

        // Optimistically update the employers list
        setEmployers((prevEmployers) =>
          prevEmployers.filter((employer) => employer.id !== id)
        );

        showSuccess("Employer deleted successfully!");
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete employer";
        setError(errorMessage);
        showError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError]
  );

  useEffect(() => {
    fetchEmployers();
  }, [fetchEmployers]);

  return {
    employers,
    loading,
    error,
    pagination,
    fetchEmployers,
    createEmployer,
    updateEmployer,
    deleteEmployer,
    refetch: () => fetchEmployers(),
  };
};

export const useEmployer = (id?: string, userId?: string) => {
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useToast();
  const lastFetchRef = useRef<string>("");

  const fetchEmployer = useCallback(async () => {
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
        ? await employersApi.getEmployerById(id)
        : await employersApi.getEmployerByUserId(userId!);

      // Handle the new API response structure
      const responseData = response.data || response;
      setEmployer(responseData as Employer);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch employer";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id, userId, showError]);

  useEffect(() => {
    fetchEmployer();
  }, [fetchEmployer]);

  return {
    employer,
    loading,
    error,
    refetch: fetchEmployer,
  };
};
