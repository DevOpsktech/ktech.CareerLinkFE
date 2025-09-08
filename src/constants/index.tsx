import {
  Bookmark,
  Briefcase,
  BriefcaseBusiness,
  GraduationCap,
  LucideUsers2,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";

export const studentColumns = [
  { key: "name", label: "Name" },
  { key: "major", label: "Major" },
  { key: "graduation", label: "Graduation" },
  { key: "skills", label: "Key Skills" },
  { key: "gpa", label: "GPA" },
];

export const studentData = [
  {
    id: "1",
    name: "Alice Johnson",
    major: "Computer Science",
    graduation: "2024",
    skills: "React, Python, Machine Learning",
    gpa: "3.8",
    cvUrl: "/careerlink.pdf",
  },
  {
    id: "2",
    name: "Bob Chen",
    major: "Business Administration",
    graduation: "2025",
    skills: "Project Management, Analytics, Marketing",
    gpa: "3.6",
    cvUrl: "/careerlink.pdf",
  },
  {
    id: "3",
    name: "Carol Davis",
    major: "Graphic Design",
    graduation: "2024",
    skills: "Adobe Creative Suite, UI/UX, Branding",
    gpa: "3.9",
    cvUrl: "/careerlink.pdf",
  },
];

export const stats = [
  { label: "Total Employers", value: "1,247", icon: Users, color: "blue" },
  { label: "Job Postings", value: "3,892", icon: Briefcase, color: "green" },
  {
    label: "Students",
    value: "12,456",
    icon: GraduationCap,
    color: "purple",
  },
];

export const employerColumns = [
  { key: "company", label: "Company" },
  { key: "email", label: "Email" },
  { key: "industry", label: "Industry" },
  { key: "jobs", label: "Jobs Posted" },
];

export const myJobsColumns = [
  { key: "title", label: "Job Title" },
  { key: "applications", label: "Applications" },
  { key: "status", label: "Status" },
  { key: "posted", label: "Posted Date" },
];

export const myJobsData = [
  {
    id: "1",
    title: "Frontend Developer",
    applications: 25,
    status: "Active",
    posted: "2024-01-15",
  },
  {
    id: "2",
    title: "Product Manager",
    applications: 42,
    status: "Active",
    posted: "2024-01-12",
  },
  {
    id: "3",
    title: "UX Designer",
    applications: 18,
    status: "Closed",
    posted: "2024-01-08",
  },
];

export const tabs = [
  { key: "jobs", label: "My Jobs", icon: BriefcaseBusiness },
  { key: "post", label: "Post Job", icon: Plus },
  { key: "applicants", label: "Job Applicants", icon: LucideUsers2 },
  { key: "students", label: "Find Students", icon: Search },
];

export const appliedJobsColumns = [
  { key: "title", label: "Job Title" },
  { key: "company", label: "Company" },
  { key: "appliedDate", label: "Applied Date" },
  { key: "status", label: "Status" },
];

export const appliedJobsData = [
  {
    id: "1",
    title: "Software Intern",
    company: "TechCorp",
    appliedDate: "2024-01-20",
    status: "Under Review",
  },
  {
    id: "2",
    title: "Marketing Assistant",
    company: "MarketPro",
    appliedDate: "2024-01-18",
    status: "Interview Scheduled",
  },
  {
    id: "3",
    title: "Data Analyst",
    company: "DataCo",
    appliedDate: "2024-01-15",
    status: "Rejected",
  },
];

export const studentTabs = [
  { key: "jobs", label: "Find Jobs", icon: Search },
  { key: "applied", label: "Applied Jobs", icon: Bookmark },
  { key: "profile", label: "Profile", icon: User },
];

// Job Search Filter Options
export const jobTypeOptions = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
];

export const experienceLevelOptions = [
  { value: "entry", label: "Entry Level" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior" },
];

export const jobStatusOptions = [
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "draft", label: "Draft" },
];

export const sortByOptions = [
  { value: "title", label: "Job Title" },
  { value: "location", label: "Location" },
  { value: "salary", label: "Salary" },
  { value: "posted", label: "Posted Date" },
  { value: "applications", label: "Applications" },
];

export const sortOrderOptions = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

export const pageSizeOptions = [
  { value: 10, label: "10 per page" },
  { value: 20, label: "20 per page" },
  { value: 50, label: "50 per page" },
];
