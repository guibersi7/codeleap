"use client";

import { useAuth } from "@/contexts/UserContext";
import { usePostsOptimized } from "@/hooks/usePostsOptimized";
import { Post } from "@/types";
import { formatTimeAgo } from "@/utils/formatTime";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteModal } from "../Modals/DeleteModal";
import { EditModal } from "../Modals/EditModal";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { username, isHydrated } = useAuth();
  const { updatePost, deletePost, isPending } = usePostsOptimized();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [error, setError] = useState<string | null>(null);
  const [timeAgo, setTimeAgo] = useState<string>("");

  const isOwnPost = isHydrated && username === post.username;

  useEffect(() => {
    if (isHydrated) {
      setTimeAgo(formatTimeAgo(post.created_datetime));
    }
  }, [post.created_datetime, isHydrated]);

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      setShowDeleteAlert(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
    }
  };

  const handleEdit = async (formData: FormData) => {
    if (!editTitle.trim() || !editContent.trim()) {
      return;
    }

    try {
      await updatePost(post.id, formData);
      setShowEditModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post");
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
        <div className="bg-[#6B80F0] px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">{post.title}</h3>

          {isOwnPost && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Edit post"
                disabled={isPending}
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => setShowDeleteAlert(true)}
                className="text-white hover:text-red-200 transition-colors"
                aria-label="Delete post"
                disabled={isPending}
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
            <span>@{post.username}</span>
            <span>{isHydrated ? timeAgo : "Loading..."}</span>
          </div>

          <div className="text-gray-900 leading-relaxed">{post.content}</div>
        </div>
      </div>

      {showDeleteAlert && (
        <DeleteModal
          error={error}
          isPending={isPending}
          setShowDeleteAlert={setShowDeleteAlert}
          handleDelete={handleDelete}
        />
      )}

      {showEditModal && (
        <EditModal
          error={error}
          isPending={isPending}
          setShowEditModal={setShowEditModal}
          handleEdit={handleEdit}
          editTitle={editTitle}
          editContent={editContent}
          setEditTitle={setEditTitle}
          setEditContent={setEditContent}
        />
      )}
    </>
  );
}
