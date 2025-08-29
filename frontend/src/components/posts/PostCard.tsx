"use client";

import { postsApi } from "@/api/posts";
import { useAuth } from "@/contexts/UserContext";
import { usePostsOptimized } from "@/hooks/usePostsOptimized";
import { Comment, CreateCommentData, Post } from "@/types";
import { formatTimeAgo } from "@/utils/formatTime";
import { Edit, Heart, MessageCircle, Send, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { HydrationSafe } from "../HydrationSafe";
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
  const [showFullContent, setShowFullContent] = useState(false);

  // Estados para likes, comments e menções
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [userLiked, setUserLiked] = useState(post.user_liked);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const isOwnPost = isHydrated && username === post.username;

  useEffect(() => {
    if (isHydrated) {
      setTimeAgo(formatTimeAgo(post.created_datetime));
    }
  }, [post.created_datetime, isHydrated]);

  // Carregar comentários quando necessário
  useEffect(() => {
    if (showComments && comments.length === 0) {
      loadComments();
    }
  }, [showComments]);

  const loadComments = async () => {
    try {
      setIsLoadingComments(true);
      const commentsData = await postsApi.getComments(post.id);
      setComments(commentsData);
    } catch (err) {
      console.error("Erro ao carregar comentários:", err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleToggleLike = async () => {
    if (!isHydrated) return;

    try {
      const response = await postsApi.toggleLike(post.id);
      setLikesCount(response.data.likes_count);
      setUserLiked(response.data.user_liked);
    } catch (err) {
      console.error("Erro ao dar like:", err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isHydrated) return;

    try {
      setIsSubmittingComment(true);
      const commentData: CreateCommentData = { content: newComment };
      const newCommentData = await postsApi.createComment(post.id, commentData);
      setComments((prev) => [...prev, newCommentData]);
      setNewComment("");
    } catch (err) {
      console.error("Erro ao criar comentário:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

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

  // Extrair menções do conteúdo
  const extractMentions = (content: string) => {
    const mentionPattern = /@(\w+)/g;
    const mentions = content.match(mentionPattern);
    return mentions || [];
  };

  const mentions = extractMentions(post.content);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
        <div className="bg-[#6B80F0] px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h3
            className="text-white font-bold text-lg truncate max-w-[70%]"
            title={post.title}
          >
            {post.title}
          </h3>

          <HydrationSafe>
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
          </HydrationSafe>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
            <span>@{post.username}</span>
            <HydrationSafe fallback={<span>Loading...</span>}>
              <span>{timeAgo}</span>
            </HydrationSafe>
          </div>

          <div className="text-gray-900 leading-relaxed break-words whitespace-pre-wrap mb-4">
            {post.content.length > 300 ? (
              <>
                {showFullContent ? (
                  <>
                    <div className="mb-2">{post.content}</div>
                    <button
                      onClick={() => setShowFullContent(false)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Ver menos
                    </button>
                  </>
                ) : (
                  <>
                    <div className="max-h-32 overflow-hidden">
                      {post.content.substring(0, 300)}...
                    </div>
                    <button
                      onClick={() => setShowFullContent(true)}
                      className="text-blue-600 hover:text-blue-800 mt-2 text-sm font-medium"
                    >
                      Ver mais
                    </button>
                  </>
                )}
              </>
            ) : (
              <div>{post.content}</div>
            )}
          </div>

          {/* Imagem do post */}
          {post.image && (
            <div className="mb-4">
              <img
                src={post.image}
                alt="Post image"
                className="max-w-full max-h-96 rounded-lg border border-gray-200"
                loading="lazy"
              />
            </div>
          )}

          {/* Menções */}
          {mentions.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={16} />
                <span>Mencionado:</span>
                {mentions.map((mention, index) => (
                  <span key={index} className="text-blue-600 font-medium">
                    {mention}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ações do post */}
          <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
            {/* Like */}
            <button
              onClick={handleToggleLike}
              disabled={!isHydrated}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                userLiked
                  ? "text-red-600 bg-red-50 hover:bg-red-100"
                  : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
              }`}
            >
              <Heart size={18} fill={userLiked ? "currentColor" : "none"} />
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

            {/* Comentários */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <MessageCircle size={18} />
              <span className="text-sm font-medium">{post.comments_count}</span>
            </button>
          </div>

          {/* Seção de comentários */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Comentários
              </h4>

              {/* Formulário de novo comentário */}
              <form onSubmit={handleSubmitComment} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Adicione um comentário..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    disabled={isSubmittingComment}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>

              {/* Lista de comentários */}
              <div className="space-y-3">
                {isLoadingComments ? (
                  <div className="text-center text-gray-500">
                    Carregando comentários...
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center text-gray-500">
                    Nenhum comentário ainda
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          @{comment.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
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
