import { getPosts } from "@/app/actions/posts";
import { PostsListSkeleton } from "@/components/posts/PostlListSkeleton";
import { PostsList } from "@/components/posts/PostsList";
import { Suspense } from "react";

async function PostsContainer() {
  try {
    const posts = await getPosts();

    return (
      <Suspense fallback={<PostsListSkeleton />}>
        <PostsList posts={posts} />
      </Suspense>
    );
  } catch (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Failed to load posts</div>
        <div className="text-sm text-gray-500">
          Please try refreshing the page
        </div>
      </div>
    );
  }
}

export default PostsContainer;
