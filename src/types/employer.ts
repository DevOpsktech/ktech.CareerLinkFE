export interface Employer {
  id: string;
  userId: string;
  companyId: string;
  fullName: string;
  email: string;
  position?: string;
  phone?: string;
  company: Company;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  companySize?: "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+";
  foundedYear?: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployerRequest {
  company: string;
  email: string;
  password: string;
  industry: string;
  fullName?: string;
  position?: string;
  phone?: string;
  website?: string;
  description?: string;
}

export interface EmployerSearchFilters {
  query?: string;
  industry?: string;
  companySize?: string;
  isVerified?: boolean;
  page?: number;
  limit?: number;
}
