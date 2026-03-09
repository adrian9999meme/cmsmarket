/**
 * @cmsmarket/api-client
 * Shared API client for all micro-frontend apps
 */

import axios from "axios";

const baseURL = typeof import.meta !== "undefined" && import.meta.env?.VITE_APP_URL
  ? import.meta.env.VITE_APP_URL
  : "";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      const path = window.location.pathname;
      if (!path.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
