"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { useMousePositionOptimized } from "@/hooks/use-mouse-position-optimized"

interface GradientTextFluidProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export default function GradientTextFluid({ children, className = "", intensity = 1.0 }: GradientTextFluidProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const [isReady, setIsReady] = useState(false)

  const { mousePosition, isHovering } = useMousePositionOptimized({
    element: textRef.current,
    smoothing: 0.08,
    bounds: true,
    throttle: 12,
  })

  useEffect(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!textRef.current || !isReady) return

    const element = textRef.current
    const rect = element.getBoundingClientRect()

    // Calculate mouse position relative to text
    const relativeX = mousePosition.x
    const relativeY = mousePosition.y

    // Create dynamic gradient based on mouse position
    const gradientAngle = relativeX * 180 // 0 to 180 degrees
    const colorShift = relativeY * 60 // Hue shift based on Y position

    // Enhanced gradient with fluid-like color mixing
    const gradient = `linear-gradient(${gradientAngle}deg, 
      hsl(${262 + colorShift}, 83%, ${58 + relativeX * 10}%), 
      hsl(${280 + colorShift}, 75%, ${65 + relativeY * 8}%), 
      hsl(${320 + colorShift}, 85%, ${60 + relativeX * 12}%))`

    element.style.background = gradient
    element.style.backgroundClip = "text"
    element.style.WebkitBackgroundClip = "text"

    // Add subtle text shadow for depth when hovering
    if (isHovering) {
      const shadowIntensity = intensity * 0.3
      element.style.textShadow = `
        0 0 ${10 * shadowIntensity}px rgba(139, 92, 246, 0.3),
        0 0 ${20 * shadowIntensity}px rgba(168, 85, 247, 0.2),
        0 0 ${30 * shadowIntensity}px rgba(236, 72, 153, 0.1)
      `
    } else {
      element.style.textShadow = "none"
    }
  }, [mousePosition, isHovering, isReady, intensity])

  return (
    <span
      ref={textRef}
      className={`gradient-text transition-all duration-200 ${className}`}
      style={{
        background: "linear-gradient(135deg, #8b5cf6, #a855f7, #ec4899)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </span>
  )
}
