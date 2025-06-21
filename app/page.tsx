import { Suspense } from "react"
import HeroOptimized from "@/components/sections/hero-optimized"
import AboutOptimized from "@/components/sections/about-optimized"
import Programs from "@/components/sections/programs"
import Stats from "@/components/sections/stats"
import Testimonials from "@/components/sections/testimonials"
import CTA from "@/components/sections/cta"

// Loading components for better UX
function SectionSkeleton() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
          <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense
        fallback={<div className="min-h-screen bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20" />}
      >
        <HeroOptimized />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <AboutOptimized />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Programs />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Stats />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <CTA />
      </Suspense>
    </main>
  )
}
