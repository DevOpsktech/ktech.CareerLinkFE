import { useState, useEffect } from "react";
import type { CreateEmployerRequest, Employer, EmployerSearchFilters } from "../types/employer";
import type { PaginatedResponse } from "../types/api";
import { employersApi } from "../api/employerApi";

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

  const fetchEmployers = async (searchFilters: EmployerSearchFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response: PaginatedResponse<Employer> =
        await employersApi.getEmployers({
          ...filters,
          ...searchFilters,
        });

      setEmployers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch employers"
      );
    } finally {
      setLoading(false);
    }
  };

  const createEmployer = async (
    employerData: CreateEmployerRequest
  ): Promise<Employer | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await employersApi.createEmployer(employerData);
      await fetchEmployers(); // Refresh the list
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create employer"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployer = async (
    id: string,
    employerData: Partial<CreateEmployerRequest>
  ): Promise<Employer | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await employersApi.updateEmployer(id, employerData);
      await fetchEmployers(); // Refresh the list
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update employer"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployer = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await employersApi.deleteEmployer(id);
      await fetchEmployers(); // Refresh the list
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete employer"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

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

  const fetchEmployer = async () => {
    if (!id && !userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = id
        ? await employersApi.getEmployerById(id)
        : await employersApi.getEmployerByUserId(userId!);
      setEmployer(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch employer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployer();
  }, [id, userId]);

  return {
    employer,
    loading,
    error,
    refetch: fetchEmployer,
  };
};
