import axios from "axios";
import env from "../config/Config";
import { isTokenExpired } from "../hooks/auth";
import { refreshToken as refreshTokenApi } from "../services/Auth/AuthService";

const apiMultipart = axios.create({
    baseURL: env.API_URL,
    withCredentials: true,
    // ❌ KHÔNG set Content-Type
});

// ===== REQUEST =====
apiMultipart.interceptors.request.use(async (config) => {
    let token = localStorage.getItem("token");
    const refresh = localStorage.getItem("rf_token");

    if (token && isTokenExpired(token)) {
        if (!refresh) {
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject("No refresh token");
        }

        const res = await refreshTokenApi(refresh);
        const newToken = res?.data?.token || res?.data?.data;

        if (!newToken) {
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject("Refresh failed");
        }

        token = newToken;
        localStorage.setItem("token", newToken);
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default apiMultipart;
