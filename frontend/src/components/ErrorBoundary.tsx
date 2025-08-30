"use client";

import { AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Gerar ID único para o erro
    const errorId = `error-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Log do erro para debugging
    console.error("Error Boundary caught an error:", {
      error,
      errorInfo,
      errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });

    // Aqui você pode enviar o erro para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
    this.logErrorToService(error, errorInfo, errorId);
  }

  private logErrorToService(
    error: Error,
    errorInfo: ErrorInfo,
    errorId: string
  ) {
    // Exemplo de como enviar para um serviço de monitoramento
    try {
      // fetch('/api/error-log', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     errorId,
      //     message: error.message,
      //     stack: error.stack,
      //     componentStack: errorInfo.componentStack,
      //     url: window.location.href,
      //     userAgent: navigator.userAgent,
      //     timestamp: new Date().toISOString(),
      //   })
      // });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleGoBack = () => {
    window.history.back();
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Se há um fallback customizado, use-o
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            {/* Ícone de erro */}
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            {/* Título */}
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Ops! Algo deu errado
            </h1>

            {/* Mensagem */}
            <p className="text-gray-600 mb-6">
              Encontramos um problema inesperado. Não se preocupe, nossa equipe
              foi notificada.
            </p>

            {/* ID do erro para debugging */}
            {this.state.errorId && (
              <div className="bg-gray-100 rounded p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">ID do Erro:</p>
                <p className="text-xs font-mono text-gray-700 break-all">
                  {this.state.errorId}
                </p>
              </div>
            )}

            {/* Detalhes do erro (apenas em desenvolvimento) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 mb-2">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <div className="bg-red-50 border border-red-200 rounded p-3 text-xs">
                  <p className="font-semibold text-red-800 mb-1">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  <pre className="text-red-700 whitespace-pre-wrap overflow-auto max-h-32">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <div className="mt-2">
                      <p className="font-semibold text-red-800 mb-1">
                        Component Stack:
                      </p>
                      <pre className="text-red-700 whitespace-pre-wrap overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Botões de ação */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Tentar Novamente
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={this.handleGoBack}
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </button>

                <button
                  onClick={this.handleGoHome}
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Início
                </button>
              </div>

              <button
                onClick={this.handleReload}
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

    return this.props.children;
  }
}

// Hook para usar em componentes funcionais
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
    console.error("Error caught by useErrorHandler:", error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}

// Componente para capturar erros em componentes funcionais
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h2 className="text-lg font-semibold text-red-800">
          Erro no Componente
        </h2>
      </div>
      <p className="text-red-700 mb-3">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
      >
        Tentar Novamente
      </button>
    </div>
  );
}
