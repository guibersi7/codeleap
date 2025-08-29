import axios from "axios";
import { tokenStorage } from "./api";

// Configuração base do axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e renovar token automaticamente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (não autorizado) e não for uma tentativa de renovação
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentar renovar o token
        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/refresh/`,
            { refresh: refreshToken }
          );

          if (response.data.success) {
            // Atualizar o token no localStorage
            const currentRefresh = tokenStorage.getRefreshToken();
            if (currentRefresh) {
              tokenStorage.setTokens(response.data.data.access, currentRefresh);
            }

            // Adicionar o novo token à requisição original
            originalRequest.headers.Authorization = `Bearer ${response.data.data.access}`;
            
            // Repetir a requisição original com o novo token
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Se não conseguir renovar, fazer logout
        tokenStorage.clearTokens();
        window.location.href = "/welcome";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
