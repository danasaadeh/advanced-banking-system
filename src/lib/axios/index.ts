// lib/axios.ts
import axios from "axios";
import { handleApiError } from "./axios-error-handler";
import { getToken } from "@/features/auth/hooks/auth-state";

// Ensure BASE_URL is loaded
const BASE_URL = import.meta.env.VITE_BASE_URL;

if (!BASE_URL) {
  console.error("VITE_BASE_URL is not defined!");
}

export const httpClient = axios.create({
  baseURL: BASE_URL || "", // fallback to empty string
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers["Accept-Language"] = navigator.language || "en";

    console.log("%c[API REQUEST]", "color: blue; font-weight: bold;", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
httpClient.interceptors.response.use(
  (response) => {
    console.log("%c[API RESPONSE]", "color: green; font-weight: bold;", {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("%c[API ERROR]", "color: red; font-weight: bold;", {
      url: error?.config?.url,
      method: error?.config?.method,
      status: error?.response?.status,
      response: error?.response?.data,
    });
    handleApiError(error);
    return Promise.reject(error);
  }
);
