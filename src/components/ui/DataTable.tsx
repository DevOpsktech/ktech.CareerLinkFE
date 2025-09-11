import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

interface Column {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (row: any) => React.ReactNode; // Add render function support
}

interface DataTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  showActions?: boolean;
  employerActions?: boolean;
  editJobs?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit?: (row: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDelete?: (row: any) => void;
}

export function DataTable({
  columns,
  data,
  showActions = false,
  employerActions = false,
  editJobs = false,
  onEdit,
  onDelete,
}: DataTableProps) {
  const navigate = useNavigate();

  // Mobile card view for small screens
  const MobileCardView = () => (
    <div className="space-y-4 p-4">
      {data.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-900">
          No data found
        </div>
      ) : (
        data.map((row, index) => (
          <div
            key={row.id || index}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="space-y-3">
              {columns.map((column) => (
                <div key={column.key} className="flex flex-col">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    {column.label}
                  </div>
                  <div className="text-sm text-gray-900">
                    {column.render ? (
                      column.render(row)
                    ) : (
                      <span>
                        {typeof row[column.key] === "object" &&
                        row[column.key] !== null
                          ? "[Object]"
                          : String(row[column.key] || "")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {(showActions || employerActions) && (
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Actions
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {showActions && (
                      <>
                        <button
                          onClick={() => navigate(`/jobs/${row.id}`)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        {editJobs && (
                          <button
                            onClick={() => onEdit && onEdit(row)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete && onDelete(row)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        )}
                      </>
                    )}
                    {employerActions && (
                      <>
                        <Button
                          type="button"
                          variant="red"
                          size="sm"
                          className="text-xs"
                        >
                          Reject
                        </Button>
                        <Button
                          type="submit"
                          variant="secondary"
                          size="sm"
                          className="text-xs"
                        >
                          Accept
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  // Desktop table view
  const DesktopTableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            {showActions && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 && (
            <tr className="text-center  text-sm text-gray-900">
              <td
                className="px-6 py-4"
                colSpan={columns.length + (showActions ? 1 : 0)}
              >
                No data found
              </td>
            </tr>
          )}
          {data.map((row, index) => (
            <tr key={row.id || index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render ? (
                    column.render(row)
                  ) : (
                    <span>
                      {typeof row[column.key] === "object" &&
                      row[column.key] !== null
                        ? "[Object]" // Don't render objects directly
                        : String(row[column.key] || "")}
                    </span>
                  )}{" "}
                </td>
              ))}
              {showActions && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/jobs/${row.id}`)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    {editJobs && (
                      <button
                        onClick={() => onEdit && onEdit(row)}
                        className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete && onDelete(row)}
                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              )}
              {employerActions && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="red"
                      size="lg"
                      className="w-full"
                    >
                      Reject
                    </Button>
                    <Button
                      type="submit"
                      variant="secondary"
                      size="lg"
                      className="w-full"
                    >
                      Accept
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <MobileCardView />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <DesktopTableView />
      </div>
    </>
  );
}
