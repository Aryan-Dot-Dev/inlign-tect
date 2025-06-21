"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import * as THREE from "three"

interface UseMousePositionOptions {
  element?: HTMLElement | null
  smoothing?: number
  bounds?: boolean
  throttle?: number
}

interface MousePositionResult {
  mousePosition: THREE.Vector2
  prevMousePosition: THREE.Vector2
  mouseVelocity: number
  isHovering: boolean
}

export function useMousePositionOptimized({
  element = null,
  smoothing = 0.08,
  bounds = true,
  throttle = 8,
}: UseMousePositionOptions = {}): MousePositionResult {
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2(0.5, 0.5))
  const [prevMousePosition, setPrevMousePosition] = useState(new THREE.Vector2(0.5, 0.5))
  const [mouseVelocity, setMouseVelocity] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const targetPosition = useRef(new THREE.Vector2(0.5, 0.5))
  const currentPosition = useRef(new THREE.Vector2(0.5, 0.5))
  const lastPosition = useRef(new THREE.Vector2(0.5, 0.5))
  const velocityHistory = useRef<number[]>([])
  const animationFrameRef = useRef<number>()
  const lastUpdateTime = useRef(0)
  const isAnimatingRef = useRef(false)

  // Optimized velocity calculation
  const calculateVelocity = useCallback((current: THREE.Vector2, previous: THREE.Vector2) => {
    const distance = current.distanceTo(previous)
    velocityHistory.current.push(distance)

    // Keep only last 5 velocity samples for smoothing
    if (velocityHistory.current.length > 5) {
      velocityHistory.current.shift()
    }

    // Calculate average velocity
    const avgVelocity = velocityHistory.current.reduce((a, b) => a + b, 0) / velocityHistory.current.length
    return Math.min(avgVelocity * 100, 1.0) // Normalize and cap at 1.0
  }, [])

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const now = performance.now()
      if (now - lastUpdateTime.current < throttle) return

      lastUpdateTime.current = now

      const targetElement = element || (typeof document !== "undefined" ? document.body : null)
      if (!targetElement) return

      try {
        const rect = targetElement.getBoundingClientRect()
        let x = (event.clientX - rect.left) / rect.width
        let y = 1 - (event.clientY - rect.top) / rect.height

        if (bounds) {
          x = Math.max(0, Math.min(1, x))
          y = Math.max(0, Math.min(1, y))
        }

        targetPosition.current.set(x, y)
      } catch (error) {
        console.warn("Error in handleMouseMove:", error)
      }
    },
    [element, bounds, throttle],
  )

  const handleMouseEnter = useCallback(() => {
    try {
      setIsHovering(true)
    } catch (error) {
      console.warn("Error in handleMouseEnter:", error)
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    try {
      setIsHovering(false)
      targetPosition.current.set(0.5, 0.5)
      velocityHistory.current = []
    } catch (error) {
      console.warn("Error in handleMouseLeave:", error)
    }
  }, [])

  const startAnimation = useCallback(() => {
    if (isAnimatingRef.current) return

    isAnimatingRef.current = true

    const animate = () => {
      if (!isAnimatingRef.current) return

      // Store previous position
      lastPosition.current.copy(currentPosition.current)

      // Smooth interpolation
      currentPosition.current.lerp(targetPosition.current, smoothing)

      // Calculate velocity
      const velocity = calculateVelocity(currentPosition.current, lastPosition.current)

      // Update state only if there's significant change
      const positionDistance = currentPosition.current.distanceTo(targetPosition.current)
      if (positionDistance > 0.001 || Math.abs(velocity - mouseVelocity) > 0.01) {
        // Update previous position
        setPrevMousePosition(new THREE.Vector2(lastPosition.current.x, lastPosition.current.y))

        // Update current position
        setMousePosition(new THREE.Vector2(currentPosition.current.x, currentPosition.current.y))

        // Update velocity
        setMouseVelocity(velocity)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()
  }, [smoothing, calculateVelocity, mouseVelocity])

  const stopAnimation = useCallback(() => {
    isAnimatingRef.current = false
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = undefined
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

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

      startAnimation()
    } catch (error) {
      console.error("Error adding mouse event listeners:", error)
    }

    return () => {
      try {
        if (targetElement) {
          targetElement.removeEventListener("mousemove", handleMouseMove)
          targetElement.removeEventListener("mouseenter", handleMouseEnter)
          targetElement.removeEventListener("mouseleave", handleMouseLeave)
        }
        stopAnimation()
      } catch (error) {
        console.warn("Error removing mouse event listeners:", error)
      }
    }
  }, [element, handleMouseMove, handleMouseEnter, handleMouseLeave, startAnimation, stopAnimation])

  return { mousePosition, prevMousePosition, mouseVelocity, isHovering }
}
