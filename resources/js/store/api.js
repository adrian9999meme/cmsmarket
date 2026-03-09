import axios from "axios";
import { getBasePath } from "../config/routeConfig";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  // baseURL: process.env.REACT_APP_API_URL, // for CRA
  headers: {
    // default headers; specific requests may override
    Accept: "application/json",
  },
});

// ensure content-type is correctly set later
api.interceptors.request.use((config) => {
  // if data is FormData, let axios set the header (it will include boundary)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

api.interceptors.request.use((config) => {
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
      const loginPath = path.includes("/admin") ? getBasePath("/admin/login")
        : path.includes("/seller") ? getBasePath("/seller/login")
        : path.includes("/driver") ? getBasePath("/driver/login")
        : getBasePath("/login");
      if (!path.includes("/login")) {
        window.location.href = loginPath;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
