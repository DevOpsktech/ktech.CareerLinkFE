import { DataTable } from "../ui/DataTable";
import { StatCard } from "../ui/StatsCard";
import { EmployerManagement } from "../features/EmployeeManagement";
import { jobColumns, jobData, stats } from "../../constants";
import Heading from "../ui/Heading";

export function AdminDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Heading
        title="Admin Dashboard"
        description="Manage your CareerLink platform"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Management Tables */}
      <div className="space-y-8">
        <EmployerManagement />

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
