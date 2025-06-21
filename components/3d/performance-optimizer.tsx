"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"

interface PerformanceStats {
  fps: number
  frameTime: number
  memoryUsage?: number
  isLowPerformance: boolean
}

interface PerformanceOptimizerProps {
  onPerformanceChange?: (stats: PerformanceStats) => void
  fpsThreshold?: number
  memoryThreshold?: number
  children: React.ReactNode
}

export default function PerformanceOptimizer({
  onPerformanceChange,
  fpsThreshold = 45,
  memoryThreshold = 100, // MB
  children,
}: PerformanceOptimizerProps) {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    frameTime: 16.67,
    isLowPerformance: false,
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const fpsHistoryRef = useRef<number[]>([])
  const performanceCheckInterval = useRef<NodeJS.Timeout>()

  const checkPerformance = useCallback(() => {
    const now = performance.now()
    const deltaTime = now - lastTimeRef.current

    frameCountRef.current++

    // Calculate FPS every 30 frames for better responsiveness
    if (frameCountRef.current >= 30) {
      const fps = Math.round(1000 / (deltaTime / 30))
      const frameTime = deltaTime / 30

      // Keep shorter FPS history for quicker adaptation
      fpsHistoryRef.current.push(fps)
      if (fpsHistoryRef.current.length > 5) {
        fpsHistoryRef.current.shift()
      }

      const avgFps = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length
      const memoryUsage = (performance as any).memory?.usedJSHeapSize / (1024 * 1024) || 0

      const isLowPerformance = avgFps < fpsThreshold || memoryUsage > memoryThreshold

      const newStats: PerformanceStats = {
        fps: Math.round(avgFps),
        frameTime: Math.round(frameTime * 100) / 100,
        memoryUsage: Math.round(memoryUsage),
        isLowPerformance,
      }

      setStats(newStats)
      onPerformanceChange?.(newStats)

      // Apply performance optimizations
      if (isLowPerformance) {
        document.documentElement.classList.add("low-performance-mode")
      } else {
        document.documentElement.classList.remove("low-performance-mode")
      }

      frameCountRef.current = 0
      lastTimeRef.current = now
    }
  }, [fpsThreshold, memoryThreshold, onPerformanceChange])

  useEffect(() => {
    let animationFrameId: number

    const performanceLoop = () => {
      checkPerformance()
      animationFrameId = requestAnimationFrame(performanceLoop)
    }

    performanceLoop()

    // Additional memory cleanup check every 5 seconds
    performanceCheckInterval.current = setInterval(() => {
      if ((performance as any).memory?.usedJSHeapSize) {
        const memoryUsage = (performance as any).memory.usedJSHeapSize / (1024 * 1024)
        if (memoryUsage > memoryThreshold * 1.5) {
          // Force garbage collection if available
          if ((window as any).gc) {
            ;(window as any).gc()
          }
        }
      }
    }, 5000)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      if (performanceCheckInterval.current) {
        clearInterval(performanceCheckInterval.current)
      }
      document.documentElement.classList.remove("low-performance-mode")
    }
  }, [checkPerformance, memoryThreshold])

  return (
    <div className={`performance-optimized ${stats.isLowPerformance ? "low-performance" : ""}`}>
      {children}

      {/* Development mode performance display */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 bg-black/90 text-white text-xs p-3 rounded-lg font-mono z-50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${stats.fps > fpsThreshold ? "bg-green-400" : "bg-red-400"}`} />
            <span>FPS: {stats.fps}</span>
          </div>
          <div>Frame: {stats.frameTime}ms</div>
          {stats.memoryUsage && (
            <div className={stats.memoryUsage > memoryThreshold ? "text-yellow-400" : ""}>
              Memory: {stats.memoryUsage}MB
            </div>
          )}
          {stats.isLowPerformance && <div className="text-red-400 font-bold">⚠ Performance Mode</div>}
        </div>
      )}
    </div>
  )
}
