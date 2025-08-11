import { DataTable } from "../ui/DataTable";
import { Users, Briefcase, GraduationCap } from "lucide-react";
import { StatCard } from "../ui/StatsCard";
const stats = [
  { label: "Total Employers", value: "1,247", icon: Users, color: "blue" },
  { label: "Job Postings", value: "3,892", icon: Briefcase, color: "green" },
  {
    label: "Students",
    value: "12,456",
    icon: GraduationCap,
    color: "purple",
  },
];

const employerColumns = [
  { key: "company", label: "Company" },
  { key: "email", label: "Email" },
  { key: "industry", label: "Industry" },
  { key: "jobs", label: "Jobs Posted" },
];

const employerData = [
  {
    id: "1",
    company: "TechCorp",
    email: "hr@techcorp.com",
    industry: "Technology",
    jobs: 15,
  },
  {
    id: "2",
    company: "FinanceInc",
    email: "careers@financeinc.com",
    industry: "Finance",
    jobs: 8,
  },
  {
    id: "3",
    company: "HealthCare Ltd",
    email: "jobs@healthcare.com",
    industry: "Healthcare",
    jobs: 12,
  },
];

const jobColumns = [
  { key: "title", label: "Job Title" },
  { key: "company", label: "Company" },
  { key: "location", label: "Location" },
  { key: "applications", label: "Applications" },
];

const jobData = [
  {
    id: "1",
    title: "Software Engineer",
    company: "TechCorp",
    location: "New York",
    applications: 145,
  },
  {
    id: "2",
    title: "Financial Analyst",
    company: "FinanceInc",
    location: "Chicago",
    applications: 89,
  },
  {
    id: "3",
    title: "Nurse",
    company: "HealthCare Ltd",
    location: "Los Angeles",
    applications: 67,
  },
];
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
          <StatCard key={index} {...stat} />
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
