"use client";

import { getCookie, removeCookie, setCookie } from "@/utils/cookies";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface User {
  username: string;
  isAuthenticated: boolean;
  lastLogin?: string;
}

interface UserContextType {
  user: User | null;
  login: (
    username: string,
    accessToken?: string,
    refreshToken?: string
  ) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isHydrated: boolean;
  mounted: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Chave para cookies
const USER_COOKIE_KEY = "codeleap_user";
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Função para carregar usuário dos cookies (só no cliente)
const loadUserFromCookies = (): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = getCookie(USER_COOKIE_KEY);
    if (stored) {
      const userData = JSON.parse(stored);
      // Verificar se o usuário ainda é válido (não expirou)
      if (userData.lastLogin) {
        const lastLogin = new Date(userData.lastLogin);
        const now = new Date();
        const diffInHours =
          (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);

        // Se passou mais de 24 horas, fazer logout
        if (diffInHours > 24) {
          removeCookie(USER_COOKIE_KEY);
          removeCookie(ACCESS_TOKEN_KEY);
          removeCookie(REFRESH_TOKEN_KEY);
          return null;
        }
      }
      return userData;
    }
  } catch (error) {
    removeCookie(USER_COOKIE_KEY);
    removeCookie(ACCESS_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
  }
  return null;
};

// Função para salvar usuário nos cookies (só no cliente)
const saveUserToCookies = (user: User): void => {
  if (typeof window === "undefined") return;

  try {
    // Salvar dados do usuário
    setCookie(USER_COOKIE_KEY, JSON.stringify(user), {
      maxAge: 24 * 60 * 60, // 24 horas
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to save user to cookies:", error);
    }
  }
};

// Função para salvar tokens nos cookies
const saveTokensToCookies = (
  accessToken: string,
  refreshToken: string
): void => {
  if (typeof window === "undefined") return;

  try {
    // Access token expira em 5 minutos
    setCookie(ACCESS_TOKEN_KEY, accessToken, {
      maxAge: 5 * 60, // 5 minutos
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Refresh token expira em 7 dias
    setCookie(REFRESH_TOKEN_KEY, refreshToken, {
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to save tokens to cookies:", error);
    }
  }
};

export function UserProvider({ children }: { children: ReactNode }) {
  // Estado inicial sempre null para evitar diferenças de hidratação
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Função de login otimizada com useCallback
  const login = useCallback(
    (username: string, accessToken?: string, refreshToken?: string) => {
      const newUser: User = {
        username: username.trim(),
        isAuthenticated: true,
        lastLogin: new Date().toISOString(),
      };

      setUser(newUser);
      saveUserToCookies(newUser);

      // Salvar tokens se fornecidos
      if (accessToken && refreshToken) {
        saveTokensToCookies(accessToken, refreshToken);
      }
    },
    []
  );

  // Função de logout otimizada com useCallback
  const logout = useCallback(() => {
    setUser(null);
    removeCookie(USER_COOKIE_KEY);
    removeCookie(ACCESS_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
  }, []);

  // Função para atualizar dados do usuário otimizada com useCallback
  const updateUser = useCallback(
    (updates: Partial<User>) => {
      if (user) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        saveUserToCookies(updatedUser);
      }
    },
    [user]
  );

  // Hidratação segura - só executar no cliente após montagem
  useEffect(() => {
    // Marcar como montado
    setMounted(true);

    // Aguardar um tick para garantir que o DOM está pronto
    const timer = setTimeout(() => {
      setIsHydrated(true);

      // Carregar usuário dos cookies
      const storedUser = loadUserFromCookies();
      if (storedUser) {
        setUser(storedUser);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Persistir mudanças nos cookies sempre que o usuário mudar
  useEffect(() => {
    if (user && isHydrated) {
      saveUserToCookies(user);
    }
  }, [user, isHydrated]);

  // Verificar se o usuário ainda é válido ao carregar a página
  useEffect(() => {
    if (!isHydrated) return; // Só executar após hidratação

    const checkUserValidity = () => {
      const storedUser = loadUserFromCookies();
      // Só atualizar se realmente for diferente para evitar loops
      if (
        storedUser &&
        (!user ||
          storedUser.username !== user.username ||
          storedUser.lastLogin !== user.lastLogin)
      ) {
        setUser(storedUser);
      }
    };

    // Verificar ao carregar a página
    checkUserValidity();

    // Verificar quando a janela ganha foco (usuário volta para a aba)
    const handleFocus = () => {
      checkUserValidity();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isHydrated]); // Removido 'user' das dependências para evitar loops

  // Memoizar o valor do contexto para evitar re-renderizações desnecessárias
  const value = useMemo<UserContextType>(
    () => ({
      user,
      login,
      logout,
      updateUser,
      isHydrated,
      mounted,
    }),
    [user, login, logout, updateUser, isHydrated, mounted]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Hook para verificar se o usuário está autenticado
export function useAuth() {
  const { user, isHydrated, mounted } = useUser();

  // Retornar valores padrão durante SSR para evitar diferenças de hidratação
  if (!mounted || !isHydrated) {
    return {
      isAuthenticated: false,
      username: null,
      isHydrated: false,
    };
  }

  return {
    isAuthenticated: user?.isAuthenticated || false,
    username: user?.username || null,
    isHydrated: true,
  };
}
