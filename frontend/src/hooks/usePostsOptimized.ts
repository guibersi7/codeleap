"use client";

import { createPost, deletePost, updatePost } from "@/app/actions/posts";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";

export function usePostsOptimized() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Função para criar post com otimização
  const createPostOptimized = useCallback(
    async (formData: FormData) => {
      startTransition(async () => {
        try {
          await createPost(formData);
          // Revalidar a página para mostrar os novos posts
          router.refresh();
        } catch (error) {
          console.error("Error creating post:", error);
          throw error;
        }
      });
    },
    [router]
  );

  // Função para atualizar post com otimização
  const updatePostOptimized = useCallback(
    async (id: number, formData: FormData) => {
      startTransition(async () => {
        try {
          await updatePost(id, formData);
          // Revalidar a página para mostrar as mudanças
          router.refresh();
        } catch (error) {
          console.error("Error updating post:", error);
          throw error;
        }
      });
    },
    [router]
  );

  // Função para deletar post com otimização
  const deletePostOptimized = useCallback(
    async (id: number) => {
      startTransition(async () => {
        try {
          await deletePost(id);
          // Revalidar a página para atualizar a lista
          router.refresh();
        } catch (error) {
          console.error("Error deleting post:", error);
          throw error;
        }
      });
    },
    [router]
  );

  // Função para revalidar posts manualmente
  const refreshPosts = useCallback(() => {
    router.refresh();
  }, [router]);

  return {
    isPending,
    createPost: createPostOptimized,
    updatePost: updatePostOptimized,
    deletePost: deletePostOptimized,
    refreshPosts,
  };
}
