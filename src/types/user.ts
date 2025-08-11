export type UserRole = "admin" | "employer" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Student extends User {
  education: string;
  skills: string[];
  cvUrl?: string;
  appliedJobs: string[];
}

export interface Employer extends User {
  company: string;
  industry: string;
  postedJobs: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  salary?: string;
  location: string;
  type: "full-time" | "part-time" | "internship";
  postedDate: string;
  employerId: string;
}
