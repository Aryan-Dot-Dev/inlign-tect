"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface PerformanceStats {
  fps: number
  frameTime: number
  memoryUsage?: number
}

interface PerformanceMonitorProps {
  onPerformanceChange?: (stats: PerformanceStats) => void
  threshold?: number
  children: React.ReactNode
}

export default function PerformanceMonitor({ onPerformanceChange, threshold = 30, children }: PerformanceMonitorProps) {
  const [stats, setStats] = useState<PerformanceStats>({ fps: 60, frameTime: 16.67 })
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const fpsHistoryRef = useRef<number[]>([])

  useEffect(() => {
    let animationFrameId: number

    const measurePerformance = () => {
      const now = performance.now()
      const deltaTime = now - lastTimeRef.current

      frameCountRef.current++

      // Calculate FPS every 60 frames
      if (frameCountRef.current >= 60) {
        const fps = Math.round(1000 / (deltaTime / 60))
        const frameTime = deltaTime / 60

        // Keep FPS history for smoothing
        fpsHistoryRef.current.push(fps)
        if (fpsHistoryRef.current.length > 10) {
          fpsHistoryRef.current.shift()
        }

        const avgFps = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length

        const newStats: PerformanceStats = {
          fps: Math.round(avgFps),
          frameTime: Math.round(frameTime * 100) / 100,
          memoryUsage: (performance as any).memory?.usedJSHeapSize || undefined,
        }

        setStats(newStats)
        onPerformanceChange?.(newStats)

        // Check if performance is below threshold
        const lowPerf = avgFps < threshold
        if (lowPerf !== isLowPerformance) {
          setIsLowPerformance(lowPerf)
          console.log(`Performance ${lowPerf ? "degraded" : "improved"}: ${Math.round(avgFps)} FPS`)
        }

        frameCountRef.current = 0
        lastTimeRef.current = now
      }

      animationFrameId = requestAnimationFrame(measurePerformance)
    }

    measurePerformance()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [onPerformanceChange, threshold, isLowPerformance])

  return (
    <div className={`performance-monitored ${isLowPerformance ? "low-performance" : ""}`}>
      {children}

      {/* Development mode performance display */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded font-mono z-50">
          <div>FPS: {stats.fps}</div>
          <div>Frame: {stats.frameTime}ms</div>
          {stats.memoryUsage && <div>Memory: {Math.round(stats.memoryUsage / 1024 / 1024)}MB</div>}
          {isLowPerformance && <div className="text-red-400">⚠ Low Performance</div>}
        </div>
      )}
    </div>
  )
}
