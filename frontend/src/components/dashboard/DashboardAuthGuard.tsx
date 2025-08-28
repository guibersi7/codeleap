"use client";

import { useRequireAuth } from "@/hooks/useAuth";

interface DashboardAuthGuardProps {
  children: React.ReactNode;
}

export function DashboardAuthGuard({ children }: DashboardAuthGuardProps) {
  // Verificar se o usuário está autenticado e se a hidratação foi concluída
  const { isAuthenticated, isHydrated } = useRequireAuth();

  // Aguardar hidratação para evitar diferenças entre servidor e cliente
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar loading (será redirecionado automaticamente)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600">Redirecting to welcome...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
