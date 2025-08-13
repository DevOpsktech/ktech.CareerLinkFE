export interface Job {
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
  id: string;
  jobId: string;
  studentId: string;
  job?: Job;
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
  description: string;
  requirements: string;
  responsibilities?: string;
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
  applicationDeadline?: string;
  isRemote: boolean;
}

export interface JobSearchFilters {
  query?: string;
  location?: string;
  jobType?: string;
  company?: string;
  experienceLevel?: string;
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  isRemote?: boolean;
  page?: number;
  limit?: number;
}
