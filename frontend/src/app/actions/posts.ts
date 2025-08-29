"use server";

import { CreatePostData, Post, UpdatePostData } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/lib/utils";

// URL base da API baseada no ambiente
const API_BASE_URL = getApiBaseUrl();

// Função auxiliar para fazer requisições autenticadas
async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Token de autenticação não encontrado");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Função para buscar posts
export async function getPosts(): Promise<Post[]> {
  try {
    const response = await authenticatedRequest<{ data: Post[] }>("/careers/");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Server Action para criar post
export async function createPost(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File | null;

    if (!title || !content) {
      throw new Error("Title and content are required");
    }

    let body: string | FormData;
    const headers: Record<string, string> = {};

    if (image) {
      // Se há imagem, usar FormData
      const formDataToSend = new FormData();
      formDataToSend.append("title", title.trim());
      formDataToSend.append("content", content.trim());
      formDataToSend.append("image", image);
      body = formDataToSend;
      // Não definir Content-Type para FormData
    } else {
      // Sem imagem, usar JSON
      body = JSON.stringify({
        title: title.trim(),
        content: content.trim(),
      });
      headers["Content-Type"] = "application/json";
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const response = await fetch(`${API_BASE_URL}/careers/`, {
      method: "POST",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Revalidar o cache dos posts para atualizar a lista
    revalidatePath("/dashboard");
    revalidatePath("/", "page");

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create post");
  }
}

// Server Action para atualizar post
export async function updatePost(id: number, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File | null;

    if (!title || !content) {
      throw new Error("Title and content are required");
    }

    let body: string | FormData;
    const headers: Record<string, string> = {};

    if (image) {
      // Se há imagem, usar FormData
      const formDataToSend = new FormData();
      formDataToSend.append("title", title.trim());
      formDataToSend.append("content", content.trim());
      formDataToSend.append("image", image);
      body = formDataToSend;
      // Não definir Content-Type para FormData
    } else {
      // Sem imagem, usar JSON
      body = JSON.stringify({
        title: title.trim(),
        content: content.trim(),
      });
      headers["Content-Type"] = "application/json";
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const response = await fetch(`${API_BASE_URL}/careers/${id}/`, {
      method: "PATCH",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Revalidar o cache dos posts
    revalidatePath("/dashboard");
    revalidatePath("/", "page");

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update post");
  }
}

// Server Action para deletar post
export async function deletePost(id: number) {
  try {
    await authenticatedRequest(`/careers/${id}/`, {
      method: "DELETE",
    });

    // Revalidar o cache dos posts
    revalidatePath("/dashboard");
    revalidatePath("/", "page");

    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete post");
  }
}

// Função para buscar um post específico
export async function getPost(id: number): Promise<Post | null> {
  try {
    const response = await authenticatedRequest<{ data: Post }>(`/careers/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}
