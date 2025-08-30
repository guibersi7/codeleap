import { useState, useCallback } from "react";

interface UseErrorBoundaryReturn {
  error: Error | null;
  hasError: boolean;
  throwError: (error: Error) => void;
  resetError: () => void;
  ErrorFallback: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export function useErrorBoundary(): UseErrorBoundaryReturn {
  const [error, setError] = useState<Error | null>(null);

  const throwError = useCallback((error: Error) => {
    setError(error);
    console.error("Error thrown by useErrorBoundary:", error);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const ErrorFallback = useCallback(
    ({ error, resetError }: { error: Error; resetError: () => void }) => {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xs">!</span>
            </div>
            <h3 className="text-lg font-semibold text-red-800">
              Erro no Componente
            </h3>
          </div>
          <p className="text-red-700 mb-3">{error.message}</p>
          <div className="flex gap-2">
            <button
              onClick={resetError}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    },
    []
  );

  return {
    error,
    hasError: !!error,
    throwError,
    resetError,
    ErrorFallback,
  };
}

// Hook para capturar erros em operações assíncronas
export function useAsyncError() {
  const [, setError] = useState();

  return useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
}

// Hook para capturar erros de fetch/API
export function useApiError() {
  const { throwError, resetError, hasError, error } = useErrorBoundary();

  const handleApiError = useCallback(
    (error: unknown) => {
      if (error instanceof Error) {
        throwError(error);
      } else if (typeof error === "string") {
        throwError(new Error(error));
      } else {
        throwError(new Error("Erro desconhecido na API"));
      }
    },
    [throwError]
  );

  return {
    error,
    hasError,
    handleApiError,
    resetError,
  };
}
