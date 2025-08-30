"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { ErrorBoundary } from "./ErrorBoundary";

interface GlobalErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

function GlobalErrorFallback({ error, resetError }: GlobalErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        {/* Ícone de erro */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        {/* Título */}
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Erro na Aplicação
        </h1>

        {/* Mensagem */}
        <p className="text-gray-600 mb-6">
          Ocorreu um erro inesperado. Nossa equipe foi notificada e está
          trabalhando para resolver.
        </p>

        {/* Detalhes do erro (apenas em desenvolvimento) */}
        {process.env.NODE_ENV === "development" && error && (
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 mb-2">
              Detalhes do erro (desenvolvimento)
            </summary>
            <div className="bg-red-50 border border-red-200 rounded p-3 text-xs">
              <p className="font-semibold text-red-800 mb-1">
                {error.name}: {error.message}
              </p>
              <pre className="text-red-700 whitespace-pre-wrap overflow-auto max-h-32">
                {error.stack}
              </pre>
            </div>
          </details>
        )}

        {/* Botões de ação */}
        <div className="space-y-3">
          {resetError && (
            <button
              onClick={resetError}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </button>
          )}

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Ir para o Início
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
          >
            Recarregar Página
          </button>
        </div>

        {/* Informações adicionais */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Se o problema persistir, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
}

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

export function GlobalErrorBoundary({ children }: GlobalErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={<GlobalErrorFallback />}>{children}</ErrorBoundary>
  );
}
