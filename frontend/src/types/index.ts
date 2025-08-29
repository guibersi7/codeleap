export interface Post {
  id: number;
  username: string;
  created_datetime: string;
  title: string;
  content: string;
  image?: string | null;
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
}

export interface CreatePostData {
  title: string;
  content: string;
  image?: File | null;
}

export interface UpdatePostData {
  title: string;
  content: string;
  image?: File | null;
}

export interface Like {
  id: number;
  username: string;
  created_at: string;
}

export interface Comment {
  id: number;
  username: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentData {
  content: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface Mention {
  id: number;
  mentioned_username: string;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface LikeResponse {
  success: boolean;
  message: string;
  data: {
    action: string;
    likes_count: number;
    user_liked: boolean;
  };
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}
