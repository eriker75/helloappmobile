import axios from "axios";
import { useAuthUserProfileStore } from "../features/users/stores/auth-user-profile.store";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "https://helloappmobile.eribertmarquez.com";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthUserProfileStore.getState().access_token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    console.error("Request error:", err);
    return Promise.reject(err);
  }
);

// Handle 401 responses: try to refresh token, or logout and redirect
api.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config;
    // Prevent infinite retry loop
    if (originalRequest?._retry) {
      return Promise.reject(err);
    }

    // Don't try to refresh on login endpoint
    if (originalRequest?.url?.includes("/auth/login")) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401) {
      originalRequest._retry = true;
      const refreshToken = useAuthUserProfileStore.getState().refresh_token;

      try {
        const refreshResponse = await api.post("/auth/refresh", {
          refreshToken,
        });
        const { access_token, refresh_token, user_id } = refreshResponse.data;

        useAuthUserProfileStore
          .getState()
          .setTokens(access_token, refresh_token, user_id);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
        useAuthUserProfileStore.getState().clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
