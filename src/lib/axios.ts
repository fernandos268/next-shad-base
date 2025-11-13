import axios from "axios";
import { NextResponse } from "next/server";

const axiosInstance = axios.create({
  baseURL: process.env.BASE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors for auth tokens, logging, etc.
axiosInstance.interceptors.request.use(
  (config) => {
    // Example: attach access token from localStorage or cookie
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: handle global errors
    if (error.response?.status === 401) {
      console.warn("Unauthorized. Redirecting to login...");
      // e.g., redirect to /login or some other page like error page.
      NextResponse.redirect('/sign-in')
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
