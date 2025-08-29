"use client";

import { ROUTES } from "@/app/routes";
import { useUser, useAuth as useUserAuth } from "@/contexts/UserContext";
import { authApi, tokenStorage } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export function useAuthGuard(requireAuth: boolean = true) {
  const { isAuthenticated, username, isHydrated } = useUserAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  const redirect = useCallback(
    (path: string) => {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        router.push(path);
      }
    },
    [router]
  );

  useEffect(() => {
    if (!isHydrated) return;

    hasRedirected.current = false;

    if (requireAuth && !isAuthenticated) {
      redirect(ROUTES.WELCOME);
    } else if (!requireAuth && isAuthenticated) {
      redirect(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, requireAuth, redirect, isHydrated]);

  return { isAuthenticated, username, isHydrated };
}

export function useRequireAuth() {
  return useAuthGuard(true);
}

export function useRequireNoAuth() {
  return useAuthGuard(false);
}

// Hook para autenticação com API
export function useAuthApi() {
  const { login: contextLogin, logout: contextLogout } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função de login com API
  const login = useCallback(
    async (username: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.login(username);

        if (response.success) {
          // Salvar tokens
          tokenStorage.setTokens(
            response.data.tokens.access,
            response.data.tokens.refresh
          );

          // Atualizar contexto com os tokens
          contextLogin(
            response.data.user.username,
            response.data.tokens.access,
            response.data.tokens.refresh
          );

          return {
            success: true,
            user: response.data.user,
            tokens: response.data.tokens,
          };
        } else {
          throw new Error(response.message || "Erro no login");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [contextLogin]
  );

  // Função de registro com API
  const register = useCallback(
    async (username: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.register(username);

        if (response.success) {
          // Salvar tokens
          tokenStorage.setTokens(
            response.data.tokens.access,
            response.data.tokens.refresh
          );

          // Atualizar contexto com os tokens
          contextLogin(
            response.data.user.username,
            response.data.tokens.access,
            response.data.tokens.refresh
          );

          return {
            success: true,
            user: response.data.user,
            tokens: response.data.tokens,
          };
        } else {
          throw new Error(response.message || "Erro no registro");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [contextLogin]
  );

  // Função de refresh token
  const refreshToken = useCallback(async () => {
    const refreshTokenValue = tokenStorage.getRefreshToken();

    if (!refreshTokenValue) {
      throw new Error("Refresh token não encontrado");
    }

    try {
      const response = await authApi.refreshToken(refreshTokenValue);

      if (response.success) {
        // Atualizar access token
        const currentRefresh = tokenStorage.getRefreshToken();
        if (currentRefresh) {
          tokenStorage.setTokens(response.data.access, currentRefresh);
        }

        return {
          success: true,
          accessToken: response.data.access,
        };
      } else {
        throw new Error(response.message || "Erro ao renovar token");
      }
    } catch (err) {
      // Se o refresh token expirou, fazer logout
      if (
        err instanceof Error &&
        err.message.includes("Token is invalid or expired")
      ) {
        logout();
      }
      throw err;
    }
  }, []);

  // Função de logout
  const logout = useCallback(() => {
    // Limpar tokens
    tokenStorage.clearTokens();

    // Limpar contexto
    contextLogout();

    // Limpar estado
    setError(null);
  }, [contextLogout]);

  // Função para verificar se o token ainda é válido
  const checkAuth = useCallback(async () => {
    const accessToken = tokenStorage.getAccessToken();

    if (!accessToken) {
      return false;
    }

    try {
      await authApi.getProfile(accessToken);
      return true;
    } catch (err) {
      // Se o token expirou, tentar renovar
      try {
        await refreshToken();
        return true;
      } catch (refreshErr) {
        // Se não conseguir renovar, fazer logout
        logout();
        return false;
      }
    }
  }, [refreshToken, logout]);

  return {
    login,
    register,
    refreshToken,
    logout,
    checkAuth,
    isLoading,
    error,
  };
}
