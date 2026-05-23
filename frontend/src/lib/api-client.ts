import axios, { AxiosError } from "axios";

const tokenStorageKey = "collegehub_token";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(tokenStorageKey, token);
  }

  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(tokenStorageKey);
  }

  delete apiClient.defaults.headers.common.Authorization;
};

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined" || config.headers.Authorization) {
    return config;
  }

  const token = window.localStorage.getItem(tokenStorageKey);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApiErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || "Request failed";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};
