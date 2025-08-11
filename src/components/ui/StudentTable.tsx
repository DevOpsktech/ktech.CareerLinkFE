import { StudentActionsMenu } from "../features/StudentActionMenu";

interface Column {
  key: string;
  label: string;
}

interface Student {
  id: string | number;
  [key: string]: any;
}

interface StudentTableProps {
  columns: Column[];
  data: Student[];
  onViewCv?: (cvUrl: string) => void;
  onShortlist?: (student: Student) => void;
  actions?: boolean;
}

export function StudentTable({
  columns,
  data,
  onViewCv,
  onShortlist,
  actions,
}: StudentTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {student[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <StudentActionsMenu
                    student={student}
                    onViewCv={onViewCv}
                    onShortlist={onShortlist}
                    onAccept={
                      actions ? (s) => console.log("Accepted:", s) : undefined
                    }
                    onRemove={
                      actions ? (s) => console.log("Removed:", s) : undefined
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
