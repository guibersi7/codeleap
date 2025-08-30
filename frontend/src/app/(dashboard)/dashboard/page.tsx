import { DashboardAuthGuard } from "@/components/dashboard/DashboardAuthGuard";
import { DashboardErrorBoundary } from "@/components/dashboard/DashboardErrorBoundary";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Header } from "@/components/Header/Header";
import { CreatePost } from "@/components/posts/CreatePost";
import PostsContainer from "@/components/posts/PostsContainer";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <DashboardErrorBoundary>
      <DashboardAuthGuard>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="max-w-4xl mx-auto p-6">
            <CreatePost />

            <Suspense fallback={<DashboardSkeleton />}>
              <PostsContainer />
            </Suspense>
          </main>
        </div>
      </DashboardAuthGuard>
    </DashboardErrorBoundary>
  );
}
