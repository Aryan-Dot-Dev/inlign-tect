"use client"

import React from "react"
import type { ReactNode } from "react"
import { createContext, useContext } from "react"
import { usePerformanceOptimizer } from "@/hooks/use-performance-optimizer"

interface PerformanceContextType {
  metrics: ReturnType<typeof usePerformanceOptimizer>["metrics"]
  config: ReturnType<typeof usePerformanceOptimizer>["config"]
}

const PerformanceContext = createContext<PerformanceContextType | null>(null)

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const { metrics, config } = usePerformanceOptimizer()

  // Apply global performance classes with comprehensive safety checks
  React.useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      try {
        const root = document.documentElement
        if (!root) return

        // Remove existing performance classes safely
        const classesToRemove = [
          "performance-low",
          "performance-medium",
          "performance-high",
          "device-mobile",
          "device-tablet",
          "device-desktop",
          "network-slow",
          "network-fast",
        ]

        classesToRemove.forEach((className) => {
          try {
            root.classList.remove(className)
          } catch (error) {
            console.warn(`Error removing class ${className}:`, error)
          }
        })

        // Add current performance classes safely
        try {
          if (metrics.performanceLevel < 0.4) {
            root.classList.add("performance-low")
          } else if (metrics.performanceLevel < 0.7) {
            root.classList.add("performance-medium")
          } else {
            root.classList.add("performance-high")
          }

          root.classList.add(`device-${metrics.deviceType}`)

          if (metrics.networkSpeed !== "unknown") {
            root.classList.add(`network-${metrics.networkSpeed}`)
          }

          // Set CSS custom properties safely
          root.style.setProperty("--performance-level", metrics.performanceLevel.toString())
          root.style.setProperty("--fps", metrics.fps.toString())
        } catch (error) {
          console.warn("Error setting performance classes or properties:", error)
        }
      } catch (error) {
        console.warn("Error in performance provider effect:", error)
      }
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [metrics])

  return <PerformanceContext.Provider value={{ metrics, config }}>{children}</PerformanceContext.Provider>
}

export function usePerformanceContext() {
  const context = useContext(PerformanceContext)
  if (!context) {
    // Return default values instead of throwing error during SSR
    return {
      metrics: {
        fps: 60,
        frameTime: 16.67,
        memoryUsage: 0,
        performanceLevel: 1.0,
        isLowPerformance: false,
        deviceType: "desktop" as const,
        networkSpeed: "unknown" as const,
      },
      config: {
        enableAnimations: true,
        enable3D: true,
        enableParticles: true,
        enableFluidEffects: true,
        imageQuality: "high" as const,
        animationQuality: "high" as const,
      },
    }
  }
  return context
}
