import {
  Comment,
  CommentResponse,
  CreateCommentData,
  CreatePostData,
  LikeResponse,
  Mention,
  Post,
  UpdateCommentData,
  UpdatePostData,
} from "@/types";
import { getCookie } from "@/utils/cookies";

// URL hardcoded para garantir que funcione na Vercel
const API_BASE_URL = "https://codeleap-production.up.railway.app";

// Tipos de resposta da API
export interface PostsResponse {
  data: Post[];
  message?: string;
}

export interface PostResponse {
  data: Post;
  message?: string;
}

export interface CommentsResponse {
  success: boolean;
  data: Comment[];
}

export interface MentionsResponse {
  success: boolean;
  data: Mention[];
}

// Função auxiliar para fazer requisições
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
  };

  // Adicionar Content-Type apenas se não for FormData
  if (!(options.body instanceof FormData)) {
    config.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
  } else {
    // Para FormData, usar apenas os headers fornecidos
    config.headers = options.headers;
  }

  try {
    const response = await fetch(url, config);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro desconhecido na requisição");
  }
}

// Função genérica para requisição autenticada (client-side)
async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let token: string | null = null;

  if (typeof window !== "undefined") {
    token = getCookie("access_token");
  }

  if (!token) {
    throw new Error("Token de autenticação não encontrado");
  }

  const finalOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };

  return apiRequest<T>(endpoint, finalOptions);
}

// API de posts client-side (para uso em componentes client)
export const postsApi = {
  // Buscar todos os posts
  async getPosts(): Promise<Post[]> {
    const response = await authenticatedRequest<PostsResponse>("/careers/");
    return response.data || [];
  },

  // Buscar um post específico
  async getPost(id: number): Promise<Post | null> {
    try {
      const response = await authenticatedRequest<PostResponse>(
        `/careers/${id}/`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  },

  // Criar um novo post
  async createPost(postData: CreatePostData): Promise<Post> {
    // Se há uma imagem, usar FormData
    if (postData.image) {
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("content", postData.content);
      formData.append("image", postData.image);

      const response = await authenticatedRequest<PostResponse>("/careers/", {
        method: "POST",
        body: formData,
        headers: {}, // Remover Content-Type para que o browser defina automaticamente para multipart/form-data
      });
      return response.data;
    } else {
      // Sem imagem, usar JSON
      const response = await authenticatedRequest<PostResponse>("/careers/", {
        method: "POST",
        body: JSON.stringify(postData),
      });
      return response.data;
    }
  },

  // Atualizar um post existente
  async updatePost(id: number, postData: UpdatePostData): Promise<Post> {
    // Se há uma imagem, usar FormData
    if (postData.image) {
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("content", postData.content);
      formData.append("image", postData.image);

      const response = await authenticatedRequest<PostResponse>(
        `/careers/${id}/`,
        {
          method: "PATCH",
          body: formData,
          headers: {}, // Remover Content-Type para que o browser defina automaticamente para multipart/form-data
        }
      );
      return response.data;
    } else {
      // Sem imagem, usar JSON
      const response = await authenticatedRequest<PostResponse>(
        `/careers/${id}/`,
        {
          method: "PATCH",
          body: JSON.stringify(postData),
        }
      );
      return response.data;
    }
  },

  // Deletar um post
  async deletePost(id: number): Promise<void> {
    await authenticatedRequest(`/careers/${id}/`, {
      method: "DELETE",
    });
  },

  // Toggle like em um post
  async toggleLike(id: number): Promise<LikeResponse> {
    const response = await authenticatedRequest<LikeResponse>(
      `/careers/${id}/like/`,
      {
        method: "POST",
      }
    );
    return response;
  },

  // Buscar comentários de um post
  async getComments(id: number): Promise<Comment[]> {
    const response = await authenticatedRequest<CommentsResponse>(
      `/careers/${id}/comments/`
    );
    return response.data || [];
  },

  // Criar comentário em um post
  async createComment(
    postId: number,
    commentData: CreateCommentData
  ): Promise<Comment> {
    const response = await authenticatedRequest<CommentResponse>(
      `/careers/${postId}/comments/`,
      {
        method: "POST",
        body: JSON.stringify(commentData),
      }
    );
    return response.data;
  },

  // Atualizar comentário
  async updateComment(
    postId: number,
    commentId: number,
    commentData: UpdateCommentData
  ): Promise<Comment> {
    const response = await authenticatedRequest<CommentResponse>(
      `/careers/${postId}/comments/${commentId}/`,
      {
        method: "PATCH",
        body: JSON.stringify(commentData),
      }
    );
    return response.data;
  },

  // Deletar comentário
  async deleteComment(postId: number, commentId: number): Promise<void> {
    await authenticatedRequest(`/careers/${postId}/comments/${commentId}/`, {
      method: "DELETE",
    });
  },

  // Buscar menções de um post
  async getMentions(id: number): Promise<Mention[]> {
    const response = await authenticatedRequest<MentionsResponse>(
      `/careers/${id}/mentions/`
    );
    return response.data || [];
  },
};
