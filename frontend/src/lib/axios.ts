import axios from "axios";
import { getCookie } from "@/utils/cookies";
import { getApiBaseUrl } from "@/lib/utils";

// URL base da API baseada no ambiente
const API_BASE_URL = getApiBaseUrl();

// Configuração base do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getCookie("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para renovar token automaticamente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie("refresh_token");
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || "https://codeleap-production.up.railway.app"}/auth/refresh/`,
            { refresh: refreshToken }
          );

          if (response.data.success) {
            // Atualizar token no cookie
            document.cookie = `access_token=${response.data.data.access}; path=/; max-age=3600; secure; samesite=strict`;
            
            // Retry da requisição original
            originalRequest.headers.Authorization = `Bearer ${response.data.data.access}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Se falhar ao renovar, redirecionar para login
        if (typeof window !== "undefined") {
          window.location.href = "/welcome";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
