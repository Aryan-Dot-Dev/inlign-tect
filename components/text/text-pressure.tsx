"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface TextPressureProps {
  text?: string
  fontFamily?: string
  fontUrl?: string
  width?: boolean
  weight?: boolean
  italic?: boolean
  alpha?: boolean
  flex?: boolean
  stroke?: boolean
  scale?: boolean
  textColor?: string
  strokeColor?: string
  strokeWidth?: number
  className?: string
  minFontSize?: number
}

const TextPressure = ({
  text = "Text Pressure",
  fontFamily = "Space Grotesk",
  fontUrl = "",
  width = true,
  weight = true,
  italic = false,
  alpha = false,
  flex = false,
  stroke = false,
  scale = false,
  textColor = "#8b5cf6",
  strokeColor = "#FF0000",
  strokeWidth = 2,
  className = "",
  minFontSize = 24,
}: TextPressureProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const spansRef = useRef<(HTMLSpanElement | null)[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const cursorRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number | null>(null)
  const mountedRef = useRef(false)
  const initializedRef = useRef(false)

  const [fontSize, setFontSize] = useState(minFontSize)
  const [scaleY, setScaleY] = useState(1)
  const [lineHeight, setLineHeight] = useState(1.2)
  const [isClient, setIsClient] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const chars = text.split("")

  // Distance calculation
  const dist = useCallback((a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = b.x - a.x
    const dy = b.y - a.y
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  // Attribute calculation with safe bounds
  const getAttr = useCallback((distance: number, minVal: number, maxVal: number, maxDist: number) => {
    if (maxDist === 0 || distance >= maxDist) return minVal
    const normalizedDist = Math.max(0, Math.min(1, distance / maxDist))
    const curve = 1 - normalizedDist
    return minVal + (maxVal - minVal) * curve
  }, [])

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true)
    mountedRef.current = true

    // Set ready state after a brief delay to ensure DOM is stable
    const readyTimer = setTimeout(() => {
      if (mountedRef.current) {
        setIsReady(true)
      }
    }, 100)

    return () => {
      mountedRef.current = false
      clearTimeout(readyTimer)
    }
  }, [])

  // Size calculation
  const calculateSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current || !mountedRef.current) return

    try {
      const containerRect = containerRef.current.getBoundingClientRect()
      if (containerRect.width === 0) return

      // Calculate responsive font size
      const baseSize = Math.max(containerRect.width / (chars.length * 0.6), minFontSize)
      const cappedSize = Math.min(baseSize, minFontSize * 2.2)

      setFontSize(cappedSize)
      setLineHeight(1.2)
      setScaleY(1)

      if (scale) {
        requestAnimationFrame(() => {
          if (!titleRef.current || !mountedRef.current) return
          try {
            const textRect = titleRef.current.getBoundingClientRect()
            if (textRect.height > 0 && containerRect.height > 0) {
              const ratio = Math.min(containerRect.height / textRect.height, 1.5)
              setScaleY(ratio)
              setLineHeight(ratio * 1.2)
            }
          } catch (error) {
            console.warn("Scale calculation error:", error)
          }
        })
      }
    } catch (error) {
      console.warn("Size calculation error:", error)
    }
  }, [chars.length, minFontSize, scale])

  // Handle resize
  useEffect(() => {
    if (!isClient || !isReady) return

    calculateSize()

    const handleResize = () => {
      if (mountedRef.current) {
        calculateSize()
      }
    }

    window.addEventListener("resize", handleResize, { passive: true })
    return () => window.removeEventListener("resize", handleResize)
  }, [isClient, isReady, calculateSize])

  // Mouse tracking setup
  useEffect(() => {
    if (!isClient || !isReady) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!mountedRef.current) return
      cursorRef.current.x = e.clientX
      cursorRef.current.y = e.clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!mountedRef.current) return
      const touch = e.touches[0]
      if (touch) {
        cursorRef.current.x = touch.clientX
        cursorRef.current.y = touch.clientY
      }
    }

    // Initialize mouse position
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current.x = rect.left + rect.width / 2
      mouseRef.current.y = rect.top + rect.height / 2
      cursorRef.current.x = mouseRef.current.x
      cursorRef.current.y = mouseRef.current.y
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [isClient, isReady])

  // Animation loop
  useEffect(() => {
    if (!isClient || !isReady || !mountedRef.current) return

    const animate = () => {
      if (!mountedRef.current) return

      try {
        // Smooth mouse following
        mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) * 0.1
        mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) * 0.1

        if (titleRef.current) {
          const titleRect = titleRef.current.getBoundingClientRect()
          if (titleRect.width === 0) {
            if (mountedRef.current) {
              animationFrameRef.current = requestAnimationFrame(animate)
            }
            return
          }

          const maxDist = Math.max(titleRect.width, titleRect.height) * 0.6

          spansRef.current.forEach((span) => {
            if (!span || !mountedRef.current) return

            try {
              const rect = span.getBoundingClientRect()
              if (rect.width === 0) return

              const charCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              }

              const distance = dist(mouseRef.current, charCenter)

              // Calculate attributes with safe ranges
              const fontWidth = width ? Math.floor(getAttr(distance, 85, 115, maxDist)) : 100
              const fontWeight = weight ? Math.floor(getAttr(distance, 500, 800, maxDist)) : 600
              const italicValue = italic ? getAttr(distance, 0, 0.2, maxDist).toFixed(2) : "0"
              const opacityValue = alpha ? Math.max(0.7, getAttr(distance, 0.7, 1, maxDist)).toFixed(2) : "1"

              // Apply styles with fallbacks
              span.style.opacity = opacityValue
              span.style.fontWeight = fontWeight.toString()

              // Apply font variations if supported
              if (CSS.supports("font-variation-settings", "'wght' 400")) {
                span.style.fontVariationSettings = `'wght' ${fontWeight}, 'wdth' ${fontWidth}, 'ital' ${italicValue}`
              }
            } catch (error) {
              console.warn("Span animation error:", error)
            }
          })
        }

        if (mountedRef.current) {
          animationFrameRef.current = requestAnimationFrame(animate)
        }
      } catch (error) {
        console.warn("Animation loop error:", error)
      }
    }

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isClient, isReady, width, weight, italic, alpha, dist, getAttr])

  // Render fallback for SSR
  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h1
          className={`${className} text-center font-space-grotesk font-bold gradient-text`}
          style={{
            fontSize: `${minFontSize}px`,
            fontWeight: 600,
            background: "linear-gradient(135deg, #8b5cf6, #a855f7, #ec4899)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.2,
          }}
        >
          {text}
        </h1>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center relative"
      style={{ minHeight: `${fontSize * 1.4}px` }}
    >
      {/* Font loading */}
      {fontUrl && (
        <style>{`
          @font-face {
            font-family: '${fontFamily}';
            src: url('${fontUrl}');
            font-style: normal;
            font-display: swap;
          }
        `}</style>
      )}

      {/* Component styles */}
      <style>{`
        .text-pressure-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .text-pressure-title {
          font-family: '${fontFamily}', 'Space Grotesk', system-ui, sans-serif;
          font-weight: 600;
          text-align: center;
          margin: 0;
          padding: 0;
          line-height: ${lineHeight};
          font-size: ${fontSize}px;
          transform: scale(1, ${scaleY});
          transform-origin: center center;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          ${
            stroke
              ? `color: ${textColor};`
              : `
            background: linear-gradient(135deg, #8b5cf6, #a855f7, #ec4899);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
          `
          }
        }
        
        .text-pressure-title.flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .text-pressure-char {
          display: inline-block;
          font-variation-settings: 'wght' 600, 'wdth' 100, 'ital' 0;
          font-weight: 600;
          transition: font-variation-settings 0.15s cubic-bezier(0.4, 0, 0.2, 1), 
                      font-weight 0.15s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.15s ease-out;
          transform-origin: center center;
          backface-visibility: hidden;
          will-change: font-variation-settings, font-weight, opacity;
          opacity: 1;
        }
        
        .stroke .text-pressure-char {
          position: relative;
          color: ${textColor};
        }
        
        .stroke .text-pressure-char::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }
        
        @media (max-width: 768px) {
          .text-pressure-title {
            font-size: ${Math.max(fontSize * 0.8, minFontSize * 0.8)}px;
          }
        }
        
        @media (max-width: 480px) {
          .text-pressure-title {
            font-size: ${Math.max(fontSize * 0.7, minFontSize * 0.7)}px;
          }
        }
      `}</style>

      <h1 ref={titleRef} className={`text-pressure-title ${className} ${flex ? "flex" : ""} ${stroke ? "stroke" : ""}`}>
        {chars.map((char, i) => (
          <span key={i} ref={(el) => (spansRef.current[i] = el)} data-char={char} className="text-pressure-char">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
    </div>
  )
}

export default TextPressure
