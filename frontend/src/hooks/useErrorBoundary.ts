import { useCallback, useState } from "react";

export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  const throwError = useCallback((error: Error) => {
    setError(error);
    console.error("Error thrown by useErrorBoundary:", error);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    hasError: !!error,
    throwError,
    resetError,
  };
}

export function useAsyncError() {
  const [, setError] = useState();

  return useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
}

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
