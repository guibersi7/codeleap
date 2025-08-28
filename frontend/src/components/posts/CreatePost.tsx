"use client";

import { useAuth } from "@/contexts/UserContext";
import { usePostsOptimized } from "@/hooks/usePostsOptimized";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ButtonLoadingSpinner } from "../Loading/LoadingSpinner";

export function CreatePost() {
  const { username, isHydrated } = useAuth();
  const { createPost, isPending } = usePostsOptimized();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    if (!username) {
      setError("You must be logged in to create a post");
      return;
    }

    // Adicionar username ao formData
    formData.append("username", username);

    setError(null);

    try {
      await createPost(formData);

      // Limpar o formulário
      const form = document.getElementById(
        "create-post-form"
      ) as HTMLFormElement;
      if (form) {
        form.reset();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    }
  };

  // Aguardar hidratação para evitar diferenças entre servidor e cliente
  if (!isHydrated) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
        <div className="text-center text-gray-500">
          Please log in to create posts
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        What&apos;s on your mind?
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form id="create-post-form" action={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="title"
            placeholder="Hello world"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
            required
            disabled={isPending}
          />
        </div>

        <div>
          <textarea
            name="content"
            placeholder="Content here"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400 resize-none"
            required
            disabled={isPending}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2",
              isPending
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#7695EC] text-white hover:bg-[#7695EC]/80"
            )}
          >
            {isPending ? (
              <>
                <ButtonLoadingSpinner />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
