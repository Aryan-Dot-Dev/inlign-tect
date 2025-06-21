"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import { useMousePositionOptimized } from "@/hooks/use-mouse-position-optimized"
import { usePerformanceMonitor } from "@/hooks/use-performance-monitor"

interface FluidTextDistortionProps {
  text: string
  className?: string
  baseSize?: number
  intensity?: number
  viscosity?: number
  surfaceTension?: number
  children?: React.ReactNode
}

export default function FluidTextDistortion({
  text,
  className = "",
  baseSize = 48,
  intensity = 0.6, // Reduced intensity
  viscosity = 0.4, // Increased viscosity for smoother movement
  surfaceTension = 1.5, // Reduced surface tension
  children,
}: FluidTextDistortionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const charsRef = useRef<(HTMLSpanElement | null)[]>([])
  const animationFrameRef = useRef<number>()

  const [fontSize, setFontSize] = useState(baseSize)
  const [isReady, setIsReady] = useState(false)

  // Performance monitoring
  const performanceMetrics = usePerformanceMonitor({
    fpsThreshold: 45,
    memoryThreshold: 100,
    sampleSize: 30,
  })

  // Optimized mouse tracking
  const { mousePosition, mouseVelocity, isHovering } = useMousePositionOptimized({
    element: containerRef.current,
    smoothing: 0.15, // Increased smoothing for gentler movement
    bounds: true,
    throttle: performanceMetrics.performanceLevel > 0.7 ? 12 : 20,
  })

  // Split text into characters, preserving spaces
  const chars = text.split("").map((char, index) => ({
    char: char === " " ? "\u00A0" : char, // Non-breaking space
    index,
    isSpace: char === " ",
  }))

  // Distance calculation
  const getDistance = useCallback((pos1: { x: number; y: number }, pos2: { x: number; y: number }) => {
    const dx = pos2.x - pos1.x
    const dy = pos2.y - pos1.y
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  // Improved fluid force calculation with better bounds
  const calculateFluidForces = useCallback(
    (charIndex: number, charRect: DOMRect, mousePos: { x: number; y: number }, velocity: number) => {
      const charCenter = {
        x: charRect.left + charRect.width / 2,
        y: charRect.top + charRect.height / 2,
      }

      const distance = getDistance(mousePos, charCenter)
      const maxInfluence = Math.min(window.innerWidth, window.innerHeight) * 0.2 // Reduced influence radius

      if (distance > maxInfluence) return { force: 0, displacement: { x: 0, y: 0 } }

      // Gentler fluid pressure calculation
      const normalizedDistance = distance / maxInfluence
      const pressure = Math.exp(-normalizedDistance * 3) * intensity * 0.5 // Reduced pressure
      const velocityInfluence = Math.min(velocity * 1.0, 0.3) // Capped velocity influence

      // Reduced surface tension effect
      const surfaceTensionForce = Math.sin(normalizedDistance * Math.PI) * surfaceTension * 0.05

      // Enhanced viscosity damping
      const dampingFactor = 1.0 - viscosity * 0.7

      // Calculate displacement direction with smoother falloff
      const angle = Math.atan2(charCenter.y - mousePos.y, charCenter.x - mousePos.x)
      const totalForce = (pressure + velocityInfluence + surfaceTensionForce) * dampingFactor

      // Limit maximum displacement
      const maxDisplacement = 15
      const displacementMagnitude = Math.min(totalForce * 12, maxDisplacement)

      return {
        force: totalForce,
        displacement: {
          x: Math.cos(angle) * displacementMagnitude,
          y: Math.sin(angle) * displacementMagnitude,
        },
      }
    },
    [getDistance, intensity, surfaceTension, viscosity],
  )

  // Responsive sizing
  const updateSize = useCallback(() => {
    if (!containerRef.current || !textRef.current) return

    const containerWidth = containerRef.current.offsetWidth
    const newSize = Math.max(Math.min(containerWidth / (chars.length * 0.6), baseSize * 1.5), baseSize * 0.8)

    setFontSize(newSize)
  }, [chars.length, baseSize])

  // Improved animation loop with better bounds checking
  const animate = useCallback(() => {
    if (!textRef.current || !isReady) return

    const mouseWorldPos = {
      x: mousePosition.x * window.innerWidth,
      y: (1 - mousePosition.y) * window.innerHeight,
    }

    const performanceScale = Math.max(0.5, performanceMetrics.performanceLevel)

    charsRef.current.forEach((span, index) => {
      if (!span) return

      const rect = span.getBoundingClientRect()
      const { force, displacement } = calculateFluidForces(index, rect, mouseWorldPos, mouseVelocity)

      if (force > 0.005) {
        // Gentler distortion effects with better bounds
        const distortionScale = Math.max(0.8, Math.min(1.2, 1 + force * 0.15 * performanceScale))
        const skewX = Math.max(-3, Math.min(3, displacement.x * 0.008 * performanceScale))
        const skewY = Math.max(-2, Math.min(2, displacement.y * 0.005 * performanceScale))

        // Controlled font variation effects
        const fontWeight = Math.max(400, Math.min(800, 600 + force * 150 * performanceScale))
        const fontStretch = Math.max(90, Math.min(120, 100 + force * 15 * performanceScale))

        // Gentler color intensity
        const colorIntensity = Math.max(0.8, Math.min(1.3, 1 + force * 0.2))
        const hueShift = Math.max(-10, Math.min(10, force * 8))

        // Apply transformations with bounds
        span.style.transform = `
          translate(${Math.max(-20, Math.min(20, displacement.x * performanceScale))}px, ${Math.max(-20, Math.min(20, displacement.y * performanceScale))}px)
          scale(${distortionScale})
          skew(${skewX}deg, ${skewY}deg)
        `

        span.style.fontWeight = fontWeight.toString()
        span.style.fontStretch = `${fontStretch}%`

        // Controlled color effects
        span.style.filter = `
          brightness(${colorIntensity})
          hue-rotate(${hueShift}deg)
          saturate(${Math.max(0.8, Math.min(1.4, 1 + force * 0.2))})
        `

        // Subtle text shadow for depth
        const shadowIntensity = Math.min(force * 6 * performanceScale, 8)
        span.style.textShadow = `
          0 0 ${shadowIntensity}px rgba(139, 92, 246, ${Math.min(force * 0.4, 0.3)}),
          0 0 ${shadowIntensity * 1.5}px rgba(168, 85, 247, ${Math.min(force * 0.3, 0.2)}),
          0 0 ${shadowIntensity * 2}px rgba(236, 72, 153, ${Math.min(force * 0.2, 0.1)})
        `

        // Controlled opacity variation - prevent disappearing
        span.style.opacity = Math.max(0.7, 1 - force * 0.05).toString()
      } else {
        // Smooth reset to default state
        span.style.transform = "translate(0px, 0px) scale(1) skew(0deg, 0deg)"
        span.style.fontWeight = "700"
        span.style.fontStretch = "100%"
        span.style.filter = "brightness(1) hue-rotate(0deg) saturate(1)"
        span.style.textShadow = "none"
        span.style.opacity = "1"
      }
    })

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [mousePosition, mouseVelocity, isReady, calculateFluidForces, performanceMetrics.performanceLevel])

  // Initialize and cleanup
  useEffect(() => {
    updateSize()
    setIsReady(true)

    const handleResize = () => {
      updateSize()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [updateSize])

  // Start animation
  useEffect(() => {
    if (isReady) {
      animate()
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [animate, isReady])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-visible ${className}`}
      style={{
        contain: "layout style",
        willChange: performanceMetrics.performanceLevel > 0.6 ? "transform" : "auto",
      }}
    >
      {/* Fluid text */}
      <h2
        ref={textRef}
        className="font-space-grotesk font-bold text-center leading-tight select-none"
        style={{
          fontSize: `${fontSize}px`,
          background: "linear-gradient(135deg, #8b5cf6, #a855f7, #ec4899)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          textAlign: "center",
          margin: 0,
          padding: "0.5em 0",
        }}
      >
        {chars.map((charData, index) => (
          <span
            key={index}
            ref={(el) => (charsRef.current[index] = el)}
            className="inline-block transition-all duration-100 ease-out"
            style={{
              transformOrigin: "center center",
              willChange: performanceMetrics.performanceLevel > 0.6 ? "transform, filter" : "auto",
              fontFeatureSettings: '"kern" 1, "liga" 1',
              textRendering: "optimizeLegibility",
              minWidth: charData.isSpace ? "0.3em" : "auto", // Ensure spaces maintain width
            }}
          >
            {charData.char}
          </span>
        ))}
      </h2>

      {/* Additional content */}
      {children}

      {/* Interaction hint */}
      {!isHovering && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-60 transition-opacity duration-300">
          <div className="flex items-center gap-2 px-3 py-1 bg-background/20 backdrop-blur-sm rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Move cursor over text to see fluid effect</span>
          </div>
        </div>
      )}

      {/* Performance indicator (development only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-0 right-0 bg-black/80 text-white text-xs p-2 rounded font-mono">
          <div className={performanceMetrics.isLowPerformance ? "text-red-400" : "text-green-400"}>
            FPS: {performanceMetrics.fps} | Perf: {Math.round(performanceMetrics.performanceLevel * 100)}%
          </div>
        </div>
      )}
    </div>
  )
}
