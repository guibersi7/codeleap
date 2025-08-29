import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://codeleap-production.up.railway.app";

// Tipos
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

// Função auxiliar para fazer requisições
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

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

// Função para obter token dos cookies
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value || null;
}

// Função para obter refresh token dos cookies
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value || null;
}

// API de autenticação server-side
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

  // Perfil do usuário (com autenticação)
  async getProfile(): Promise<any> {
    const token = await getAuthToken();

    if (!token) {
      throw new Error("Token não encontrado");
    }

    return apiRequest("/auth/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Verificar se o usuário está autenticado
  async checkAuth(): Promise<boolean> {
    try {
      await this.getProfile();
      return true;
    } catch (error) {
      return false;
    }
  },
};
