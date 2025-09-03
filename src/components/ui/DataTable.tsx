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
  return (
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
}
