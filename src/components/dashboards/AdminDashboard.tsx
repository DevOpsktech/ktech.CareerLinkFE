import { DataTable } from "../ui/DataTable";
import { StatCard } from "../ui/StatsCard";
import { EmployerManagement } from "../features/EmployeeManagement";
import { jobColumns, jobData } from "../../constants";
import Heading from "../ui/Heading";
import { useJobs } from "../../hooks/useJobs";
import { useEmployers } from "../../hooks/useEmployers";
import { useStudents } from "../../hooks/useStudents";
import { Briefcase, GraduationCap, Users } from "lucide-react";

export function AdminDashboard() {
  const { jobs } = useJobs();
  const { employers } = useEmployers();
  const { students } = useStudents();

  const totalJobs = jobs.length;
  const totalEmployers = employers.length;
  const totalStudents = students.length;

  const stats = [
    {
      label: "Total Employers",
      value: totalEmployers,
      icon: Users,
      color: "blue",
    },
    {
      label: "Job Postings",
      value: totalJobs,
      icon: Briefcase,
      color: "green",
    },
    {
      label: "Students",
      value: totalStudents,
      icon: GraduationCap,
      color: "purple",
    },
  ];

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
