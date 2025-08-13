import { mockApplications, mockJobs } from "../constants/mockData";
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type { CreateJobRequest, Job, JobApplication, JobSearchFilters } from "../types/job";
import { mockApiCall } from "../utils/api";


// Mock job storage
let jobs = [...mockJobs];
let applications = [...mockApplications];

export const jobsApi = {
  // Get all jobs with filters
  getJobs: async (
    filters: JobSearchFilters = {}
  ): Promise<PaginatedResponse<Job>> => {
    let filteredJobs = [...jobs];

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.skills.some((skill: string) => skill.toLowerCase().includes(query))
      );
    }

    if (filters.location) {
      filteredJobs = filteredJobs.filter((job) =>
        job.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.jobType) {
      filteredJobs = filteredJobs.filter((job) => job.type === filters.jobType);
    }

    if (filters.company) {
      filteredJobs = filteredJobs.filter((job) =>
        job.company.toLowerCase().includes(filters.company!.toLowerCase())
      );
    }

    if (filters.experienceLevel) {
      filteredJobs = filteredJobs.filter(
        (job) => job.experienceLevel === filters.experienceLevel
      );
    }

    if (filters.isRemote !== undefined) {
      filteredJobs = filteredJobs.filter(
        (job) => job.isRemote === filters.isRemote
      );
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    const response = await mockApiCall(paginatedJobs);

    return {
      ...response,
      pagination: {
        page,
        limit,
        total: filteredJobs.length,
        totalPages: Math.ceil(filteredJobs.length / limit),
      },
    };
  },

  // Get job by ID
  getJobById: async (id: string): Promise<ApiResponse<Job>> => {
    const job = jobs.find((j) => j.id === id);
    if (!job) {
      throw new Error("Job not found");
    }

    // Increment view count
    job.viewCount += 1;

    return mockApiCall(job);
  },

  // Create new job
  createJob: async (jobData: CreateJobRequest): Promise<ApiResponse<Job>> => {
    const newJob: Job = {
      id: `job-${Date.now()}`,
      ...jobData,
      company: "TechCorp", // This would come from the authenticated employer
      companyId: "comp-1",
      employerId: "emp-1",
      requirements: jobData.requirements.split(",").map((r) => r.trim()),
      responsibilities:
        jobData.responsibilities?.split(",").map((r) => r.trim()) || [],
      postedDate: new Date().toISOString(),
      status: "active",
      viewCount: 0,
      applicationCount: 0,
    };

    jobs.push(newJob);
    return mockApiCall(newJob);
  },

  // Update job
  updateJob: async (
    id: string,
    jobData: Partial<CreateJobRequest>
  ): Promise<ApiResponse<Job>> => {
    const jobIndex = jobs.findIndex((j) => j.id === id);
    if (jobIndex === -1) {
      throw new Error("Job not found");
    }

    jobs[jobIndex] = {
      ...jobs[jobIndex],
      ...jobData,
      requirements: jobData.requirements
        ? jobData.requirements.split(",").map((r) => r.trim())
        : jobs[jobIndex].requirements,
      responsibilities: jobData.responsibilities
        ? jobData.responsibilities.split(",").map((r) => r.trim())
        : jobs[jobIndex].responsibilities,
    };

    return mockApiCall(jobs[jobIndex]);
  },

  // Delete job
  deleteJob: async (id: string): Promise<ApiResponse<boolean>> => {
    const jobIndex = jobs.findIndex((j) => j.id === id);
    if (jobIndex === -1) {
      throw new Error("Job not found");
    }

    jobs.splice(jobIndex, 1);
    return mockApiCall(true);
  },

  // Get jobs by employer
  getJobsByEmployer: async (
    employerId: string
  ): Promise<ApiResponse<Job[]>> => {
    const employerJobs = jobs.filter((job) => job.employerId === employerId);
    return mockApiCall(employerJobs);
  },

  // Apply to job
  applyToJob: async (
    jobId: string,
    studentId: string,
    applicationData: {
      coverLetter?: string;
      resumeUrl?: string;
    }
  ): Promise<ApiResponse<JobApplication>> => {
    // Check if already applied
    const existingApplication = applications.find(
      (app) => app.jobId === jobId && app.studentId === studentId
    );

    if (existingApplication) {
      throw new Error("Already applied to this job");
    }

    const newApplication: JobApplication = {
      id: `app-${Date.now()}`,
      jobId,
      studentId,
      ...applicationData,
      status: "pending",
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    applications.push(newApplication);

    // Update job application count
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      job.applicationCount += 1;
    }

    return mockApiCall(newApplication);
  },

  // Get applications for a job
  getJobApplications: async (
    jobId: string
  ): Promise<ApiResponse<JobApplication[]>> => {
    const jobApplications = applications.filter((app) => app.jobId === jobId);
    return mockApiCall(jobApplications);
  },

  // Get student applications
  getStudentApplications: async (
    studentId: string
  ): Promise<ApiResponse<JobApplication[]>> => {
    const studentApplications = applications
      .filter((app) => app.studentId === studentId)
      .map((app) => ({
        ...app,
        job: jobs.find((job) => job.id === app.jobId),
      }));

    return mockApiCall(studentApplications);
  },

  // Update application status
  updateApplicationStatus: async (
    applicationId: string,
    status: JobApplication["status"],
    notes?: string
  ): Promise<ApiResponse<JobApplication>> => {
    const appIndex = applications.findIndex((app) => app.id === applicationId);
    if (appIndex === -1) {
      throw new Error("Application not found");
    }

    applications[appIndex] = {
      ...applications[appIndex],
      status,
      updatedAt: new Date().toISOString(),
      employerNotes: notes || applications[appIndex].employerNotes,
      reviewedAt:
        status !== "pending"
          ? new Date().toISOString()
          : applications[appIndex].reviewedAt,
    };

    return mockApiCall(applications[appIndex]);
  },
};
