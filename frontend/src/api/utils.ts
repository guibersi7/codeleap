import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Funções para gerenciar cookies no servidor
export const cookieUtils = {
  // Obter token de acesso dos cookies
  async getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("access_token")?.value || null;
  },

  // Obter refresh token dos cookies
  async getRefreshToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("refresh_token")?.value || null;
  },

  // Obter dados do usuário dos cookies
  async getUserData(): Promise<any> {
    const cookieStore = await cookies();
    const userData = cookieStore.get("user_data")?.value;
    return userData ? JSON.parse(userData) : null;
  },

  // Definir cookies (para uso em server actions)
  setCookies(
    response: NextResponse,
    tokens: { access: string; refresh: string },
    userData?: any
  ) {
    // Access token - 1 hora
    response.cookies.set("access_token", tokens.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hora
    });

    // Refresh token - 7 dias
    response.cookies.set("refresh_token", tokens.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    // Dados do usuário
    if (userData) {
      response.cookies.set("user_data", JSON.stringify(userData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 dias
      });
    }

    return response;
  },

  // Limpar cookies
  clearCookies(response: NextResponse) {
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("user_data");
    return response;
  },
};

// Função para verificar se o usuário está autenticado
export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = await cookieUtils.getAccessToken();
    if (!token) return false;

    // Verificar se o token é válido fazendo uma requisição para o perfil
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/auth/profile/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.ok;
  } catch (error) {
    return false;
  }
}

// Função para obter dados do usuário autenticado
export async function getAuthenticatedUser() {
  try {
    const token = await cookieUtils.getAccessToken();
    if (!token) return null;

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/auth/profile/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.data;
  } catch (error) {
    return null;
  }
}
