export default function VerifySkeleton() {
  return (
    <div className="space-y-6">
      {/* Form skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="skeleton w-24 h-4 rounded" />
          <div className="skeleton w-full h-10 rounded" />
          <div className="skeleton w-48 h-3 rounded" />
        </div>
        <div className="skeleton w-full h-10 rounded" />
      </div>

      {/* Result skeleton */}
      <div className="p-6 border rounded-lg space-y-4">
        <div className="flex items-center gap-2">
          <div className="skeleton w-5 h-5 rounded-full" />
          <div className="skeleton w-32 h-5 rounded" />
        </div>

        <div className="grid gap-4">
          <div>
            <div className="skeleton w-24 h-4 rounded mb-2" />
            <div className="skeleton w-32 h-6 rounded" />
          </div>

          <div>
            <div className="skeleton w-16 h-4 rounded mb-2" />
            <div className="skeleton w-40 h-6 rounded" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="skeleton w-28 h-4 rounded mb-2" />
              <div className="skeleton w-24 h-5 rounded" />
            </div>
            <div>
              <div className="skeleton w-20 h-4 rounded mb-2" />
              <div className="skeleton w-24 h-5 rounded" />
            </div>
          </div>

          <div>
            <div className="skeleton w-12 h-4 rounded mb-2" />
            <div className="skeleton w-8 h-6 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
