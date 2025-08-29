"use client";

import { ROUTES } from "@/app/routes";
import { useUser } from "@/contexts/UserContext";
import { useAuthApi } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HydrationSafe } from "../HydrationSafe";

export function WelcomeScreen() {
  const { isHydrated } = useUser();
  const { login, isLoading, error } = useAuthApi();
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usernameInput.trim() || !isHydrated) return;

    setIsSubmitting(true);
    try {
      // Fazer login via API
      const result = await login(usernameInput.trim());

      if (result.success) {
        // Redirecionar para o dashboard
        router.push(ROUTES.DASHBOARD);
      }
    } catch (error) {
      // Handle login error silently
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = !usernameInput.trim() || isSubmitting || isLoading;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-[500px] h-full flex items-start justify-center flex-col">
        <div className="w-full mb-2">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-start">
            Welcome to CodeLeap network!
          </h1>

          <p className="text-gray-700 text-start">Please enter your username</p>
        </div>

        {error && (
          <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <HydrationSafe
          fallback={
            <div className="space-y-4 w-full">
              <div className="w-full h-[32px] px-3 py-2 border border-gray-300 rounded-md bg-gray-100 animate-pulse"></div>
              <div className="flex justify-end">
                <div className="w-[111px] h-[32px] bg-gray-300 rounded-md animate-pulse"></div>
              </div>
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <input
              type="text"
              placeholder="John doe"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full h-[32px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
              required
              disabled={isSubmitting}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isButtonDisabled}
                className={cn(
                  "px-6 py-2 rounded-md font-medium transition-colors cursor-pointer w-[111px] h-[32px] flex items-center justify-center",
                  isButtonDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#7695EC] text-white hover:bg-[#7695EC]/80"
                )}
              >
                {isLoading || isSubmitting ? "ENTERING..." : "ENTER"}
              </button>
            </div>
          </form>
        </HydrationSafe>
      </div>
    </div>
  );
}
