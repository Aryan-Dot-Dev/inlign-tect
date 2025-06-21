"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useModalManager } from "@/hooks/use-modal-manager"

// Dynamically import 3D component to avoid SSR issues
const TechHologram = dynamic(() => import("@/components/3d/tech-hologram"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10" />,
})

// Typewriter animation component
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

  useEffect(() => {
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
  }, [currentText, currentTextIndex, isDeleting, isPaused, texts, speed, deleteSpeed, pauseTime])

  return (
    <span className="gradient-text">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { openModal } = useModalManager()

  const typewriterTexts = ["Technology", "Innovation", "Your Career", "The Future"]

  const handleWatchDemo = () => {
    console.log("Watch Demo clicked")
    openModal("video")
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return

      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      const xPos = (clientX / innerWidth - 0.5) * 20
      const yPos = (clientY / innerHeight - 0.5) * 20

      const elements = heroRef.current.querySelectorAll(".parallax-element")
      elements.forEach((el, index) => {
        const speed = (index + 1) * 0.5
        ;(el as HTMLElement).style.transform = `translate(${xPos * speed}px, ${yPos * speed}px)`
      })
    }

    // Set up intersection observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    // Observe reveal elements
    const revealElements = document.querySelectorAll(".reveal-up")
    revealElements.forEach((el) => {
      el.classList.add("animate-in")
      observer.observe(el)
    })

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      observer.disconnect()
    }
  }, [])

  return (
    <section ref={heroRef} className="hero relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Tech Hologram Background */}
      <div className="absolute inset-0 opacity-20">
        <TechHologram />
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float parallax-element" />
      <div
        className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-float parallax-element"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-20 left-20 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-float parallax-element"
        style={{ animationDelay: "4s" }}
      />

      {/* Dot Pattern Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.15) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

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
            <Button size="lg" className="group animate-glow" asChild>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 reveal-up" style={{ animationDelay: "0.4s" }}>
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
