import { DataTable } from "../ui/DataTable";
import { useCompanies } from "../../hooks/useCompanies";
import { Building2, Globe, MapPin, Users, Calendar } from "lucide-react";

const CompanyTable = () => {
  const { companies, loading, error } = useCompanies();

  // Transform companies data to match the expected format for DataTable
  const transformedCompaniesData = companies.map((company) => ({
    id: company.id,
    name: company.name,
    industry: company.industry,
    location:
      `${company.city || ""} ${company.state || ""} ${
        company.country || ""
      }`.trim() || "N/A",
    companySize: company.companySize || "N/A",
    foundedYear: company.foundedYear || "N/A",
    isVerified: company.isVerified,
    website: company.website || "N/A",
    logoUrl: company.logoUrl,
    createdAt: new Date(company.createdAt).toLocaleDateString(),
  }));

  // Company table columns with custom render functions
  const companyColumns = [
    {
      key: "name",
      label: "Company Name",
      render: (row: Record<string, unknown>) => (
        <div className="flex items-center space-x-3">
          {row.logoUrl && typeof row.logoUrl === "string" ? (
            <img
              src={row.logoUrl}
              alt={String(row.name)}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <Building2 size={16} className="text-gray-500" />
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{String(row.name)}</div>
            {row.website && row.website !== "N/A" && (
              <div className="flex items-center text-xs text-gray-500">
                <Globe size={12} className="mr-1" />
                <a
                  href={
                    String(row.website).startsWith("http")
                      ? String(row.website)
                      : `https://${row.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  {String(row.website)}
                </a>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "industry",
      label: "Industry",
      render: (row: Record<string, unknown>) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {String(row.industry)}
        </span>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (row: Record<string, unknown>) => (
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={14} className="mr-1" />
          {String(row.location)}
        </div>
      ),
    },
    {
      key: "companySize",
      label: "Size",
      render: (row: Record<string, unknown>) => (
        <div className="flex items-center text-sm text-gray-600">
          <Users size={14} className="mr-1" />
          {String(row.companySize)}
        </div>
      ),
    },
    {
      key: "foundedYear",
      label: "Founded",
      render: (row: Record<string, unknown>) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={14} className="mr-1" />
          {String(row.foundedYear)}
        </div>
      ),
    },
    {
      key: "isVerified",
      label: "Status",
      render: (row: Record<string, unknown>) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.isVerified
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.isVerified ? "Verified" : "Pending"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (row: Record<string, unknown>) => (
        <div className="text-sm text-gray-600">{String(row.createdAt)}</div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Companies</h2>
        </div>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Companies</h2>
        </div>
        <div className="p-6 text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Companies</h2>
      </div>
      <DataTable columns={companyColumns} data={transformedCompaniesData} />
    </div>
  );
};

export default CompanyTable;
