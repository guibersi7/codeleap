"use client";

import { useUser } from "@/contexts/UserContext";

export function DebugAuth() {
  const { user } = useUser();

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs">
      <h4 className="font-bold mb-2">🔐 Auth Debug</h4>
      <pre className="whitespace-pre-wrap">{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
