"use client"

import { useRef, useEffect, useState, useCallback } from "react"

interface VariableFontHoverProps {
  text: string
  className?: string
  fontSize?: string
  transitionDuration?: number
}

export default function VariableFontHover({
  text,
  className = "",
  fontSize = "3rem",
  transitionDuration = 400,
}: VariableFontHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const charsRef = useRef<(HTMLSpanElement | null)[]>([])
  const [isClient, setIsClient] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Split text into characters, preserving spaces
  const chars = text.split("").map((char, index) => ({
    char: char === " " ? "\u00A0" : char,
    index,
    isSpace: char === " ",
  }))

  // Handle character hover with smooth wave-like animation
  const handleCharHover = useCallback(
    (hoveredIndex: number) => {
      if (!isReady || !isMounted) return

      charsRef.current.forEach((span, index) => {
        if (!span) return

        try {
          const distance = Math.abs(index - hoveredIndex)
          const isHovered = index === hoveredIndex

          if (isHovered) {
            span.style.transform = "translateY(-8px) scale(1.15)"
            span.style.color = "#ec4899"
            span.style.textShadow = "0 4px 12px rgba(236, 72, 153, 0.3)"
            span.style.zIndex = "10"
          } else if (distance === 1) {
            span.style.transform = "translateY(-4px) scale(1.08)"
            span.style.color = "#a855f7"
            span.style.textShadow = "0 2px 8px rgba(168, 85, 247, 0.2)"
            span.style.zIndex = "5"
          } else if (distance === 2) {
            span.style.transform = "translateY(-2px) scale(1.04)"
            span.style.color = "#9333ea"
            span.style.textShadow = "0 1px 4px rgba(147, 51, 234, 0.1)"
            span.style.zIndex = "3"
          } else {
            span.style.transform = "translateY(0px) scale(0.98)"
            span.style.color = "#7c3aed"
            span.style.textShadow = "none"
            span.style.zIndex = "1"
          }

          span.style.transition = `all ${transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
        } catch (error) {
          console.warn("Error applying hover effect:", error)
        }
      })
    },
    [transitionDuration, isReady, isMounted],
  )

  // Handle container leave (smooth reset)
  const handleContainerLeave = useCallback(() => {
    if (!isReady || !isMounted) return

    charsRef.current.forEach((span, index) => {
      if (!span) return

      try {
        setTimeout(() => {
          if (span) {
            span.style.transform = "translateY(0px) scale(1)"
            span.style.color = "#8b5cf6"
            span.style.textShadow = "none"
            span.style.zIndex = "auto"
            span.style.transition = `all ${transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
          }
        }, index * 20)
      } catch (error) {
        console.warn("Error resetting hover effect:", error)
      }
    })
  }, [transitionDuration, isReady, isMounted])

  // Initialize component with extended delays
  useEffect(() => {
    setIsMounted(true)

    const clientTimer = setTimeout(() => {
      setIsClient(true)
    }, 100)

    const readyTimer = setTimeout(() => {
      setIsReady(true)
    }, 500)

    return () => {
      clearTimeout(clientTimer)
      clearTimeout(readyTimer)
    }
  }, [])

  // Fallback rendering for server-side and loading states
  if (!isMounted || !isClient) {
    return (
      <h1
        className={`font-bold select-none ${className}`}
        style={{
          fontSize,
          lineHeight: 1.4,
          letterSpacing: "-0.02em",
          color: "#8b5cf6",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontWeight: 700,
        }}
      >
        {text}
      </h1>
    )
  }

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        
        .variable-font-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-weight: 700;
          color: #8b5cf6;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          position: relative;
          padding: 0.5em 0;
          overflow: visible;
        }

        .variable-char {
          display: inline-block;
          cursor: pointer;
          position: relative;
          color: #8b5cf6;
          font-weight: 700;
          transition: all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-origin: center bottom;
          will-change: transform, color, text-shadow;
        }

        .variable-char:not(.space):hover {
          animation: gentle-bounce 0.6s ease-out;
        }

        .variable-char.space {
          width: 0.4em;
          pointer-events: none;
        }

        @keyframes gentle-bounce {
          0% { transform: translateY(0px) scale(1); }
          30% { transform: translateY(-10px) scale(1.2); }
          60% { transform: translateY(-6px) scale(1.15); }
          100% { transform: translateY(-8px) scale(1.15); }
        }

        @keyframes wave-in {
          0% { 
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          100% { 
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
        }

        .variable-char {
          animation: wave-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @media (max-width: 768px) {
          .variable-font-container {
            font-size: 2rem !important;
            padding: 0.3em 0;
          }
        }

        @media (max-width: 480px) {
          .variable-font-container {
            font-size: 1.5rem !important;
            padding: 0.2em 0;
          }
        }
      `}</style>

      <h1
        ref={containerRef}
        className={`variable-font-container font-bold select-none ${className}`}
        style={{
          fontSize,
          lineHeight: 1.4,
          letterSpacing: "-0.02em",
          color: "#8b5cf6",
        }}
        onMouseLeave={handleContainerLeave}
      >
        {chars.map((charData, index) => (
          <span
            key={index}
            ref={(el) => (charsRef.current[index] = el)}
            className={`variable-char ${charData.isSpace ? "space" : ""}`}
            onMouseEnter={() => !charData.isSpace && handleCharHover(index)}
            style={{
              minWidth: charData.isSpace ? "0.4em" : "auto",
              pointerEvents: charData.isSpace ? "none" : "auto",
              color: "#8b5cf6",
              animationDelay: `${index * 50}ms`,
            }}
          >
            {charData.char}
          </span>
        ))}
      </h1>
    </>
  )
}
