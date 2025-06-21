export default function ContactInfoSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="glass-card p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="skeleton w-10 h-10 rounded-lg" />
            <div className="space-y-2 flex-1">
              <div className="skeleton w-16 h-4 rounded" />
              <div className="skeleton w-32 h-4 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
