import { useState, useEffect, useCallback } from "react";
import { Eye, RefreshCw, Building, User } from "lucide-react";
import { Button } from "../ui/Button";
import { DataTable } from "../ui/DataTable";
import Loader from "../ui/Loader";
import { adminApi, type CvView } from "../../api/adminApi";
import { useToast } from "../../contexts/ToastContext";
import { cleanApiResponse } from "../../utils/api";

export function CvViewsManagement() {
  const [cvViews, setCvViews] = useState<CvView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showError, showSuccess } = useToast();

  const fetchCvViews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getCvViews();
      const cleanedData = cleanApiResponse(response.data);
      const views = Array.isArray(cleanedData) ? cleanedData : [];
      setCvViews(views);
    } catch (err) {
      console.error("Error fetching CV views:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load CV views";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  useEffect(() => {
    fetchCvViews();
  }, [fetchCvViews]);

  // Transform CV views data for the DataTable
  const transformedCvViewsData = cvViews.map((view) => ({
    id: view.id,
    studentName: view.student.name,
    employerName: view.employer.name,
    companyName: view.company.name,
    viewedAt: new Date(view.viewedAt).toLocaleString(),
    viewedDate: new Date(view.viewedAt).toLocaleDateString(),
  }));

  const cvViewsColumns = [
    {
      key: "studentName",
      label: "Student Name",
    },
    {
      key: "employerName",
      label: "Employer Name",
    },
    {
      key: "companyName",
      label: "Company",
    },
    {
      key: "viewedAt",
      label: "Viewed At",
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <Loader text="Loading CV views..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-red-600 mb-4">Error loading CV views: {error}</p>
          <Button onClick={fetchCvViews} variant="primary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              CV Views Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Track when employers view student CVs
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchCvViews}
            disabled={loading}
            className="flex items-center space-x-2 w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {cvViews.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg font-medium">
            No CV views recorded yet
          </p>
          <p className="text-gray-500 text-sm mt-1">
            CV views will appear here when employers view student profiles
          </p>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">Total Views</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {cvViews.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">Unique Students</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Set(cvViews.map((view) => view.studentId)).size}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:col-span-2 lg:col-span-1">
                <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                  <Building className="w-5 h-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">Active Companies</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Set(cvViews.map((view) => view.companyName)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            columns={cvViewsColumns}
            data={transformedCvViewsData}
            showActions={false}
          />
        </>
      )}
    </div>
  );
}
