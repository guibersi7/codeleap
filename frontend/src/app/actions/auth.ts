"use server";

import { authApi } from "@/api/auth";
import { cookies } from "next/headers";

// Server Action para login
export async function loginAction(username: string) {
  try {
    const response = await authApi.login(username);

    if (response.success) {
      const cookieStore = await cookies();

      // Definir cookies com os tokens
      cookieStore.set("access_token", response.data.tokens.access, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
        maxAge: 60 * 60, // 1 hora
      });

      cookieStore.set("refresh_token", response.data.tokens.refresh, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
        maxAge: 7 * 24 * 60 * 60, // 7 dias
      });

      // Dados do usuário
      cookieStore.set("user_data", JSON.stringify(response.data.user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
        maxAge: 7 * 24 * 60 * 60, // 7 dias
      });

      return {
        success: true,
        user: response.data.user,
        message: "Login realizado com sucesso",
      };
    } else {
      return {
        success: false,
        message: response.message || "Erro no login",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// Server Action para registro
export async function registerAction(username: string) {
  try {
    const response = await authApi.register(username);

    if (response.success) {
      const cookieStore = await cookies();

      // Definir cookies com os tokens
      cookieStore.set("access_token", response.data.tokens.access, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
        maxAge: 60 * 60, // 1 hora
      });

      cookieStore.set("refresh_token", response.data.tokens.refresh, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
        maxAge: 7 * 24 * 60 * 60, // 7 dias
      });

      // Dados do usuário
      cookieStore.set("user_data", JSON.stringify(response.data.user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
        maxAge: 7 * 24 * 60 * 60, // 7 dias
      });

      return {
        success: true,
        user: response.data.user,
        message: "Registro realizado com sucesso",
      };
    } else {
      return {
        success: false,
        message: response.message || "Erro no registro",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// Server Action para logout
export async function logoutAction() {
  try {
    const cookieStore = await cookies();

    // Limpar cookies
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("user_data");

    return {
      success: true,
      message: "Logout realizado com sucesso",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// Server Action para verificar autenticação
export async function checkAuthAction() {
  try {
    const isAuth = await authApi.checkAuth();
    return {
      success: true,
      isAuthenticated: isAuth,
    };
  } catch (error) {
    return {
      success: false,
      isAuthenticated: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// Server Action para obter perfil do usuário
export async function getProfileAction() {
  try {
    const profile = await authApi.getProfile();
    return {
      success: true,
      profile: profile.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// Server Action para obter username do usuário logado
export async function getCurrentUsernameAction() {
  try {
    const cookieStore = await cookies();
    const userData = cookieStore.get("user_data")?.value;

    if (userData) {
      const user = JSON.parse(userData);
      return {
        success: true,
        username: user.username,
      };
    } else {
      return {
        success: false,
        message: "Usuário não encontrado",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
