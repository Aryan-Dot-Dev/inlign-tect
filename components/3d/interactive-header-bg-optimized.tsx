"use client"

import type React from "react"

import { useRef, useEffect, useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { useMousePositionOptimized } from "@/hooks/use-mouse-position-optimized"
import { usePerformanceMonitor } from "@/hooks/use-performance-monitor"

// Dynamically import with performance-based loading
const FluidDistortionEnhanced = dynamic(() => import("./fluid-distortion-enhanced"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-r from-primary/6 via-purple-500/4 to-pink-500/6 animate-pulse" />
  ),
})

interface InteractiveHeaderBgOptimizedProps {
  children: React.ReactNode
  className?: string
}

export default function InteractiveHeaderBgOptimized({ children, className = "" }: InteractiveHeaderBgOptimizedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Performance monitoring
  const performanceMetrics = usePerformanceMonitor({
    fpsThreshold: 45,
    memoryThreshold: 150,
    sampleSize: 30,
    updateInterval: 500,
  })

  // Optimized mouse tracking with stable options
  const mouseOptions = useMemo(
    () => ({
      element: containerRef.current,
      smoothing: performanceMetrics.performanceLevel > 0.7 ? 0.06 : 0.12,
      bounds: true,
      throttle: performanceMetrics.performanceLevel > 0.7 ? 6 : 12,
    }),
    [containerRef.current, performanceMetrics.performanceLevel],
  )

  const { mousePosition, prevMousePosition, mouseVelocity, isHovering } = useMousePositionOptimized(mouseOptions)

  // Intersection Observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1, rootMargin: "50px" },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Performance-adaptive styles
  const backgroundStyles = useMemo(() => {
    const intensity = performanceMetrics.performanceLevel * (isHovering ? 0.15 : 0.08)

    return {
      radialGradient: {
        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${(1 - mousePosition.y) * 100}%, 
          rgba(139, 92, 246, ${intensity}) 0%, 
          rgba(168, 85, 247, ${intensity * 0.7}) 30%, 
          transparent 60%)`,
      },
      conicGradient: {
        background: `conic-gradient(from ${mousePosition.x * 360}deg at ${mousePosition.x * 100}% ${(1 - mousePosition.y) * 100}%, 
          rgba(139, 92, 246, ${intensity * 0.5}) 0deg, 
          rgba(168, 85, 247, ${intensity * 0.3}) 120deg, 
          rgba(236, 72, 153, ${intensity * 0.4}) 240deg, 
          rgba(139, 92, 246, ${intensity * 0.5}) 360deg)`,
        transform: `rotate(${mousePosition.x * 8 - 4}deg)`,
        transition: performanceMetrics.performanceLevel > 0.6 ? "transform 0.3s ease-out" : "none",
      },
    }
  }, [mousePosition.x, mousePosition.y, isHovering, performanceMetrics.performanceLevel])

  // Conditional rendering based on performance
  const shouldRenderFluid = mounted && isVisible && performanceMetrics.performanceLevel > 0.3

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        willChange: performanceMetrics.performanceLevel > 0.6 ? "transform" : "auto",
        contain: "layout style paint",
      }}
    >
      {/* Enhanced Fluid Distortion Background */}
      {shouldRenderFluid && (
        <FluidDistortionEnhanced
          mousePosition={mousePosition}
          prevMousePosition={prevMousePosition}
          mouseVelocity={mouseVelocity}
          isHovering={isHovering}
          performanceLevel={performanceMetrics.performanceLevel}
          className={`transition-opacity duration-300 ${
            isHovering && performanceMetrics.performanceLevel > 0.5 ? "opacity-100" : "opacity-70"
          }`}
        />
      )}

      {/* Fallback gradient for low performance */}
      {!shouldRenderFluid && (
        <div className="absolute inset-0 transition-opacity duration-500" style={backgroundStyles.radialGradient} />
      )}

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/3 to-background/8 pointer-events-none" />

      {/* Content with optimized backdrop */}
      <div className="relative z-10 backdrop-blur-[0.5px]">{children}</div>

      {/* Performance-adaptive border effects */}
      {performanceMetrics.performanceLevel > 0.5 && (
        <>
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200"
            style={backgroundStyles.radialGradient}
          />

          <div className="absolute inset-0 pointer-events-none opacity-15">
            <div className="absolute top-0 left-0 w-full h-full" style={backgroundStyles.conicGradient} />
          </div>
        </>
      )}

      {/* Performance indicator (development only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 right-4 bg-black/80 text-white text-xs p-2 rounded font-mono z-50">
          <div
            className={`flex items-center gap-2 ${performanceMetrics.isLowPerformance ? "text-red-400" : "text-green-400"}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${performanceMetrics.isLowPerformance ? "bg-red-400" : "bg-green-400"}`}
            />
            <span>FPS: {performanceMetrics.fps}</span>
          </div>
          <div>Performance: {Math.round(performanceMetrics.performanceLevel * 100)}%</div>
          <div>Memory: {performanceMetrics.memoryUsage}MB</div>
        </div>
      )}
    </div>
  )
}
