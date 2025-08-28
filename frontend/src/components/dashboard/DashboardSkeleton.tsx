export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[#6B80F0] px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-white/20 rounded animate-pulse"></div>
        </div>
      </div>
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded w-24 ml-auto"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse"
            >
              <div className="bg-gray-200 h-16 rounded-t-lg"></div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
