import { getCookie, removeCookie, setCookie } from "@/utils/cookies";

// Configuração da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://codeleap-production.up.railway.app";

// Tipos da API
export interface LoginRequest {
  username: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      username: string;
      date_joined: string;
      last_login: string;
    };
    tokens: {
      access: string;
      refresh: string;
    };
  };
}

export interface RegisterRequest {
  username: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      username: string;
      date_joined: string;
      last_login: string | null;
    };
    tokens: {
      access: string;
      refresh: string;
    };
  };
}

export interface RefreshRequest {
  refresh: string;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    access: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
}

// Função auxiliar para fazer requisições
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
  };

  // Adicionar Content-Type apenas se não for FormData
  if (!(options.body instanceof FormData)) {
    config.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
  } else {
    // Para FormData, usar apenas os headers fornecidos
    config.headers = options.headers;
  }

  try {
    const response = await fetch(url, config);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro desconhecido na requisição");
  }
}

// Funções de autenticação
export const authApi = {
  // Login
  async login(username: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username }),
    });
  },

  // Registro
  async register(username: string): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>("/auth/register/", {
      method: "POST",
      body: JSON.stringify({ username }),
    });
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    return apiRequest<RefreshResponse>("/auth/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    });
  },

  // Perfil do usuário
  async getProfile(accessToken: string) {
    return apiRequest("/auth/profile/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

// Função para salvar tokens nos cookies
export const tokenStorage = {
  setTokens(access: string, refresh: string) {
    if (typeof window === "undefined") return;

    // Access token expira em 5 minutos
    setCookie("access_token", access, {
      maxAge: 5 * 60, // 5 minutos
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Refresh token expira em 7 dias
    setCookie("refresh_token", refresh, {
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    const token = getCookie("access_token");
    return token;
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    const token = getCookie("refresh_token");
    return token;
  },

  clearTokens() {
    if (typeof window === "undefined") return;

    removeCookie("access_token");
    removeCookie("refresh_token");
  },
};
