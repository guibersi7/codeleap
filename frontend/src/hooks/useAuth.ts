"use client";

import { ROUTES } from "@/app/routes";
import { useAuth as useUserAuth } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

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
    // Só executar após hidratação para evitar problemas de SSR
    if (!isHydrated) return;

    // Reset flag quando as dependências mudam
    hasRedirected.current = false;

    if (requireAuth && !isAuthenticated) {
      // Se precisa de autenticação mas não está autenticado, redirecionar para welcome
      redirect(ROUTES.WELCOME);
    } else if (!requireAuth && isAuthenticated) {
      // Se não precisa de autenticação mas está autenticado, redirecionar para dashboard
      redirect(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, requireAuth, redirect, isHydrated]);

  return { isAuthenticated, username, isHydrated };
}

// Hook para proteger rotas que precisam de autenticação
export function useRequireAuth() {
  return useAuthGuard(true);
}

// Hook para rotas que não devem ser acessadas quando autenticado
export function useRequireNoAuth() {
  return useAuthGuard(false);
}
