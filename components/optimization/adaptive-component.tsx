"use client"

import type React from "react"
import { Suspense } from "react"
import { usePerformanceContext } from "./performance-provider"

interface AdaptiveComponentProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  minPerformanceLevel?: number
  requireDesktop?: boolean
  require3D?: boolean
}

export default function AdaptiveComponent({
  children,
  fallback = null,
  minPerformanceLevel = 0.3,
  requireDesktop = false,
  require3D = false,
}: AdaptiveComponentProps) {
  const { metrics, config } = usePerformanceContext()

  // Check if component should render based on performance criteria
  const shouldRender =
    metrics.performanceLevel >= minPerformanceLevel &&
    (!requireDesktop || metrics.deviceType === "desktop") &&
    (!require3D || config.enable3D)

  if (!shouldRender) {
    return <>{fallback}</>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

// Higher-order component for lazy loading with performance checks
export function withPerformanceCheck<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    minPerformanceLevel?: number
    requireDesktop?: boolean
    require3D?: boolean
    fallback?: React.ReactNode
  } = {},
) {
  return function PerformanceCheckedComponent(props: P) {
    return (
      <AdaptiveComponent {...options}>
        <Component {...props} />
      </AdaptiveComponent>
    )
  }
}
