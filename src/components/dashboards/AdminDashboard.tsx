import { DataTable } from "../ui/DataTable";
import { StatCard } from "../ui/StatsCard";
import { EmployerManagement } from "../features/EmployeeManagement";
import Heading from "../ui/Heading";
import { useJobs } from "../../hooks/useJobs";
import { useEmployers } from "../../hooks/useEmployers";
import { useStudents } from "../../hooks/useStudents";
import { Briefcase, GraduationCap, Users } from "lucide-react";
import CompanyTable from "../features/CompanyTable";

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

  // Transform jobs data to match the expected format for DataTable
  const transformedJobsData = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company?.name || "N/A",
    location: job.location,
    type: job.type,
    status: job.status,
    postedDate: new Date(job.postedDate).toLocaleDateString(),
  }));

  const adminJobColumns = [
    { key: "title", label: "Job Title" },
    { key: "company", label: "Company" },
    { key: "location", label: "Location" },
    { key: "type", label: "Job Type" },
    { key: "status", label: "Status" },
    { key: "postedDate", label: "Posted Date" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Heading title="Admin Dashboard" />

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
          <DataTable
            columns={adminJobColumns}
            data={transformedJobsData}
            showActions
          />
        </div>{" "}
        <div className="">
          <CompanyTable />
        </div>
      </div>
    </div>
  );
}
