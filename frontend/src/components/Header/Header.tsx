"use client";

import { useAuth } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";
import { LogOut, User } from "lucide-react";

export function Header() {
  const { username, isAuthenticated, isHydrated } = useAuth();

  const handleLogout = () => {
    // Redirecionar para a tela de boas-vindas
    window.location.href = "/welcome";
  };

  return (
    <header className="bg-[#6B80F0] px-6 py-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">CodeLeap Network</h1>

        {/* Só mostrar informações do usuário após hidratação */}
        {isHydrated && isAuthenticated && username && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <User size={20} />
              <span className="font-medium">@{username}</span>
            </div>

            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-white hover:bg-white/20 transition-colors",
                "border border-white/30 hover:border-white/50"
              )}
              title="Logout"
            >
              <LogOut size={16} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
