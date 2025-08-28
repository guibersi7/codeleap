"use client";

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
  login: (username: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isHydrated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Chave para localStorage
const USER_STORAGE_KEY = "codeleap_user";

// Função para carregar usuário do localStorage (só no cliente)
const loadUserFromStorage = (): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
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
          localStorage.removeItem(USER_STORAGE_KEY);
          return null;
        }
      }
      return userData;
    }
  } catch (error) {
    console.error("Error loading user from storage:", error);
    localStorage.removeItem(USER_STORAGE_KEY);
  }
  return null;
};

// Função para salvar usuário no localStorage (só no cliente)
const saveUserToStorage = (user: User): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user to storage:", error);
  }
};

export function UserProvider({ children }: { children: ReactNode }) {
  // Estado inicial sempre null para evitar diferenças de hidratação
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Função de login otimizada com useCallback
  const login = useCallback((username: string) => {
    const newUser: User = {
      username: username.trim(),
      isAuthenticated: true,
      lastLogin: new Date().toISOString(),
    };

    setUser(newUser);
    saveUserToStorage(newUser);
  }, []);

  // Função de logout otimizada com useCallback
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  // Função para atualizar dados do usuário otimizada com useCallback
  const updateUser = useCallback(
    (updates: Partial<User>) => {
      if (user) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        saveUserToStorage(updatedUser);
      }
    },
    [user]
  );

  // Hidratação segura - só executar no cliente após montagem
  useEffect(() => {
    // Marcar como hidratado
    setIsHydrated(true);

    // Carregar usuário do localStorage
    const storedUser = loadUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Persistir mudanças no localStorage sempre que o usuário mudar
  useEffect(() => {
    if (user && isHydrated) {
      saveUserToStorage(user);
    }
  }, [user, isHydrated]);

  // Verificar se o usuário ainda é válido ao carregar a página
  useEffect(() => {
    if (!isHydrated) return; // Só executar após hidratação

    const checkUserValidity = () => {
      const storedUser = loadUserFromStorage();
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
  }, [user, isHydrated]);

  // Memoizar o valor do contexto para evitar re-renderizações desnecessárias
  const value = useMemo<UserContextType>(
    () => ({
      user,
      login,
      logout,
      updateUser,
      isHydrated,
    }),
    [user, login, logout, updateUser, isHydrated]
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
  const { user, isHydrated } = useUser();

  // Retornar valores padrão durante SSR para evitar diferenças de hidratação
  if (!isHydrated) {
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
