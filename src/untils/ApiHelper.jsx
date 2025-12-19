import axios from "axios";
import { isTokenExpired } from "../hooks/auth";
import { refreshToken as refreshTokenApi } from "../services/Auth/AuthService";
import env from "../config/Config";

const apiPrivate = axios.create({
  baseURL: env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  validateStatus: (status) =>
    (status >= 200 && status < 300) ||
    status === 400 ||
    status === 404,
});

// ================= REQUEST =================
apiPrivate.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");
    const refresh = localStorage.getItem("rf_token");

    if (token && isTokenExpired(token)) {
      if (!refresh) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject("No refresh token");
      }

      const res = await refreshTokenApi(refresh);

      if (res?.data?.token) {
        token = res.data.token;
        localStorage.setItem("token", token);
      } else {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject("Refresh failed");
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE =================
apiPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refresh = localStorage.getItem("rf_token");

    if (error.response?.status === 401 && refresh && !originalRequest._retry) {
      originalRequest._retry = true;

      const res = await refreshTokenApi(refresh);

      if (res?.data?.token) {
        const newToken = res.data.token;
        localStorage.setItem("token", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiPrivate(originalRequest);
      }

      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiPrivate;
