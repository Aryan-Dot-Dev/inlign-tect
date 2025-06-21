"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface PerformanceMetrics {
  fps: number
  frameTime: number
  memoryUsage: number
  performanceLevel: number // 0-1 scale
  isLowPerformance: boolean
}

interface UsePerformanceMonitorOptions {
  fpsThreshold?: number
  memoryThreshold?: number
  sampleSize?: number
  updateInterval?: number
}

export function usePerformanceMonitor({
  fpsThreshold = 45,
  memoryThreshold = 100,
  sampleSize = 60,
  updateInterval = 1000,
}: UsePerformanceMonitorOptions = {}) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    performanceLevel: 1.0,
    isLowPerformance: false,
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const fpsHistoryRef = useRef<number[]>([])
  const frameTimeHistoryRef = useRef<number[]>([])
  const animationFrameRef = useRef<number>()
  const lastUpdateRef = useRef(0)

  const calculatePerformanceLevel = useCallback(
    (fps: number, memory: number) => {
      const fpsScore = Math.min(fps / 60, 1.0)
      const memoryScore = Math.max(1.0 - memory / memoryThreshold, 0.0)
      return fpsScore * 0.7 + memoryScore * 0.3
    },
    [memoryThreshold],
  )

  const measurePerformance = useCallback(() => {
    const now = performance.now()
    const deltaTime = now - lastTimeRef.current

    frameCountRef.current++

    // Calculate FPS
    if (deltaTime >= updateInterval) {
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime)
      const frameTime = deltaTime / frameCountRef.current

      // Update history
      fpsHistoryRef.current.push(fps)
      frameTimeHistoryRef.current.push(frameTime)

      if (fpsHistoryRef.current.length > sampleSize) {
        fpsHistoryRef.current.shift()
        frameTimeHistoryRef.current.shift()
      }

      // Calculate averages
      const avgFps = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length
      const avgFrameTime = frameTimeHistoryRef.current.reduce((a, b) => a + b, 0) / frameTimeHistoryRef.current.length

      // Get memory usage
      const memoryUsage = (performance as any).memory?.usedJSHeapSize / (1024 * 1024) || 0

      // Calculate performance level
      const performanceLevel = calculatePerformanceLevel(avgFps, memoryUsage)
      const isLowPerformance = avgFps < fpsThreshold || memoryUsage > memoryThreshold

      setMetrics({
        fps: Math.round(avgFps),
        frameTime: Math.round(avgFrameTime * 100) / 100,
        memoryUsage: Math.round(memoryUsage),
        performanceLevel,
        isLowPerformance,
      })

      // Reset counters
      frameCountRef.current = 0
      lastTimeRef.current = now
    }

    animationFrameRef.current = requestAnimationFrame(measurePerformance)
  }, [updateInterval, sampleSize, fpsThreshold, memoryThreshold, calculatePerformanceLevel])

  useEffect(() => {
    measurePerformance()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [measurePerformance])

  return metrics
}
