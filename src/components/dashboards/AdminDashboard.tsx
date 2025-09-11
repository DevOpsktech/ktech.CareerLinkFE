import { DataTable } from "../ui/DataTable";
import { StatCard } from "../ui/StatsCard";
import { EmployerManagement } from "../features/EmployeeManagement";
import { CvViewsManagement } from "../features/CvViewsManagement";
import Heading from "../ui/Heading";
import { useJobs } from "../../hooks/useJobs";
import { useEmployers } from "../../hooks/useEmployers";
import { useStudents } from "../../hooks/useStudents";
import {
  Briefcase,
  GraduationCap,
  Users,
  BarChart3,
  Building2,
  Settings,
  Eye,
  UserCheck,
} from "lucide-react";
import CompanyTable from "../features/CompanyTable";
import { useState } from "react";
import { ConfirmModal } from "../ui/ConfirmModal";
import { jobsApi } from "../../api/jobsApi";
import { useToast } from "../../contexts/ToastContext";
import SkillsManagement from "../features/SkillsManagement";
import { DashboardLayout } from "../ui/DashboardLayout";

export function AdminDashboard() {
  const { jobs, refetch } = useJobs();
  const { employers } = useEmployers();
  const { students } = useStudents();
  const { showSuccess, showError } = useToast();

  const [activeSection, setActiveSection] = useState("overview");
  const [jobPendingDelete, setJobPendingDelete] = useState<{
    id: string;
    title?: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  // Sidebar navigation items
  const sidebarItems = [
    {
      key: "overview",
      label: "Overview",
      icon: BarChart3,
    },
    {
      key: "employers",
      label: "Employers",
      icon: Users,
      badge: totalEmployers,
    },
    {
      key: "jobs",
      label: "Job Postings",
      icon: Briefcase,
      badge: totalJobs,
    },
    {
      key: "students",
      label: "Students",
      icon: GraduationCap,
      badge: totalStudents,
    },
    {
      key: "companies",
      label: "Companies",
      icon: Building2,
    },
    {
      key: "cv-views",
      label: "CV Views",
      icon: Eye,
    },
    {
      key: "skills",
      label: "Skills Management",
      icon: Settings,
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

  const handleRequestDelete = (row: { id: string; title?: string }) => {
    setJobPendingDelete({ id: row.id, title: row.title });
  };

  const handleConfirmDelete = async () => {
    if (!jobPendingDelete || deleting) return;
    try {
      setDeleting(true);
      await jobsApi.deleteJob(jobPendingDelete.id);
      showSuccess("Job deleted successfully");
      setJobPendingDelete(null);
      refetch();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to delete job";
      showError(message);
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <Heading
              title="Admin Dashboard"
              description="System overview and statistics"
            />

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveSection("employers")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover-lift transition-colors text-left focus-ring"
                >
                  <Users className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-medium text-gray-900">
                    Manage Employers
                  </h4>
                  <p className="text-sm text-gray-500">
                    View and manage employer accounts
                  </p>
                </button>
                <button
                  onClick={() => setActiveSection("jobs")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover-lift transition-colors text-left focus-ring"
                >
                  <Briefcase className="w-8 h-8 text-green-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Job Postings</h4>
                  <p className="text-sm text-gray-500">
                    Review and manage job postings
                  </p>
                </button>
                <button
                  onClick={() => setActiveSection("students")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover-lift transition-colors text-left focus-ring"
                >
                  <GraduationCap className="w-8 h-8 text-purple-600 mb-2" />
                  <h4 className="font-medium text-gray-900">
                    Student Management
                  </h4>
                  <p className="text-sm text-gray-500">
                    View and manage student profiles
                  </p>
                </button>
                <button
                  onClick={() => setActiveSection("skills")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover-lift transition-colors text-left focus-ring"
                >
                  <Settings className="w-8 h-8 text-gray-600 mb-2" />
                  <h4 className="font-medium text-gray-900">
                    Skills Management
                  </h4>
                  <p className="text-sm text-gray-500">
                    Manage system skills and categories
                  </p>
                </button>
              </div>
            </div>
          </div>
        );

      case "employers":
        return (
          <div className="space-y-6">
            <Heading
              title="Employer Management"
              description="Manage employer accounts and companies"
            />
            <EmployerManagement />
          </div>
        );

      case "jobs":
        return (
          <div className="space-y-6">
            <Heading
              title="Job Postings"
              description="Review and manage all job postings"
            />
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  All Job Postings
                </h2>
              </div>
              <DataTable
                columns={adminJobColumns}
                data={transformedJobsData}
                showActions
                onDelete={handleRequestDelete}
              />
            </div>
          </div>
        );

      case "students":
        return (
          <div className="space-y-6">
            <Heading
              title="Student Management"
              description="View and manage student profiles"
            />
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Student Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">
                        Total Students
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {totalStudents}
                      </p>
                    </div>
                    <GraduationCap className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">
                        Active Profiles
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {totalStudents}
                      </p>
                    </div>
                    <UserCheck className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">
                        Applications
                      </p>
                      <p className="text-2xl font-bold text-purple-900">-</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "companies":
        return (
          <div className="space-y-6">
            <Heading
              title="Company Management"
              description="Manage company profiles and information"
            />
            <CompanyTable />
          </div>
        );

      case "cv-views":
        return (
          <div className="space-y-6">
            <Heading
              title="CV Views Management"
              description="Monitor and manage CV view statistics"
            />
            <CvViewsManagement />
          </div>
        );

      case "skills":
        return (
          <div className="space-y-6">
            <Heading
              title="Skills Management"
              description="Manage skills and categories"
            />
            <SkillsManagement />
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <Heading
              title="Admin Dashboard"
              description="System overview and statistics"
            />
            <div className="text-center py-12">
              <p className="text-gray-500">
                Select a section from the sidebar to get started.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeItem={activeSection}
      onItemClick={setActiveSection}
      title="CareerLink"
      userRole="Admin"
    >
      {renderContent()}

      <ConfirmModal
        isOpen={Boolean(jobPendingDelete)}
        title="Delete Job"
        message={
          jobPendingDelete
            ? `Are you sure you want to delete "${
                jobPendingDelete.title || "this job"
              }"? This action cannot be undone.`
            : "Are you sure you want to delete this job? This action cannot be undone."
        }
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText={"Cancel"}
        onConfirm={handleConfirmDelete}
        onCancel={() => (!deleting ? setJobPendingDelete(null) : undefined)}
      />
    </DashboardLayout>
  );
}
