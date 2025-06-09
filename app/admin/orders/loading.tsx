export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="h-12 w-full bg-gray-200 rounded mb-6 animate-pulse"></div>

        <div className="h-20 w-full bg-gray-200 rounded mb-6 animate-pulse"></div>

        <div className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 p-6">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
