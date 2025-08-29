"use client";

import { postsApi } from "@/api/posts";
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
          const title = formData.get("title") as string;
          const content = formData.get("content") as string;

          if (!title || !content) {
            throw new Error("Title and content are required");
          }

          await createPost(formData);
          // Revalidar a página para mostrar os novos posts
          router.refresh();
        } catch (error) {
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
          const title = formData.get("title") as string;
          const content = formData.get("content") as string;

          if (!title || !content) {
            throw new Error("Title and content are required");
          }

          await updatePost(id, formData);
          // Revalidar a página para mostrar as mudanças
          router.refresh();
        } catch (error) {
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
          throw error;
        }
      });
    },
    [router]
  );

  // Função para toggle like com otimização
  const toggleLikeOptimized = useCallback(
    async (id: number) => {
      startTransition(async () => {
        try {
          await postsApi.toggleLike(id);
          // Revalidar a página para mostrar as mudanças
          router.refresh();
        } catch (error) {
          throw error;
        }
      });
    },
    [router]
  );

  // Função para criar comentário com otimização
  const createCommentOptimized = useCallback(
    async (postId: number, content: string) => {
      startTransition(async () => {
        try {
          await postsApi.createComment(postId, { content });
          // Revalidar a página para mostrar as mudanças
          router.refresh();
        } catch (error) {
          throw error;
        }
      });
    },
    [router]
  );

  // Função para deletar comentário com otimização
  const deleteCommentOptimized = useCallback(
    async (postId: number, commentId: number) => {
      startTransition(async () => {
        try {
          await postsApi.deleteComment(postId, commentId);
          // Revalidar a página para mostrar as mudanças
          router.refresh();
        } catch (error) {
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
    toggleLike: toggleLikeOptimized,
    createComment: createCommentOptimized,
    deleteComment: deleteCommentOptimized,
    refreshPosts,
  };
}
