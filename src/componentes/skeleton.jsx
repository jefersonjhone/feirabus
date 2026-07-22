export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-12 rounded-md bg-gray-200" />
        <div className="flex-1 space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="h-3 bg-gray-200 rounded"
              style={{ width: `${70 + Math.random() * 30}%` }}
            />
          ))}
        </div>
        <div className="h-8 w-16 rounded-md bg-gray-200" />
      </div>
    </div>
  )
}

export function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-2" role="status" aria-label="Carregando">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
