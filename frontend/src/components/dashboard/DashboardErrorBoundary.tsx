"use client";

import { AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import { ErrorBoundary } from "../ErrorBoundary";

function DashboardErrorFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        {/* Ícone de erro */}
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-blue-600" />
        </div>

        {/* Título */}
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Erro no Dashboard
        </h1>

        {/* Mensagem */}
        <p className="text-gray-600 mb-6">
          Houve um problema ao carregar o dashboard. Tente novamente ou volte
          para a página inicial.
        </p>

        {/* Botões de ação */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Recarregar Dashboard
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => window.history.back()}
              className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Início
            </button>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Se o problema persistir, faça logout e entre novamente.
          </p>
        </div>
      </div>
    </div>
  );
}

interface DashboardErrorBoundaryProps {
  children: React.ReactNode;
}

export function DashboardErrorBoundary({
  children,
}: DashboardErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={<DashboardErrorFallback />}>
      {children}
    </ErrorBoundary>
  );
}
