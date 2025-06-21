"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface PerformanceMetrics {
  fps: number
  frameTime: number
  memoryUsage: number
  performanceLevel: number
  isLowPerformance: boolean
  deviceType: "mobile" | "tablet" | "desktop"
  networkSpeed: "slow" | "fast" | "unknown"
}

interface PerformanceConfig {
  enableAnimations: boolean
  enable3D: boolean
  enableParticles: boolean
  enableFluidEffects: boolean
  imageQuality: "low" | "medium" | "high"
  animationQuality: "low" | "medium" | "high"
}

export function usePerformanceOptimizer() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    performanceLevel: 1.0,
    isLowPerformance: false,
    deviceType: "desktop",
    networkSpeed: "unknown",
  })

  const [config, setConfig] = useState<PerformanceConfig>({
    enableAnimations: true,
    enable3D: true,
    enableParticles: true,
    enableFluidEffects: true,
    imageQuality: "high",
    animationQuality: "high",
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const fpsHistoryRef = useRef<number[]>([])
  const animationFrameRef = useRef<number>()
  const mountedRef = useRef(false)

  // Device detection with safety checks
  const detectDevice = useCallback(() => {
    if (typeof window === "undefined") return "desktop"

    const width = window.innerWidth
    const userAgent = navigator?.userAgent?.toLowerCase() || ""

    if (width < 768 || /mobile|android|iphone|ipad|tablet/.test(userAgent)) {
      return width < 480 ? "mobile" : "tablet"
    }
    return "desktop"
  }, [])

  // Network speed detection with safety checks
  const detectNetworkSpeed = useCallback(() => {
    if (typeof navigator === "undefined") return "unknown"

    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    if (connection) {
      const effectiveType = connection.effectiveType
      if (effectiveType === "slow-2g" || effectiveType === "2g") return "slow"
      if (effectiveType === "3g") return "slow"
      return "fast"
    }

    return "unknown"
  }, [])

  // Performance measurement with comprehensive safety checks
  const measurePerformance = useCallback(() => {
    if (!mountedRef.current || typeof window === "undefined" || typeof performance === "undefined") return

    const now = performance.now()
    const deltaTime = now - lastTimeRef.current

    frameCountRef.current++

    if (deltaTime >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime)
      const frameTime = deltaTime / frameCountRef.current

      fpsHistoryRef.current.push(fps)
      if (fpsHistoryRef.current.length > 10) {
        fpsHistoryRef.current.shift()
      }

      const avgFps = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length
      const memoryUsage = (performance as any).memory?.usedJSHeapSize / (1024 * 1024) || 0

      const performanceLevel = Math.min(avgFps / 60, 1.0)
      const isLowPerformance = avgFps < 45 || memoryUsage > 150

      const newMetrics: PerformanceMetrics = {
        fps: Math.round(avgFps),
        frameTime: Math.round(frameTime * 100) / 100,
        memoryUsage: Math.round(memoryUsage),
        performanceLevel,
        isLowPerformance,
        deviceType: detectDevice(),
        networkSpeed: detectNetworkSpeed(),
      }

      setMetrics(newMetrics)

      // Auto-adjust configuration based on performance
      const newConfig: PerformanceConfig = {
        enableAnimations: avgFps > 30,
        enable3D: avgFps > 45 && newMetrics.deviceType === "desktop",
        enableParticles: avgFps > 50 && memoryUsage < 100,
        enableFluidEffects: avgFps > 40 && newMetrics.deviceType !== "mobile",
        imageQuality: avgFps > 50 ? "high" : avgFps > 30 ? "medium" : "low",
        animationQuality: avgFps > 50 ? "high" : avgFps > 30 ? "medium" : "low",
      }

      setConfig(newConfig)

      frameCountRef.current = 0
      lastTimeRef.current = now
    }

    if (mountedRef.current && typeof requestAnimationFrame !== "undefined") {
      animationFrameRef.current = requestAnimationFrame(measurePerformance)
    }
  }, [detectDevice, detectNetworkSpeed])

  useEffect(() => {
    mountedRef.current = true

    // Start measurement after a brief delay to ensure DOM is ready
    const startTimer = setTimeout(() => {
      if (mountedRef.current) {
        measurePerformance()
      }
    }, 100)

    return () => {
      mountedRef.current = false
      clearTimeout(startTimer)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [measurePerformance])

  return { metrics, config }
}
