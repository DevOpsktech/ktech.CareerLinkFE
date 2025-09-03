export interface Student {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;

  // Academic Information
  universityId?: string;
  university?: string;
  studentId?: string;
  major?: string;
  minor?: string;
  degreeLevel: "associate" | "bachelor" | "master" | "phd";
  graduationYear: number;
  currentYear: "freshman" | "sophomore" | "junior" | "senior" | "graduate";
  gpa?: number;

  // Profile Information
  bio?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  cvUrl?: string;
  profilePictureUrl?: string;

  // Skills and Experience
  skills: StudentSkill[];
  experiences: StudentExperience[];

  createdAt: string;
  updatedAt: string;
}

export interface StudentSkill {
  id: string;
  skillId: string;
  skillName: string;
  category: string;
  proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface StudentExperience {
  id: string;
  type: "education" | "work" | "internship" | "project" | "volunteer";
  title: string;
  organization: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  location?: string;
}

export interface UpdateStudentProfileRequest {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  university?: string;
  major?: string;
  minor?: string;
  degreeLevel?: "associate" | "bachelor" | "master" | "phd";
  graduationYear?: number;
  currentYear?: "freshman" | "sophomore" | "junior" | "senior" | "graduate";
  gpa?: number;
  bio?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface StudentSearchFilters {
  query?: string;
  major?: string;
  graduationYear?: number;
  skills?: string[];
  gpa?: number;
  experienceType?: string;
  page?: number;
  limit?: number;
}
