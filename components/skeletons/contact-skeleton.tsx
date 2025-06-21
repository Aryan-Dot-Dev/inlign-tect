export default function ContactSkeleton() {
  return (
    <div className="space-y-6">
      {/* Form skeleton */}
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="skeleton w-20 h-4 rounded" />
            <div className="skeleton w-full h-10 rounded" />
          </div>
          <div className="space-y-2">
            <div className="skeleton w-20 h-4 rounded" />
            <div className="skeleton w-full h-10 rounded" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="skeleton w-12 h-4 rounded" />
          <div className="skeleton w-full h-10 rounded" />
        </div>

        <div className="space-y-2">
          <div className="skeleton w-32 h-4 rounded" />
          <div className="skeleton w-full h-10 rounded" />
        </div>

        <div className="space-y-2">
          <div className="skeleton w-16 h-4 rounded" />
          <div className="skeleton w-full h-32 rounded" />
        </div>

        <div className="skeleton w-full h-10 rounded" />
      </div>
    </div>
  )
}
