import axios from "axios";
import { isTokenExpired } from "./jwtHelper";
import { refreshToken as refreshTokenApi } from "./authService";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("jwt_token");
    const refresh = localStorage.getItem("refresh_token");

    // Token hết hạn → refresh
    if (token && isTokenExpired(token)) {
      console.warn("⚠️ Token hết hạn, đang refresh...");

      if (!refresh) {
        window.location.href = "/login";
        return Promise.reject("No refresh token");
      }

      const refreshResult = await refreshTokenApi(refresh);

      if (refreshResult.status && refreshResult.data?.token) {
        token = refreshResult.data.token;
        localStorage.setItem("jwt_token", token);
        console.log("✅ Token mới đã được lưu");
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

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refresh = localStorage.getItem("refresh_token");

    // 401 → thử refresh rồi gọi lại request
    if (
      error.response?.status === 401 &&
      refresh &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      console.warn("⚠️ 401 → thử refresh lại token");

      const refreshResult = await refreshTokenApi(refresh);

      if (refreshResult.status && refreshResult.data?.token) {
        const newToken = refreshResult.data.token;
        localStorage.setItem("jwt_token", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
