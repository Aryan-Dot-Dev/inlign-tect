"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { useModalManager } from "@/hooks/use-modal-manager"
import { usePerformanceContext } from "@/components/optimization/performance-provider"
import Optimized3DLoader from "@/components/3d/optimized-3d-loader"
import AdaptiveComponent from "@/components/optimization/adaptive-component"

// Typewriter animation component with performance optimization
function TypewriterText({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
}: {
  texts: string[]
  speed?: number
  deleteSpeed?: number
  pauseTime?: number
}) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const { config } = usePerformanceContext()

  useEffect(() => {
    if (!config.enableAnimations) {
      setCurrentText(texts[0])
      return
    }

    const targetText = texts[currentTextIndex]

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseTime)
      return () => clearTimeout(pauseTimer)
    }

    if (!isDeleting && currentText === targetText) {
      setIsPaused(true)
      return
    }

    if (isDeleting && currentText === "") {
      setIsDeleting(false)
      setCurrentTextIndex((prev) => (prev + 1) % texts.length)
      return
    }

    const timeout = setTimeout(
      () => {
        if (isDeleting) {
          setCurrentText(targetText.substring(0, currentText.length - 1))
        } else {
          setCurrentText(targetText.substring(0, currentText.length + 1))
        }
      },
      isDeleting ? deleteSpeed : speed,
    )

    return () => clearTimeout(timeout)
  }, [
    currentText,
    currentTextIndex,
    isDeleting,
    isPaused,
    texts,
    speed,
    deleteSpeed,
    pauseTime,
    config.enableAnimations,
  ])

  return (
    <span className="gradient-text">
      {currentText}
      {config.enableAnimations && <span className="animate-pulse">|</span>}
    </span>
  )
}

export default function HeroOptimized() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { openModal } = useModalManager()
  const { config, metrics } = usePerformanceContext()
  const [isMounted, setIsMounted] = useState(false)

  const typewriterTexts = ["Technology", "Innovation", "Your Career", "The Future"]

  const handleWatchDemo = () => {
    openModal("video")
  }

  // Initialize component
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Optimized parallax effect with comprehensive safety checks
  useEffect(() => {
    if (!isMounted || !config.enableAnimations || metrics.deviceType === "mobile" || typeof window === "undefined")
      return

    // Extended delay to ensure DOM is fully ready
    const initTimer = setTimeout(() => {
      if (!heroRef.current || typeof window === "undefined") return

      const handleMouseMove = (e: MouseEvent) => {
        if (!heroRef.current || typeof window === "undefined") return

        try {
          const { clientX, clientY } = e
          const { innerWidth, innerHeight } = window

          const xPos = (clientX / innerWidth - 0.5) * 10
          const yPos = (clientY / innerHeight - 0.5) * 10

          const elements = heroRef.current.querySelectorAll(".parallax-element")
          elements.forEach((el, index) => {
            try {
              const speed = (index + 1) * 0.3
              ;(el as HTMLElement).style.transform = `translate(${xPos * speed}px, ${yPos * speed}px)`
            } catch (error) {
              console.warn("Error applying parallax transform:", error)
            }
          })
        } catch (error) {
          console.warn("Error in mouse move handler:", error)
        }
      }

      let ticking = false
      const throttledMouseMove = (e: MouseEvent) => {
        if (!ticking && typeof requestAnimationFrame !== "undefined") {
          try {
            requestAnimationFrame(() => {
              handleMouseMove(e)
              ticking = false
            })
            ticking = true
          } catch (error) {
            console.warn("Error in throttled mouse move:", error)
            ticking = false
          }
        }
      }

      try {
        if (typeof window !== "undefined" && window.addEventListener) {
          window.addEventListener("mousemove", throttledMouseMove, { passive: true })
        }
      } catch (error) {
        console.error("Error adding mousemove listener:", error)
      }

      return () => {
        try {
          if (typeof window !== "undefined" && window.removeEventListener) {
            window.removeEventListener("mousemove", throttledMouseMove)
          }
        } catch (error) {
          console.warn("Error removing mousemove listener:", error)
        }
      }
    }, 1000) // Increased delay significantly

    return () => {
      clearTimeout(initTimer)
    }
  }, [isMounted, config.enableAnimations, metrics.deviceType])

  return (
    <section ref={heroRef} className="hero relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background - Only on high performance devices */}
      <AdaptiveComponent
        minPerformanceLevel={0.6}
        requireDesktop={true}
        fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20" />
        }
      >
        <div className="absolute inset-0 opacity-20">
          <Optimized3DLoader component="tech-hologram" />
        </div>
      </AdaptiveComponent>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20" />

      {/* Floating Elements - Only on high performance */}
      {isMounted && config.enableAnimations && metrics.performanceLevel > 0.6 && (
        <>
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float parallax-element" />
          <div
            className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-float parallax-element"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-20 left-20 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-float parallax-element"
            style={{ animationDelay: "4s" }}
          />
        </>
      )}

      {/* Dot Pattern Background - Simplified for low performance */}
      {isMounted && metrics.performanceLevel > 0.4 && (
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.15) 1px, transparent 0)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>
      )}

      <div className="container mx-auto px-4 text-center z-10 relative">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4 reveal-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-space-grotesk leading-tight text-foreground">
              Shape Your Future in{" "}
              <TypewriterText texts={typewriterTexts} speed={150} deleteSpeed={75} pauseTime={2500} />
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our cutting-edge internship programs and master the skills that define tomorrow's digital landscape.
            </p>
          </div>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center reveal-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Button size="lg" className={`group ${config.enableAnimations ? "animate-glow" : ""}`} asChild>
              <Link href="/programs">
                Explore Programs
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button variant="outline" size="lg" className="group" onClick={handleWatchDemo}>
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          {/* Stats Grid - Simplified for mobile */}
          <div
            className={`grid ${metrics.deviceType === "mobile" ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"} gap-8 mt-16 reveal-up`}
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { number: "500+", label: "Students Trained" },
              { number: "95%", label: "Job Placement" },
              { number: "50+", label: "Partner Companies" },
              { number: "4.9/5", label: "Student Rating" },
            ].map((stat, index) => (
              <div key={index} className="glass-card p-6 rounded-xl backdrop-blur-sm">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.number}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
