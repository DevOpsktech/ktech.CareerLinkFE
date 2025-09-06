import type { ApiResponse } from "../types/api";
import { apiClient } from "../utils/api";

// CV View interface
export interface CvView {
  id: string;
  studentId: string;
  studentName: string;
  employerId: string;
  employerName: string;
  companyName: string;
  viewedAt: string;
}

export const adminApi = {
  // ----------------------
  // CV Views Management
  // ----------------------

  // Get all CV views
  getCvViews: async (): Promise<ApiResponse<CvView[]>> => {
    return apiClient.get<CvView[]>(`/Admin/cv-views`);
  },
};
