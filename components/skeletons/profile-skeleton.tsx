export default function ProfileSkeleton() {
  return (
    <div className="glass-card rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="skeleton w-16 h-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="skeleton w-3/4 h-5 rounded" />
          <div className="skeleton w-1/2 h-4 rounded" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="skeleton w-full h-4 rounded" />
        <div className="skeleton w-5/6 h-4 rounded" />
        <div className="skeleton w-2/3 h-4 rounded" />
      </div>

      <div className="flex gap-2">
        <div className="skeleton w-16 h-6 rounded-full" />
        <div className="skeleton w-20 h-6 rounded-full" />
        <div className="skeleton w-14 h-6 rounded-full" />
      </div>
    </div>
  )
}
