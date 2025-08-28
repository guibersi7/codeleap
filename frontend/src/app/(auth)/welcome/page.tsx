"use client";

import { WelcomeScreen } from "@/components/Welcome/WelcomeScreen";
import { useRequireNoAuth } from "@/hooks/useAuth";

export default function WelcomePage() {
  // Verificar se o usuário já está autenticado
  const { isAuthenticated } = useRequireNoAuth();

  // Se estiver autenticado, mostrar loading (será redirecionado automaticamente)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600">Redirecting to dashboard...</div>
        </div>
      </div>
    );
  }

  return <WelcomeScreen />;
}
