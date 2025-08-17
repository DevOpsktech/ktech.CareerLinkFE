import { mockStudents } from "../constants/mockData";
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type {
  Student,
  StudentSearchFilters,
  UpdateStudentProfileRequest,
} from "../types/student";
import { mockApiCall } from "../utils/api";

// Mock student storage
const students = [...mockStudents];

export const studentsApi = {
  // Get all students with filters
  getStudents: async (
    filters: StudentSearchFilters = {}
  ): Promise<PaginatedResponse<Student>> => {
    let filteredStudents = [...students];

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredStudents = filteredStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query) ||
          student.major?.toLowerCase().includes(query) ||
          student.skills.some((skill: { skillName: string }) =>
            skill.skillName.toLowerCase().includes(query)
          )
      );
    }

    if (filters.major) {
      filteredStudents = filteredStudents.filter((student) =>
        student.major?.toLowerCase().includes(filters.major!.toLowerCase())
      );
    }

    if (filters.graduationYear) {
      filteredStudents = filteredStudents.filter(
        (student) => student.graduationYear === filters.graduationYear
      );
    }

    if (filters.skills && filters.skills.length > 0) {
      filteredStudents = filteredStudents.filter((student) =>
        filters.skills!.some((skill) =>
          student.skills.some((studentSkill) =>
            studentSkill.skillName.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (filters.gpa) {
      filteredStudents = filteredStudents.filter(
        (student) => student.gpa && student.gpa >= filters.gpa!
      );
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

    const response = await mockApiCall(paginatedStudents);

    return {
      ...response,
      pagination: {
        page,
        limit,
        total: filteredStudents.length,
        totalPages: Math.ceil(filteredStudents.length / limit),
      },
    };
  },

  // Get student by ID
  getStudentById: async (id: string): Promise<ApiResponse<Student>> => {
    const student = students.find((s) => s.id === id);
    if (!student) {
      throw new Error("Student not found");
    }
    return mockApiCall(student);
  },

  // Get student by user ID
  getStudentByUserId: async (userId: string): Promise<ApiResponse<Student>> => {
    const student = students.find((s) => s.userId === userId);
    if (!student) {
      throw new Error("Student not found");
    }
    return mockApiCall(student);
  },

  // Update student profile
  updateStudentProfile: async (
    studentId: string,
    profileData: UpdateStudentProfileRequest
  ): Promise<ApiResponse<Student>> => {
    const studentIndex = students.findIndex((s) => s.id === studentId);
    if (studentIndex === -1) {
      throw new Error("Student not found");
    }

    students[studentIndex] = {
      ...students[studentIndex],
      ...profileData,
      updatedAt: new Date().toISOString(),
    };

    return mockApiCall(students[studentIndex]);
  },

  // Add student skill
  addStudentSkill: async (
    studentId: string,
    skillData: {
      skillId: string;
      skillName: string;
      category: string;
      proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
    }
  ): Promise<ApiResponse<Student>> => {
    const studentIndex = students.findIndex((s) => s.id === studentId);
    if (studentIndex === -1) {
      throw new Error("Student not found");
    }

    const newSkill = {
      id: `skill-${Date.now()}`,
      ...skillData,
    };

    students[studentIndex].skills.push(newSkill);
    students[studentIndex].updatedAt = new Date().toISOString();

    return mockApiCall(students[studentIndex]);
  },

  // Remove student skill
  removeStudentSkill: async (
    studentId: string,
    skillId: string
  ): Promise<ApiResponse<Student>> => {
    const studentIndex = students.findIndex((s) => s.id === studentId);
    if (studentIndex === -1) {
      throw new Error("Student not found");
    }

    students[studentIndex].skills = students[studentIndex].skills.filter(
      (skill) => skill.id !== skillId
    );
    students[studentIndex].updatedAt = new Date().toISOString();

    return mockApiCall(students[studentIndex]);
  },

  // Add student experience
  addStudentExperience: async (
    studentId: string,
    experienceData: Omit<Student["experiences"][0], "id">
  ): Promise<ApiResponse<Student>> => {
    const studentIndex = students.findIndex((s) => s.id === studentId);
    if (studentIndex === -1) {
      throw new Error("Student not found");
    }

    const newExperience = {
      id: `exp-${Date.now()}`,
      ...experienceData,
    };

    students[studentIndex].experiences.push(newExperience);
    students[studentIndex].updatedAt = new Date().toISOString();

    return mockApiCall(students[studentIndex]);
  },

  // Update student experience
  updateStudentExperience: async (
    studentId: string,
    experienceId: string,
    experienceData: Partial<Omit<Student["experiences"][0], "id">>
  ): Promise<ApiResponse<Student>> => {
    const studentIndex = students.findIndex((s) => s.id === studentId);
    if (studentIndex === -1) {
      throw new Error("Student not found");
    }

    const experienceIndex = students[studentIndex].experiences.findIndex(
      (exp) => exp.id === experienceId
    );
    if (experienceIndex === -1) {
      throw new Error("Experience not found");
    }

    students[studentIndex].experiences[experienceIndex] = {
      ...students[studentIndex].experiences[experienceIndex],
      ...experienceData,
    };
    students[studentIndex].updatedAt = new Date().toISOString();

    return mockApiCall(students[studentIndex]);
  },

  // Remove student experience
  removeStudentExperience: async (
    studentId: string,
    experienceId: string
  ): Promise<ApiResponse<Student>> => {
    const studentIndex = students.findIndex((s) => s.id === studentId);
    if (studentIndex === -1) {
      throw new Error("Student not found");
    }

    students[studentIndex].experiences = students[
      studentIndex
    ].experiences.filter((exp) => exp.id !== experienceId);
    students[studentIndex].updatedAt = new Date().toISOString();

    return mockApiCall(students[studentIndex]);
  },
};
