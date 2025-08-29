"use client";

import { postsApi } from "@/api/posts";
import { useAuth } from "@/contexts/UserContext";
import { useState } from "react";

export function DebugAuth() {
  const { username, isAuthenticated, isHydrated } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testGetPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const postsData = await postsApi.getPosts();
      setPosts(postsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const testCreatePost = async () => {
    setLoading(true);
    setError(null);
    try {
      const newPost = await postsApi.createPost({
        title: "Test Post",
        content: "This is a test post created by the debug component",
      });
      setPosts((prev) => [newPost, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Debug Authentication
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">User Context:</h3>
          <p>Username: {username || "null"}</p>
          <p>Is Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
          <p>Is Hydrated: {isHydrated ? "Yes" : "No"}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Local Storage:</h3>
          <p>
            Access Token:{" "}
            {typeof window !== "undefined"
              ? localStorage.getItem("access_token")?.substring(0, 20) + "..."
              : "N/A"}
          </p>
          <p>
            Refresh Token:{" "}
            {typeof window !== "undefined"
              ? localStorage.getItem("refresh_token")?.substring(0, 20) + "..."
              : "N/A"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">API Tests:</h3>
          <div className="space-x-2">
            <button
              onClick={testGetPosts}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              {loading ? "Loading..." : "Get Posts"}
            </button>
            <button
              onClick={testCreatePost}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
            >
              {loading ? "Loading..." : "Create Test Post"}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">Error: {error}</p>
          </div>
        )}

        {posts.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700">
              Posts ({posts.length}):
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {posts.map((post, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                  <p>
                    <strong>Title:</strong> {post.title}
                  </p>
                  <p>
                    <strong>Username:</strong> {post.username}
                  </p>
                  <p>
                    <strong>Content:</strong> {post.content.substring(0, 50)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
