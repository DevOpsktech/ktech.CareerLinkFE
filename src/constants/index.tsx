import {
  Bookmark,
  Briefcase,
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

export const employerData = [
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

export const jobColumns = [
  { key: "title", label: "Job Title" },
  { key: "company", label: "Company" },
  { key: "location", label: "Location" },
  { key: "applications", label: "Applications" },
];

export const jobData = [
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

export const jobs = [
  {
    id: "1",
    title: "Software Engineering Intern",
    company: "TechCorp",
    location: "New York, NY",
    type: "Internship",
    salary: "$25/hour",
    description:
      "Join our dynamic development team and work on cutting-edge web applications.",
    posted: "2 days ago",
    skills: ["React", "JavaScript", "Python"],
  },
  {
    id: "2",
    title: "Marketing Assistant",
    company: "MarketPro",
    location: "Chicago, IL",
    type: "Part-time",
    salary: "$20/hour",
    description:
      "Support marketing campaigns and social media management for growing startup.",
    posted: "1 week ago",
    skills: ["Social Media", "Content Creation", "Analytics"],
  },
  {
    id: "3",
    title: "Data Analyst",
    company: "DataCo",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$70,000 - $85,000",
    description:
      "Analyze large datasets to derive business insights and support decision-making.",
    posted: "3 days ago",
    skills: ["SQL", "Python", "Tableau"],
  },
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
  { key: "jobs", label: "My Jobs", icon: Plus },
  { key: "post", label: "Post Job", icon: Plus },
  { key: "students", label: "Find Students", icon: Search },
  { key: "student-applied", label: "Student Application", icon: LucideUsers2 },
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
