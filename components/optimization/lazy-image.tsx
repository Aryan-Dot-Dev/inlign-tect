"use client"

import { useState, useRef, useEffect } from "react"
import { usePerformanceOptimizer } from "@/hooks/use-performance-optimizer"

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: string
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  quality = 75,
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+",
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [currentSrc, setCurrentSrc] = useState(placeholder)
  const imgRef = useRef<HTMLImageElement>(null)
  const { config } = usePerformanceOptimizer()

  // Intersection Observer for lazy loading with safety checks
  useEffect(() => {
    if (priority || isInView || typeof window === "undefined" || typeof IntersectionObserver === "undefined") return

    let observer: IntersectionObserver | null = null

    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            if (observer) {
              observer.disconnect()
            }
          }
        },
        {
          threshold: 0.1,
          rootMargin: "50px",
        },
      )

      if (imgRef.current && observer) {
        observer.observe(imgRef.current)
      }
    } catch (error) {
      console.warn("Error setting up intersection observer:", error)
      // Fallback: load image immediately
      setIsInView(true)
    }

    return () => {
      try {
        if (observer) {
          observer.disconnect()
        }
      } catch (error) {
        console.warn("Error disconnecting intersection observer:", error)
      }
    }
  }, [priority, isInView])

  // Load image when in view with safety checks
  useEffect(() => {
    if (!isInView) return

    try {
      const img = new Image()

      // Optimize image URL based on performance config
      const optimizedSrc = optimizeImageUrl(src, {
        quality: config.imageQuality === "high" ? quality : config.imageQuality === "medium" ? 60 : 40,
        width,
        height,
      })

      img.onload = () => {
        setCurrentSrc(optimizedSrc)
        setIsLoaded(true)
      }

      img.onerror = () => {
        setCurrentSrc(src) // Fallback to original
        setIsLoaded(true)
      }

      img.src = optimizedSrc
    } catch (error) {
      console.warn("Error loading image:", error)
      setCurrentSrc(src)
      setIsLoaded(true)
    }
  }, [isInView, src, quality, width, height, config.imageQuality])

  return (
    <img
      ref={imgRef}
      src={currentSrc || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    />
  )
}

function optimizeImageUrl(src: string, options: { quality: number; width?: number; height?: number }) {
  // For placeholder SVGs, return as-is
  if (src.startsWith("data:") || src.includes("placeholder.svg")) {
    return src
  }

  try {
    // Add optimization parameters (this would work with image optimization services)
    const url = new URL(src, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")
    url.searchParams.set("q", options.quality.toString())

    if (options.width) {
      url.searchParams.set("w", options.width.toString())
    }

    if (options.height) {
      url.searchParams.set("h", options.height.toString())
    }

    return url.toString()
  } catch (error) {
    console.warn("Error optimizing image URL:", error)
    return src
  }
}
