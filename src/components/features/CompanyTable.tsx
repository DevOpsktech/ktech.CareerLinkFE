import { DataTable } from "../ui/DataTable";
import { useCompanies } from "../../hooks/useCompanies";
import { Building2, Globe, Eye, Edit, Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { ConfirmModal } from "../ui/ConfirmModal";
import type { Company } from "../../types/employer";
import { useState } from "react";

const CompanyTable = () => {
  const { companies, loading, error, updateCompany, deleteCompany } =
    useCompanies();
  const [selectedCompany, setSelectedCompany] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Company>>({});

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
            {typeof row.website === "string" && row.website !== "N/A" && (
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
    // {
    //   key: "location",
    //   label: "Location",
    //   render: (row: Record<string, unknown>) => (
    //     <div className="flex items-center text-sm text-gray-600">
    //       <MapPin size={14} className="mr-1" />
    //       {String(row.location)}
    //     </div>
    //   ),
    // },
    // {
    //   key: "companySize",
    //   label: "Size",
    //   render: (row: Record<string, unknown>) => (
    //     <div className="flex items-center text-sm text-gray-600">
    //       <Users size={14} className="mr-1" />
    //       {String(row.companySize)}
    //     </div>
    //   ),
    // },
    // {
    //   key: "foundedYear",
    //   label: "Founded",
    //   render: (row: Record<string, unknown>) => (
    //     <div className="flex items-center text-sm text-gray-600">
    //       <Calendar size={14} className="mr-1" />
    //       {String(row.foundedYear)}
    //     </div>
    //   ),
    // },
    {
      key: "createdAt",
      label: "Joined",
      render: (row: Record<string, unknown>) => (
        <div className="text-sm text-gray-600">{String(row.createdAt)}</div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Record<string, unknown>) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedCompany(row);
              setIsViewOpen(true);
            }}
            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
            aria-label="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedCompany(row);
              setEditForm({
                id: String(row.id),
                name: String(row.name || ""),
                industry: String(row.industry || ""),
                website: String(row.website || ""),
                companySize:
                  (row.companySize as Company["companySize"]) || undefined,
                foundedYear:
                  typeof row.foundedYear === "number"
                    ? row.foundedYear
                    : Number(
                        String(row.foundedYear || "").replace(/[^0-9]/g, "")
                      ) || undefined,
              });
              setIsEditOpen(true);
            }}
            className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
            aria-label="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedCompany(row);
              setIsConfirmOpen(true);
            }}
            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
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

      {/* View Details Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Company Details"
        size="lg"
      >
        {selectedCompany && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {selectedCompany.logoUrl &&
              typeof selectedCompany.logoUrl === "string" ? (
                <img
                  src={String(selectedCompany.logoUrl)}
                  alt={String(selectedCompany.name)}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Building2 size={20} className="text-gray-500" />
                </div>
              )}
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {String(selectedCompany.name)}
                </div>
                <div className="text-sm text-gray-600">
                  {String(selectedCompany.industry)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Website</div>
                <div className="text-sm">
                  {typeof selectedCompany.website === "string" &&
                  selectedCompany.website !== "N/A" ? (
                    <a
                      href={
                        String(selectedCompany.website).startsWith("http")
                          ? String(selectedCompany.website)
                          : `https://${selectedCompany.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {String(selectedCompany.website)}
                    </a>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Location</div>
                <div className="text-sm">
                  {String(selectedCompany.location || "N/A")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Company Size</div>
                <div className="text-sm">
                  {String(selectedCompany.companySize || "N/A")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Founded Year</div>
                <div className="text-sm">
                  {String(selectedCompany.foundedYear || "N/A")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Verified</div>
                <div className="text-sm">
                  {String(selectedCompany.isVerified ? "Yes" : "No")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Joined</div>
                <div className="text-sm">
                  {String(selectedCompany.createdAt)}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Company"
        size="lg"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!editForm.id) return;
            const { id, ...payload } = editForm as Partial<Company> & {
              id: string;
            };
            await updateCompany(id, payload);
            setIsEditOpen(false);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={editForm.name || ""}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <input
                type="text"
                value={editForm.industry || ""}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, industry: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="text"
                value={editForm.website || ""}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, website: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Size
              </label>
              <select
                value={editForm.companySize || ""}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    companySize: (e.target.value ||
                      undefined) as Company["companySize"],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Founded Year
              </label>
              <input
                type="number"
                value={editForm.foundedYear || ""}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    foundedYear: Number(e.target.value) || undefined,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={1800}
                max={new Date().getFullYear()}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Company"
        message={`Are you sure you want to delete "${
          (selectedCompany?.name as string) || "this company"
        }"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          if (selectedCompany?.id) {
            await deleteCompany(String(selectedCompany.id));
          }
          setIsConfirmOpen(false);
          setSelectedCompany(null);
        }}
        onCancel={() => {
          setIsConfirmOpen(false);
          setSelectedCompany(null);
        }}
      />
    </div>
  );
};

export default CompanyTable;
