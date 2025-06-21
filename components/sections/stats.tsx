"use client"

import { useEffect, useRef, useState } from "react"

const stats = [
  { number: 500, suffix: "+", label: "Students Graduated", duration: 2000 },
  { number: 95, suffix: "%", label: "Job Placement Rate", duration: 1500 },
  { number: 50, suffix: "+", label: "Industry Partners", duration: 1800 },
  { number: 4.9, suffix: "/5", label: "Average Rating", duration: 1200, decimal: true },
]

function AnimatedNumber({
  target,
  duration,
  suffix = "",
  decimal = false,
}: {
  target: number
  duration: number
  suffix?: string
  decimal?: boolean
}) {
  const [current, setCurrent] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const increment = target / (duration / 16)
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCurrent(target)
        clearInterval(timer)
      } else {
        setCurrent(current)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isVisible, target, duration])

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold gradient-text">
      {decimal ? current.toFixed(1) : Math.floor(current)}
      {suffix}
    </div>
  )
}

export default function Stats() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="stats py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 reveal-up">
          <h2 className="text-3xl md:text-5xl font-bold font-space-grotesk mb-4">
            Our <span className="gradient-text">Impact</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Numbers that speak to our commitment to excellence and student success
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`
                text-center glass-card p-6 rounded-xl reveal-up cursor-pointer
                transition-all duration-500 ease-in-out transform
                ${
                  hoveredIndex === null
                    ? "blur-sm scale-95 opacity-70 brightness-75"
                    : hoveredIndex === index
                      ? "blur-none scale-110 opacity-100 brightness-110 shadow-2xl ring-2 ring-primary/60 z-10"
                      : "blur-md scale-90 opacity-50 brightness-50"
                }
              `}
              style={{
                animationDelay: `${index * 0.1}s`,
                position: "relative",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Enhanced glow effect for hovered card */}
              {hoveredIndex === index && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-xl -z-10 animate-pulse" />
              )}

              <AnimatedNumber
                target={stat.number}
                duration={stat.duration}
                suffix={stat.suffix}
                decimal={stat.decimal}
              />
              <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Instruction text */}
        <div className="text-center mt-8 reveal-up">
          <p className="text-sm text-muted-foreground/70 italic">Hover over each stat to reveal the details</p>
        </div>
      </div>
    </section>
  )
}
