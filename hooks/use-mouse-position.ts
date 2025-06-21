"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import * as THREE from "three"

interface UseMousePositionOptions {
  element?: HTMLElement | null
  smoothing?: number
  bounds?: boolean
  throttle?: number
}

export function useMousePosition({
  element = null,
  smoothing = 0.12,
  bounds = true,
  throttle = 16, // ~60fps
}: UseMousePositionOptions = {}) {
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2(0.5, 0.5))
  const [isHovering, setIsHovering] = useState(false)

  const targetPosition = useRef(new THREE.Vector2(0.5, 0.5))
  const currentPosition = useRef(new THREE.Vector2(0.5, 0.5))
  const animationFrameRef = useRef<number>()
  const lastUpdateTime = useRef(0)
  const isAnimatingRef = useRef(false)

  // Optimized mouse move handler with throttling
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const now = performance.now()
      if (now - lastUpdateTime.current < throttle) return

      lastUpdateTime.current = now

      const targetElement = element || document.body
      if (!targetElement) return

      const rect = targetElement.getBoundingClientRect()
      let x = (event.clientX - rect.left) / rect.width
      let y = 1 - (event.clientY - rect.top) / rect.height // Flip Y for Three.js

      // Clamp values if bounds is enabled
      if (bounds) {
        x = Math.max(0, Math.min(1, x))
        y = Math.max(0, Math.min(1, y))
      }

      targetPosition.current.set(x, y)
    },
    [element, bounds, throttle],
  )

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    // Return to center when mouse leaves
    targetPosition.current.set(0.5, 0.5)
  }, [])

  // Separate animation loop that doesn't depend on state
  const startAnimation = useCallback(() => {
    if (isAnimatingRef.current) return

    isAnimatingRef.current = true

    const animate = () => {
      if (!isAnimatingRef.current) return

      // Use lerp for smooth interpolation
      currentPosition.current.lerp(targetPosition.current, smoothing)

      // Only update state if there's a significant change
      const distance = currentPosition.current.distanceTo(targetPosition.current)
      if (distance > 0.001) {
        // Create new Vector2 to avoid reference issues
        setMousePosition(new THREE.Vector2(currentPosition.current.x, currentPosition.current.y))
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()
  }, [smoothing])

  const stopAnimation = useCallback(() => {
    isAnimatingRef.current = false
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = undefined
    }
  }, [])

  useEffect(() => {
    const targetElement = element || document.body

    // Use passive event listeners for better performance
    const options = { passive: true }
    targetElement.addEventListener("mousemove", handleMouseMove, options)
    targetElement.addEventListener("mouseenter", handleMouseEnter, options)
    targetElement.addEventListener("mouseleave", handleMouseLeave, options)

    // Start animation loop
    startAnimation()

    return () => {
      targetElement.removeEventListener("mousemove", handleMouseMove)
      targetElement.removeEventListener("mouseenter", handleMouseEnter)
      targetElement.removeEventListener("mouseleave", handleMouseLeave)

      // Stop animation loop
      stopAnimation()
    }
  }, [element, handleMouseMove, handleMouseEnter, handleMouseLeave, startAnimation, stopAnimation])

  return { mousePosition, isHovering }
}
