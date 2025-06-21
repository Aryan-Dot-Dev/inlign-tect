"use client"
import { useRef, useEffect, useState, useCallback } from "react"
import { useOptimizedMouseTracking } from "@/hooks/use-optimized-mouse-tracking"
import { usePerformanceContext } from "@/components/optimization/performance-provider"

interface OptimizedFluidTextProps {
  text: string
  className?: string
  baseSize?: number
  intensity?: number
}

export default function OptimizedFluidText({
  text,
  className = "",
  baseSize = 48,
  intensity = 0.4,
}: OptimizedFluidTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const charsRef = useRef<(HTMLSpanElement | null)[]>([])
  const animationFrameRef = useRef<number>()
  const mountedRef = useRef(false)

  const [fontSize, setFontSize] = useState(baseSize)
  const [isReady, setIsReady] = useState(false)

  const { config, metrics } = usePerformanceContext()

  // Only enable mouse tracking if fluid effects are enabled
  const { mousePosition, isHovering } = useOptimizedMouseTracking({
    element: containerRef.current,
    throttle: metrics.performanceLevel > 0.7 ? 16 : 32,
    enabled: config.enableFluidEffects && isReady,
  })

  const chars = text.split("").map((char, index) => ({
    char: char === " " ? "\u00A0" : char,
    index,
    isSpace: char === " ",
  }))

  // Optimized force calculation with reduced complexity
  const calculateForce = useCallback(
    (charIndex: number, charRect: DOMRect) => {
      if (!config.enableFluidEffects || !mountedRef.current) return { force: 0, displacement: { x: 0, y: 0 } }

      try {
        const mouseWorldPos = {
          x: mousePosition.x * window.innerWidth,
          y: (1 - mousePosition.y) * window.innerHeight,
        }

        const charCenter = {
          x: charRect.left + charRect.width / 2,
          y: charRect.top + charRect.height / 2,
        }

        const distance = Math.sqrt(
          Math.pow(mouseWorldPos.x - charCenter.x, 2) + Math.pow(mouseWorldPos.y - charCenter.y, 2),
        )

        const maxInfluence = Math.min(window.innerWidth, window.innerHeight) * 0.15

        if (distance > maxInfluence) return { force: 0, displacement: { x: 0, y: 0 } }

        const normalizedDistance = distance / maxInfluence
        const force = Math.exp(-normalizedDistance * 2) * intensity * metrics.performanceLevel

        const angle = Math.atan2(charCenter.y - mouseWorldPos.y, charCenter.x - mouseWorldPos.x)
        const displacement = force * 8

        return {
          force,
          displacement: {
            x: Math.cos(angle) * displacement,
            y: Math.sin(angle) * displacement,
          },
        }
      } catch (error) {
        console.warn("Error calculating fluid force:", error)
        return { force: 0, displacement: { x: 0, y: 0 } }
      }
    },
    [mousePosition, config.enableFluidEffects, intensity, metrics.performanceLevel],
  )

  // Optimized animation loop with performance throttling
  const animate = useCallback(() => {
    if (!textRef.current || !isReady || !config.enableFluidEffects || !mountedRef.current) return

    try {
      // Throttle animation based on performance
      const shouldSkipFrame = metrics.fps < 30 && Math.random() > 0.5
      if (shouldSkipFrame) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      charsRef.current.forEach((span, index) => {
        if (!span || !mountedRef.current) return

        try {
          const rect = span.getBoundingClientRect()
          const { force, displacement } = calculateForce(index, rect)

          if (force > 0.01) {
            const scale = Math.max(0.9, Math.min(1.1, 1 + force * 0.1))
            const skew = Math.max(-2, Math.min(2, displacement.x * 0.005))

            // Batch DOM updates
            span.style.cssText = `
              transform: translate(${Math.max(-10, Math.min(10, displacement.x))}px, ${Math.max(-10, Math.min(10, displacement.y))}px) scale(${scale}) skew(${skew}deg, 0deg);
              opacity: ${Math.max(0.8, 1 - force * 0.1)};
              filter: brightness(${1 + force * 0.2});
            `
          } else {
            span.style.cssText = "transform: none; opacity: 1; filter: none;"
          }
        } catch (error) {
          console.warn("Error animating character:", error)
        }
      })

      if (mountedRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    } catch (error) {
      console.warn("Error in animation loop:", error)
    }
  }, [isReady, calculateForce, config.enableFluidEffects, metrics.fps])

  // Responsive sizing with comprehensive safety checks
  const updateSize = useCallback(() => {
    if (!containerRef.current || !mountedRef.current || typeof window === "undefined") return

    try {
      const containerWidth = containerRef.current.offsetWidth
      if (containerWidth > 0) {
        const newSize = Math.max(Math.min(containerWidth / (chars.length * 0.6), baseSize * 1.2), baseSize * 0.8)
        setFontSize(newSize)
      }
    } catch (error) {
      console.warn("Error updating size:", error)
      setFontSize(baseSize)
    }
  }, [chars.length, baseSize])

  useEffect(() => {
    mountedRef.current = true

    const initTimer = setTimeout(() => {
      if (mountedRef.current) {
        updateSize()
        setIsReady(true)
      }
    }, 100)

    const handleResize = () => {
      if (mountedRef.current) {
        updateSize()
      }
    }

    let resizeCleanup: (() => void) | null = null

    if (typeof window !== "undefined") {
      try {
        window.addEventListener("resize", handleResize, { passive: true })
        resizeCleanup = () => {
          try {
            window.removeEventListener("resize", handleResize)
          } catch (error) {
            console.warn("Error removing resize listener:", error)
          }
        }
      } catch (error) {
        console.warn("Error adding resize listener:", error)
      }
    }

    return () => {
      mountedRef.current = false
      clearTimeout(initTimer)

      if (resizeCleanup) {
        resizeCleanup()
      }

      if (animationFrameRef.current && typeof cancelAnimationFrame !== "undefined") {
        try {
          cancelAnimationFrame(animationFrameRef.current)
        } catch (error) {
          console.warn("Error canceling animation frame:", error)
        }
      }
    }
  }, [updateSize])

  useEffect(() => {
    if (isReady && config.enableFluidEffects && mountedRef.current) {
      animate()
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [animate, isReady, config.enableFluidEffects])

  // Fallback for low performance devices
  if (!config.enableFluidEffects) {
    return (
      <h2
        className={`font-space-grotesk font-bold text-center leading-tight gradient-text ${className}`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {text}
      </h2>
    )
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <h2
        ref={textRef}
        className="font-space-grotesk font-bold text-center leading-tight select-none"
        style={{
          fontSize: `${fontSize}px`,
          background: "linear-gradient(135deg, #8b5cf6, #a855f7, #ec4899)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          margin: 0,
          padding: "0.5em 0",
        }}
      >
        {chars.map((charData, index) => (
          <span
            key={index}
            ref={(el) => (charsRef.current[index] = el)}
            className="inline-block"
            style={{
              transformOrigin: "center center",
              minWidth: charData.isSpace ? "0.3em" : "auto",
              willChange: config.enableFluidEffects ? "transform" : "auto",
            }}
          >
            {charData.char}
          </span>
        ))}
      </h2>

      {!isHovering && config.enableFluidEffects && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-50">
          <span className="text-xs text-muted-foreground">Hover for fluid effect</span>
        </div>
      )}
    </div>
  )
}
