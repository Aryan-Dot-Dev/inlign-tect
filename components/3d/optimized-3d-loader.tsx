"use client"

import type React from "react"

import { lazy, Suspense } from "react"
import { usePerformanceContext } from "@/components/optimization/performance-provider"

// Lazy load 3D components
const TechHologram = lazy(() => import("./tech-hologram"))
const NeuralNetwork = lazy(() => import("./neural-network"))
const FloatingCube = lazy(() => import("./floating-cube"))
const Hero3DScene = lazy(() => import("./hero-3d-scene"))

interface Optimized3DLoaderProps {
  component: "tech-hologram" | "neural-network" | "floating-cube" | "hero-3d-scene"
  fallback?: React.ReactNode
  className?: string
}

export default function Optimized3DLoader({
  component,
  fallback = (
    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg animate-pulse" />
  ),
  className = "",
}: Optimized3DLoaderProps) {
  const { config, metrics } = usePerformanceContext()

  // Don't render 3D components if disabled or performance is too low
  if (!config.enable3D || metrics.performanceLevel < 0.4) {
    return <>{fallback}</>
  }

  const Component = {
    "tech-hologram": TechHologram,
    "neural-network": NeuralNetwork,
    "floating-cube": FloatingCube,
    "hero-3d-scene": Hero3DScene,
  }[component]

  return (
    <Suspense fallback={fallback}>
      <div className={className}>
        <Component />
      </div>
    </Suspense>
  )
}
