"use client"

import type React from "react"

import { useRef, useEffect, useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { useMousePosition } from "@/hooks/use-mouse-position"

// Dynamically import with optimized loading
const FluidDistortion = dynamic(() => import("./fluid-distortion"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-purple-500/6 to-pink-500/8 animate-pulse" />
  ),
})

interface InteractiveHeaderBgProps {
  children: React.ReactNode
  className?: string
}

export default function InteractiveHeaderBg({ children, className = "" }: InteractiveHeaderBgProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Optimized mouse position tracking with stable options
  const mouseOptions = useMemo(
    () => ({
      element: containerRef.current,
      smoothing: 0.08,
      bounds: true,
      throttle: 8,
    }),
    [containerRef.current],
  )

  const { mousePosition, isHovering } = useMousePosition(mouseOptions)

  // Intersection Observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1, rootMargin: "100px" },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Memoize the radial gradient style for performance
  const radialGradientStyle = useMemo(
    () => ({
      background: `radial-gradient(circle at ${mousePosition.x * 100}% ${(1 - mousePosition.y) * 100}%, rgba(139, 92, 246, ${isHovering ? 0.15 : 0.08}) 0%, rgba(168, 85, 247, ${isHovering ? 0.1 : 0.05}) 30%, transparent 60%)`,
    }),
    [mousePosition.x, mousePosition.y, isHovering],
  )

  // Memoize the conic gradient style
  const conicGradientStyle = useMemo(
    () => ({
      background: `conic-gradient(from ${mousePosition.x * 360}deg at ${mousePosition.x * 100}% ${(1 - mousePosition.y) * 100}%, 
        rgba(139, 92, 246, 0.1) 0deg, 
        rgba(168, 85, 247, 0.05) 120deg, 
        rgba(236, 72, 153, 0.08) 240deg, 
        rgba(139, 92, 246, 0.1) 360deg)`,
      transform: `rotate(${mousePosition.x * 10 - 5}deg)`,
      transition: "transform 0.3s ease-out",
    }),
    [mousePosition.x, mousePosition.y],
  )

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ willChange: "transform" }} // Optimize for animations
    >
      {/* Enhanced Fluid Distortion Background */}
      {mounted && isVisible && (
        <FluidDistortion
          mousePosition={mousePosition}
          isHovering={isHovering}
          className={`transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-80"}`}
        />
      )}

      {/* Enhanced gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-background/10 pointer-events-none" />

      {/* Content with enhanced backdrop */}
      <div className="relative z-10 backdrop-blur-[0.5px]">{children}</div>

      {/* Enhanced border glow effect with better performance */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={radialGradientStyle}
      />

      {/* Additional atmospheric effects */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full" style={conicGradientStyle} />
      </div>
    </div>
  )
}
