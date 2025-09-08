/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import { companyApi } from "../api/companyApi";
import type { Company } from "../types/employer";
import type { CompanySearchFilters } from "../api/companyApi";
import { cleanApiResponse } from "../utils/api";
import { useToast } from "../contexts/ToastContext";

export const useCompanies = (filters: CompanySearchFilters = {}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
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

  const fetchCompanies = useCallback(
    async (searchFilters: CompanySearchFilters = {}) => {
      const filterKey = JSON.stringify({ ...filters, ...searchFilters });

      // Prevent duplicate requests
      if (lastFetchRef.current === filterKey && isInitializedRef.current) {
        return;
      }

      setLoading(true);
      setError(null);
      lastFetchRef.current = filterKey;

      try {
        const response = await companyApi.getCompanies({
          ...filters,
          ...searchFilters,
        });

        // Handle the API response structure
        const responseData = response.data || response;
        const cleanedCompanies = cleanApiResponse(
          responseData as Company[]
        ) as Company[];
        setCompanies(cleanedCompanies);

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
          err instanceof Error ? err.message : "Failed to fetch companies";
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [filters, showError]
  );

  const createCompany = useCallback(
    async (companyData: any): Promise<Company | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await companyApi.createCompany(companyData);
        const newCompany = response.data as Company;

        // Optimistically update the companies list
        setCompanies((prevCompanies) => [newCompany, ...prevCompanies]);

        showSuccess("Company created successfully!");
        return newCompany;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create company";
        setError(errorMessage);
        showError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError]
  );

  const updateCompany = useCallback(
    async (id: string, companyData: Partial<any>): Promise<Company | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await companyApi.updateCompany(id, companyData);
        // Some backends may return only partial data or a boolean; merge with existing
        setCompanies((prevCompanies) => {
          return prevCompanies.map((company) => {
            if (company.id !== id) return company;
            const apiData = (
              response && typeof response === "object"
                ? (response as any).data
                : null
            ) as Partial<Company> | null;
            const merged: Company = {
              ...company,
              ...(apiData || {}),
              ...companyData,
              id: company.id,
            } as Company;
            return merged;
          });
        });

        showSuccess("Company updated successfully!");
        // Try to return the merged object for the updated id
        const next = (response?.data as Company) || null;
        return next;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update company";
        setError(errorMessage);
        showError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError]
  );

  const deleteCompany = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await companyApi.deleteCompany(id);

        // Optimistically update the companies list
        setCompanies((prevCompanies) =>
          prevCompanies.filter((company) => company.id !== id)
        );

        showSuccess("Company deleted successfully!");
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete company";
        setError(errorMessage);
        showError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError]
  );

  const toggleVerification = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await companyApi.toggleCompanyVerification(id);
        const updatedCompany = response.data as Company;

        // Optimistically update the companies list
        setCompanies((prevCompanies) =>
          prevCompanies.map((company) =>
            company.id === id ? updatedCompany : company
          )
        );

        showSuccess("Company verification status updated!");
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to toggle verification";
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
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies,
    loading,
    error,
    pagination,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    toggleVerification,
    refetch: () => fetchCompanies(),
  };
};
