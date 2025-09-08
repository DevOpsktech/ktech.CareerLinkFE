export interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  website: string;
  logoUrl: string;
  city: string;
  state: string;
  country: string;
  companySize: string;
  foundedYear: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employer {
  id: string;
  userId: string;
  companyId: string;
  name: string;
  email: string;
  position: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  company: Company;
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  employerId: string;
  description: string;
  requirements: {
    $values: string[];
  };
  responsibilities: {
    $values: string[];
  };
  skills: {
    $values: string[];
  };
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  salaryPeriod: string;
  location: string;
  type: "full-time" | "part-time" | "internship" | "contract";
  experienceLevel: "entry" | "junior" | "mid" | "senior";
  isRemote: boolean;
  status: "active" | "closed" | "draft";
  postedDate: string;
  applicationDeadline?: string;
  viewCount: number;
  applicationCount: number;
  company: Company;
  employer: Employer;
}

// Legacy interface for backward compatibility
export interface LegacyJob {
  id: string;
  title: string;
  company: string;
  companyId: string;
  description: string;
  requirements: string[];
  responsibilities?: string[];
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period: "hourly" | "monthly" | "yearly";
  };
  location: string;
  type: "full-time" | "part-time" | "internship" | "contract";
  experienceLevel: "entry" | "junior" | "mid" | "senior";
  skills: string[];
  postedDate: string;
  applicationDeadline?: string;
  status: "active" | "closed" | "draft";
  employerId: string;
  viewCount: number;
  applicationCount: number;
  isRemote: boolean;
}

export interface JobApplication {
  jobTitle: string;
  id: string;
  jobId: string;
  studentId: string;
  job?: LegacyJob;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  student?: any;
  coverLetter?: string;
  resumeUrl?: string;
  status:
    | "pending"
    | "reviewing"
    | "shortlisted"
    | "interview_scheduled"
    | "interviewed"
    | "offered"
    | "accepted"
    | "rejected"
    | "withdrawn";
  appliedAt: string;
  updatedAt: string;
  reviewedAt?: string;
  employerNotes?: string;
  rejectionReason?: string;
}
export interface CreateJobRequest {
  title: string;
  employerId?: string;
  companyId?: string;
  description: string;
  requirements: string[];
  responsibilities?: string[];
  skills: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod: "hourly" | "monthly" | "yearly";
  location: string;
  type: "full-time" | "part-time" | "internship" | "contract";
  experienceLevel: "entry" | "junior" | "mid" | "senior";
  isRemote: boolean;
  applicationDeadline?: string;
  status?: "active" | "closed" | "draft";
}

export interface JobSearchFilters {
  q?: string; // Text search across title, description, and location
  location?: string;
  isRemote?: boolean;
  type?: "full-time" | "part-time" | "internship" | "contract";
  experienceLevel?: "entry" | "junior" | "mid" | "senior";
  salaryMin?: number;
  salaryMax?: number;
  companyId?: string;
  status?: "active" | "closed" | "draft";
  skills?: string[];
  sortBy?: "title" | "location" | "salary" | "posted" | "applications";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  // Legacy fields for backward compatibility
  query?: string;
  jobType?: string;
  company?: string;
  limit?: number;
}

export interface ApplyToJobRequest {
  jobId: string;
  studentId: string;
  coverLetter?: string;
  resumeUrl?: string;
}
