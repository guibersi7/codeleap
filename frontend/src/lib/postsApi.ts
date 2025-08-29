import { CreatePostData, Post, UpdatePostData } from "@/types";
import { AxiosError } from "axios";
import api from "./axios";

// Tipos de resposta da API
export interface PostsResponse {
  data: Post[];
  message?: string;
}

export interface PostResponse {
  data: Post;
  message?: string;
}

// API para posts com autenticação automática
export const postsApi = {
  // Buscar todos os posts
  async getPosts(): Promise<Post[]> {
    const response = await api.get<PostsResponse>("/careers/");
    return response.data.data || [];
  },

  // Buscar um post específico
  async getPost(id: number): Promise<Post | null> {
    try {
      const response = await api.get<PostResponse>(`/careers/${id}/`);
      return response.data.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Criar um novo post
  async createPost(postData: CreatePostData): Promise<Post> {
    // O backend irá obter o username do token de autenticação
    const response = await api.post<PostResponse>("/careers/", postData);
    return response.data.data;
  },

  // Atualizar um post
  async updatePost(id: number, postData: UpdatePostData): Promise<Post> {
    const response = await api.patch<PostResponse>(`/careers/${id}/`, postData);
    return response.data.data;
  },

  // Deletar um post
  async deletePost(id: number): Promise<void> {
    await api.delete(`/careers/${id}/`);
  },
};
