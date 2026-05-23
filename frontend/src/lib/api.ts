import { apiClient } from "@/lib/api-client";
import type {
  AuthResponse,
  CollegeDetailResponse,
  CollegeListResponse,
  CollegeQuery,
  CollegeSummary,
  ComparisonResponse,
  ProfileResponse
} from "@/lib/types";

const cleanParams = (params: CollegeQuery = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value !== undefined && value !== null && value !== "all")
  );

export const collegeApi = {
  getColleges: async (params: CollegeQuery = {}) => {
    const response = await apiClient.get<CollegeListResponse>("/colleges", {
      params: cleanParams(params)
    });
    return response.data;
  },
  getCollege: async (id: string) => {
    const response = await apiClient.get<CollegeDetailResponse>(`/colleges/${id}`);
    return response.data;
  },
  searchColleges: async (q: string, limit = 8) => {
    const response = await apiClient.get<{ success: boolean; data: CollegeSummary[] }>("/colleges/search", {
      params: { q, limit }
    });
    return response.data;
  }
};

export const authApi = {
  signup: async (payload: { name: string; email: string; password: string }) => {
    const response = await apiClient.post<AuthResponse>("/auth/signup", payload);
    return response.data;
  },
  login: async (payload: { email: string; password: string }) => {
    const response = await apiClient.post<AuthResponse>("/auth/login", payload);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post<{ success: boolean; message: string }>("/auth/logout");
    return response.data;
  },
  profile: async () => {
    const response = await apiClient.get<ProfileResponse>("/auth/profile");
    return response.data;
  }
};

export const compareApi = {
  compare: async (collegeIds: string[]) => {
    const response = await apiClient.post<ComparisonResponse>("/compare", { collegeIds });
    return response.data;
  },
  toggleSaveCollege: async (collegeId: string) => {
    const response = await apiClient.post<ProfileResponse & { saved: boolean }>("/save/college", { collegeId });
    return response.data;
  },
  saveComparison: async (payload: { collegeIds: string[]; title?: string }) => {
    const response = await apiClient.post<ProfileResponse>("/save/comparison", payload);
    return response.data;
  }
};
