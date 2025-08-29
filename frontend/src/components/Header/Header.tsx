"use client";

import { useAuth } from "@/contexts/UserContext";
import { useAuthApi } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HydrationSafe } from "../HydrationSafe";

export function Header() {
  const { username, isAuthenticated, isHydrated } = useAuth();
  const { logout } = useAuthApi();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Fazer logout completo (limpa tokens e contexto)
      logout();
      // Redirecionar para a tela de boas-vindas
      router.push("/welcome");
    } catch (error) {
      // Handle logout error silently
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-[#6B80F0] px-6 py-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">CodeLeap Network</h1>

        {/* Só mostrar informações do usuário após hidratação */}
        <HydrationSafe>
          {isAuthenticated && username && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <User size={20} />
                <span className="font-medium">@{username}</span>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-white hover:bg-white/20 transition-colors",
                  "border border-white/30 hover:border-white/50",
                  isLoggingOut && "opacity-50 cursor-not-allowed"
                )}
                title="Logout"
              >
                <LogOut size={16} />
                <span className="text-sm">
                  {isLoggingOut ? "Saindo..." : "Logout"}
                </span>
              </button>
            </div>
          )}
        </HydrationSafe>
      </div>
    </header>
  );
}
