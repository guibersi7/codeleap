"use server";

import { revalidatePath } from "next/cache";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/careers";

export interface CreatePostData {
  username: string;
  title: string;
  content: string;
}

export interface UpdatePostData {
  title: string;
  content: string;
}

export interface Post {
  id: number;
  username: string;
  created_datetime: string;
  title: string;
  content: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Função para buscar posts com cache otimizado
export async function getPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Configurações de cache para melhor performance
      next: {
        revalidate: 10, // Revalidar a cada 10 segundos
        tags: ["posts"], // Tag para invalidação seletiva
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Post[]> = await response.json();

    // Ordenar posts por data de criação (mais recente primeiro)
    const sortedPosts = (result.data || []).sort(
      (a: Post, b: Post) =>
        new Date(b.created_datetime).getTime() -
        new Date(a.created_datetime).getTime()
    );

    return sortedPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

// Server Action para criar post
export async function createPost(formData: FormData) {
  const username = formData.get("username") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!username || !title || !content) {
    throw new Error("All fields are required");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, title, content }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Revalidar o cache dos posts para atualizar a lista
    revalidatePath("/dashboard");
    revalidatePath("/", "page");

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}

// Server Action para atualizar post
export async function updatePost(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Revalidar o cache dos posts
    revalidatePath("/dashboard");
    revalidatePath("/", "page");

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("Failed to update post");
  }
}

// Server Action para deletar post
export async function deletePost(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Revalidar o cache dos posts
    revalidatePath("/dashboard");
    revalidatePath("/", "page");

    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post");
  }
}

// Função para buscar um post específico
export async function getPost(id: number): Promise<Post | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 30, // Revalidar a cada 30 segundos
        tags: [`post-${id}`], // Tag específica para este post
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Post> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("Failed to fetch post");
  }
}
