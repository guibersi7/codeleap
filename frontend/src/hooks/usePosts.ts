"use client";

import { CreatePostData, Post, UpdatePostData } from "@/types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

// URL da API Django conforme especificado na imagem
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/careers";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/`);
      // Ordenar posts por data de criação (mais recente primeiro)
      const sortedPosts = (response.data.data || []).sort(
        (a: Post, b: Post) =>
          new Date(b.created_datetime).getTime() -
          new Date(a.created_datetime).getTime()
      );
      setPosts(sortedPosts);
    } catch (err) {
      setError("Failed to fetch posts");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(
    async (postData: CreatePostData) => {
      try {
        setError(null);
        const response = await axios.post(`${API_BASE_URL}/`, postData);
        await fetchPosts(); // Refresh the list
        return response.data;
      } catch (err) {
        setError("Failed to create post");
        console.error("Error creating post:", err);
        throw err;
      }
    },
    [fetchPosts]
  );

  const updatePost = useCallback(
    async (id: number, postData: UpdatePostData) => {
      try {
        setError(null);
        const response = await axios.patch(`${API_BASE_URL}/${id}/`, postData);
        await fetchPosts(); // Refresh the list
        return response.data;
      } catch (err) {
        setError("Failed to update post");
        console.error("Error updating post:", err);
        throw err;
      }
    },
    [fetchPosts]
  );

  const deletePost = useCallback(
    async (id: number) => {
      try {
        setError(null);
        await axios.delete(`${API_BASE_URL}/${id}/`);
        await fetchPosts(); // Refresh the list
      } catch (err) {
        setError("Failed to delete post");
        console.error("Error deleting post:", err);
        throw err;
      }
    },
    [fetchPosts]
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
}
