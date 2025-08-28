"use client";

import { Post } from "@/types";
import { PostCard } from "./PostCard";

// Componente de lista vazia
function PostsListEmpty() {
  return (
    <div className="text-center py-8">
      <div className="text-gray-600 mb-4">
        No posts yet. Be the first to create one!
      </div>
      <div className="text-sm text-gray-500">
        Posts will appear here once they are created.
      </div>
    </div>
  );
}

// Componente principal da lista de posts
interface PostsListProps {
  posts: Post[];
}

export function PostsList({ posts }: PostsListProps) {
  if (posts.length === 0) {
    return <PostsListEmpty />;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
