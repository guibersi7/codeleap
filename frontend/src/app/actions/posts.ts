"use server";

import { postsApiServer } from "@/api/postsServer";
import { CreatePostData, Post, UpdatePostData } from "@/types";
import { revalidatePath } from "next/cache";
import { getCurrentUsernameAction } from "./auth";

// Função para buscar posts com cache otimizado
export async function getPosts(): Promise<Post[]> {
  try {
    const posts = await postsApiServer.getPosts();

    // Ordenar posts por data de criação (mais recente primeiro)
    const sortedPosts = posts.sort(
      (a: Post, b: Post) =>
        new Date(b.created_datetime).getTime() -
        new Date(a.created_datetime).getTime()
    );

    return sortedPosts;
  } catch (error) {
    throw new Error("Failed to fetch posts");
  }
}

// Server Action para criar post
export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const image = formData.get("image") as File | null;

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  try {
    // Obter o username do usuário logado
    const usernameResult = await getCurrentUsernameAction();
    if (!usernameResult.success) {
      throw new Error("Failed to get current user");
    }

    const postData: CreatePostData = {
      title: title.trim(),
      content: content.trim(),
      image: image || null,
    };

    const result = await postsApiServer.createPost(postData);

    // Revalidar o cache dos posts para atualizar a lista
    revalidatePath("/dashboard");
    revalidatePath("/", "page");

    return { success: true, data: result };
  } catch (error) {
    throw new Error("Failed to create post");
  }
}

// Server Action para atualizar post
export async function updatePost(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const image = formData.get("image") as File | null;

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  try {
    // Obter o username do usuário logado
    const usernameResult = await getCurrentUsernameAction();
    if (!usernameResult.success) {
      throw new Error("Failed to get current user");
    }

    const postData: UpdatePostData = {
      title: title.trim(),
      content: content.trim(),
      image: image || null,
    };

    const result = await postsApiServer.updatePost(id, postData);

    // Revalidar o cache dos posts
    revalidatePath("/dashboard");
    revalidatePath("/", "page");

    return { success: true, data: result };
  } catch (error) {
    throw new Error("Failed to update post");
  }
}

// Server Action para deletar post
export async function deletePost(id: number) {
  try {
    await postsApiServer.deletePost(id);

    // Revalidar o cache dos posts
    revalidatePath("/dashboard");
    revalidatePath("/", "page");

    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete post");
  }
}

// Função para buscar um post específico
export async function getPost(id: number): Promise<Post | null> {
  try {
    return await postsApiServer.getPost(id);
  } catch (error) {
    return null;
  }
}
