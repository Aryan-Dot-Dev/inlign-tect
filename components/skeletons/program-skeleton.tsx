export default function ProgramSkeleton() {
  return (
    <div className="glass-card rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="skeleton w-12 h-12 rounded-lg" />
        <div className="skeleton w-20 h-6 rounded-full" />
      </div>

      <div className="space-y-2">
        <div className="skeleton w-3/4 h-6 rounded" />
        <div className="skeleton w-full h-4 rounded" />
        <div className="skeleton w-2/3 h-4 rounded" />
      </div>

      <div className="flex justify-between">
        <div className="skeleton w-16 h-4 rounded" />
        <div className="skeleton w-16 h-4 rounded" />
        <div className="skeleton w-16 h-4 rounded" />
      </div>

      <div className="space-y-2">
        <div className="skeleton w-20 h-4 rounded" />
        <div className="flex gap-2">
          <div className="skeleton w-16 h-6 rounded-full" />
          <div className="skeleton w-20 h-6 rounded-full" />
          <div className="skeleton w-18 h-6 rounded-full" />
        </div>
      </div>

      <div className="skeleton w-full h-10 rounded" />
    </div>
  )
}
