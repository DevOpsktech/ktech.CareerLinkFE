import {
  employerColumns,
  employerData,
  jobColumns,
  jobData,
  stats,
} from "../../constants";
import { DataTable } from "../ui/DataTable";
import { StatCard } from "../ui/StatsCard";

export function AdminDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Manage your CareerLink platform</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard  key={index} {...stat} />
        ))}
      </div>

      {/* Management Tables */}
      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              Employer Management
            </h2>
          </div>
          <DataTable
            columns={employerColumns}
            data={employerData}
            showActions
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              Job Postings
            </h2>
          </div>
          <DataTable columns={jobColumns} data={jobData} showActions />
        </div>
      </div>
    </div>
  );
}
