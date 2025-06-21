"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { usePerformanceContext } from "@/components/optimization/performance-provider"

interface MousePosition {
  x: number
  y: number
}

interface UseOptimizedMouseTrackingOptions {
  element?: HTMLElement | null
  throttle?: number
  enabled?: boolean
}

export function useOptimizedMouseTracking({
  element = null,
  throttle = 16,
  enabled = true,
}: UseOptimizedMouseTrackingOptions = {}) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0.5, y: 0.5 })
  const [isHovering, setIsHovering] = useState(false)

  const { config } = usePerformanceContext()
  const lastUpdateTime = useRef(0)
  const rafId = useRef<number>()
  const mountedRef = useRef(false)

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!enabled || !config.enableAnimations || !mountedRef.current) return

      const now = performance.now()
      if (now - lastUpdateTime.current < throttle) return

      lastUpdateTime.current = now

      const targetElement = element || (typeof document !== "undefined" ? document.body : null)
      if (!targetElement) return

      try {
        const rect = targetElement.getBoundingClientRect()

        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
        const y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height))

        // Use RAF for smooth updates
        if (rafId.current) {
          cancelAnimationFrame(rafId.current)
        }

        rafId.current = requestAnimationFrame(() => {
          if (mountedRef.current) {
            setMousePosition({ x, y })
          }
        })
      } catch (error) {
        console.warn("Error in handleMouseMove:", error)
      }
    },
    [element, throttle, enabled, config.enableAnimations],
  )

  const handleMouseEnter = useCallback(() => {
    if (enabled && config.enableAnimations && mountedRef.current) {
      try {
        setIsHovering(true)
      } catch (error) {
        console.warn("Error in handleMouseEnter:", error)
      }
    }
  }, [enabled, config.enableAnimations])

  const handleMouseLeave = useCallback(() => {
    if (mountedRef.current) {
      try {
        setIsHovering(false)
        setMousePosition({ x: 0.5, y: 0.5 })
      } catch (error) {
        console.warn("Error in handleMouseLeave:", error)
      }
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true

    if (!enabled || !config.enableAnimations || typeof window === "undefined") {
      return () => {
        mountedRef.current = false
      }
    }

    // Wait for DOM to be ready
    const initTimer = setTimeout(() => {
      if (!mountedRef.current) return

      const targetElement = element || (typeof document !== "undefined" ? document.body : null)

      if (!targetElement) {
        console.warn("Target element not available for mouse tracking")
        return
      }

      const options = { passive: true }

      try {
        targetElement.addEventListener("mousemove", handleMouseMove, options)
        targetElement.addEventListener("mouseenter", handleMouseEnter, options)
        targetElement.addEventListener("mouseleave", handleMouseLeave, options)
      } catch (error) {
        console.error("Error adding mouse event listeners:", error)
      }
    }, 100)

    return () => {
      mountedRef.current = false
      clearTimeout(initTimer)

      try {
        const targetElement = element || (typeof document !== "undefined" ? document.body : null)
        if (targetElement) {
          targetElement.removeEventListener("mousemove", handleMouseMove)
          targetElement.removeEventListener("mouseenter", handleMouseEnter)
          targetElement.removeEventListener("mouseleave", handleMouseLeave)
        }
      } catch (error) {
        console.warn("Error removing mouse event listeners:", error)
      }

      if (rafId.current && typeof cancelAnimationFrame !== "undefined") {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [element, handleMouseMove, handleMouseEnter, handleMouseLeave, enabled, config.enableAnimations])

  return { mousePosition, isHovering }
}
