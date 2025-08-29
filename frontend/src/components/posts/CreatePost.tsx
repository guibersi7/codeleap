"use client";

import { useAuth } from "@/contexts/UserContext";
import { usePostsOptimized } from "@/hooks/usePostsOptimized";
import { cn } from "@/lib/utils";
import { Image, Info, User, X } from "lucide-react";
import { useRef, useState } from "react";
import { HydrationSafe } from "../HydrationSafe";
import { ButtonLoadingSpinner } from "../Loading/LoadingSpinner";

export function CreatePost() {
  const { username } = useAuth();
  const { createPost, isPending } = usePostsOptimized();
  const [error, setError] = useState<string | null>(null);
  const [showMentionHelp, setShowMentionHelp] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Verificar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setSelectedImage(file);
      setError(null);

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (!username) {
      setError("You must be logged in to create a post");
      return;
    }

    setError(null);

    try {
      // Adicionar imagem ao FormData se selecionada
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await createPost(formData);

      // Limpar o formulário
      const form = document.getElementById(
        "create-post-form"
      ) as HTMLFormElement;
      if (form) {
        form.reset();
      }

      // Limpar imagem
      setSelectedImage(null);
      setImagePreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    }
  };

  return (
    <HydrationSafe
      fallback={
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
          <div className="text-center text-gray-500">Loading...</div>
        </div>
      }
    >
      {!username ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
          <div className="text-center text-gray-500">
            Please log in to create posts
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              What&apos;s on your mind?
            </h2>
            <button
              type="button"
              onClick={() => setShowMentionHelp(!showMentionHelp)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="Como usar menções"
            >
              <Info size={20} />
            </button>
          </div>

          {/* Ajuda sobre menções */}
          {showMentionHelp && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <User size={16} className="text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Como usar menções:</p>
                  <p>
                    Use @username para mencionar outros usuários em seus posts e
                    comentários.
                  </p>
                  <p className="text-xs mt-2 text-blue-700">
                    Exemplo: &ldquo;Olá @joao, o que você acha dessa
                    ideia?&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div
              id="post-error"
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
              role="alert"
              aria-live="polite"
            >
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form
            id="create-post-form"
            action={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label htmlFor="post-title" className="sr-only">
                Post Title
              </label>
              <input
                id="post-title"
                type="text"
                name="title"
                placeholder="Hello world"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                required
                disabled={isPending}
                aria-describedby={error ? "post-error" : undefined}
              />
            </div>

            <div>
              <label htmlFor="post-content" className="sr-only">
                Post Content
              </label>
              <textarea
                id="post-content"
                name="content"
                placeholder="Content here (use @username para mencionar usuários)"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400 resize-none"
                required
                disabled={isPending}
                aria-describedby={error ? "post-error" : undefined}
              />
            </div>

            {/* Upload de imagem */}
            <div>
              <label htmlFor="post-image" className="sr-only">
                Post Image
              </label>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  id="post-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <Image size={16} />
                  Add Image
                </button>
                {selectedImage && (
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={isPending}
                    className="flex items-center gap-2 px-3 py-2 border border-red-300 rounded-md hover:bg-red-50 transition-colors text-red-700"
                  >
                    <X size={16} />
                    Remove
                  </button>
                )}
              </div>

              {/* Preview da imagem */}
              {imagePreview && (
                <div className="mt-2 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-48 rounded-md border border-gray-300"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                aria-label={isPending ? "Creating post..." : "Create post"}
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
      )}
    </HydrationSafe>
  );
}
