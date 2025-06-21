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

const TextPressureFixed = ({
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

  const [fontSize, setFontSize] = useState(minFontSize)
  const [isClient, setIsClient] = useState(false)
  const [isVisible, setIsVisible] = useState(true) // Always start visible

  const chars = text.split("")

  // Distance calculation
  const dist = useCallback((a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = b.x - a.x
    const dy = b.y - a.y
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  // Safe attribute calculation
  const getAttr = useCallback((distance: number, minVal: number, maxVal: number, maxDist: number) => {
    if (maxDist === 0 || distance >= maxDist) return minVal
    const normalizedDist = Math.max(0, Math.min(1, distance / maxDist))
    const curve = Math.pow(1 - normalizedDist, 0.8)
    return minVal + (maxVal - minVal) * curve
  }, [])

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true)
    mountedRef.current = true
    setIsVisible(true)

    return () => {
      mountedRef.current = false
    }
  }, [])

  // Size calculation with safety checks
  const calculateSize = useCallback(() => {
    if (!containerRef.current || !mountedRef.current) return

    try {
      const containerRect = containerRef.current.getBoundingClientRect()
      if (containerRect.width === 0) return

      const baseSize = Math.max(containerRect.width / (chars.length * 0.7), minFontSize)
      const cappedSize = Math.min(baseSize, minFontSize * 2)
      setFontSize(cappedSize)
    } catch (error) {
      console.warn("Size calculation error:", error)
      setFontSize(minFontSize) // Fallback
    }
  }, [chars.length, minFontSize])

  // Handle resize with debouncing
  useEffect(() => {
    if (!isClient) return

    calculateSize()

    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (mountedRef.current) {
          calculateSize()
        }
      }, 150)
    }

    window.addEventListener("resize", handleResize, { passive: true })
    return () => {
      clearTimeout(resizeTimeout)
      window.removeEventListener("resize", handleResize)
    }
  }, [isClient, calculateSize])

  // Mouse tracking setup with comprehensive safety checks
  useEffect(() => {
    if (!isClient || typeof window === "undefined") return

    let cleanup: (() => void) | null = null

    // Delay initialization to ensure DOM is fully ready
    const initTimer = setTimeout(() => {
      if (!mountedRef.current || typeof window === "undefined") return

      try {
        const handleMouseMove = (e: MouseEvent) => {
          if (!mountedRef.current || !e) return
          cursorRef.current.x = e.clientX
          cursorRef.current.y = e.clientY
        }

        const handleTouchMove = (e: TouchEvent) => {
          if (!mountedRef.current || !e || !e.touches || !e.touches[0]) return
          const touch = e.touches[0]
          cursorRef.current.x = touch.clientX
          cursorRef.current.y = touch.clientY
        }

        // Initialize mouse position with multiple safety checks
        if (containerRef.current && mountedRef.current) {
          try {
            const rect = containerRef.current.getBoundingClientRect()
            if (rect && rect.width > 0 && rect.height > 0) {
              mouseRef.current.x = rect.left + rect.width / 2
              mouseRef.current.y = rect.top + rect.height / 2
              cursorRef.current.x = mouseRef.current.x
              cursorRef.current.y = mouseRef.current.y
            }
          } catch (rectError) {
            console.warn("Rect calculation error:", rectError)
            // Use fallback positions
            mouseRef.current.x = window.innerWidth / 2
            mouseRef.current.y = window.innerHeight / 2
            cursorRef.current.x = mouseRef.current.x
            cursorRef.current.y = mouseRef.current.y
          }
        }

        // Add event listeners with safety checks
        if (window && typeof window.addEventListener === "function") {
          window.addEventListener("mousemove", handleMouseMove, { passive: true })
          window.addEventListener("touchmove", handleTouchMove, { passive: true })

          cleanup = () => {
            if (window && typeof window.removeEventListener === "function") {
              window.removeEventListener("mousemove", handleMouseMove)
              window.removeEventListener("touchmove", handleTouchMove)
            }
          }
        }
      } catch (error) {
        console.warn("Mouse tracking initialization error:", error)
      }
    }, 1000) // Increased delay for better stability

    return () => {
      clearTimeout(initTimer)
      if (cleanup) {
        try {
          cleanup()
        } catch (error) {
          console.warn("Cleanup error:", error)
        }
      }
    }
  }, [isClient])

  // Animation loop with comprehensive safety checks
  useEffect(() => {
    if (!isClient || typeof window === "undefined" || typeof requestAnimationFrame === "undefined") return

    let isAnimating = false

    // Start animation with extended delay for stability
    const startTimer = setTimeout(() => {
      if (!mountedRef.current || isAnimating) return

      isAnimating = true

      const animate = () => {
        if (!mountedRef.current || !isAnimating) return

        try {
          // Smooth mouse following with safety checks
          if (mouseRef.current && cursorRef.current) {
            mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) * 0.08
            mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) * 0.08
          }

          if (titleRef.current && mountedRef.current) {
            let titleRect
            try {
              titleRect = titleRef.current.getBoundingClientRect()
            } catch (rectError) {
              console.warn("Title rect error:", rectError)
              if (mountedRef.current && isAnimating && typeof requestAnimationFrame === "function") {
                animationFrameRef.current = requestAnimationFrame(animate)
              }
              return
            }

            if (!titleRect || titleRect.width === 0 || titleRect.height === 0) {
              // Skip frame if not ready
              if (mountedRef.current && isAnimating && typeof requestAnimationFrame === "function") {
                animationFrameRef.current = requestAnimationFrame(animate)
              }
              return
            }

            const maxDist = Math.max(titleRect.width, titleRect.height) * 0.5

            // Process each span with comprehensive safety checks
            if (spansRef.current && Array.isArray(spansRef.current)) {
              spansRef.current.forEach((span, index) => {
                if (!span || !mountedRef.current || !isAnimating) return

                try {
                  let rect
                  try {
                    rect = span.getBoundingClientRect()
                  } catch (spanRectError) {
                    console.warn(`Span ${index} rect error:`, spanRectError)
                    return
                  }

                  if (!rect || rect.width === 0 || rect.height === 0) return

                  const charCenter = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                  }

                  if (!mouseRef.current || typeof charCenter.x !== "number" || typeof charCenter.y !== "number") return

                  const distance = dist(mouseRef.current, charCenter)
                  if (typeof distance !== "number" || isNaN(distance)) return

                  // Conservative ranges to ensure visibility
                  const fontWidth = width ? Math.floor(getAttr(distance, 90, 110, maxDist)) : 100
                  const fontWeight = weight ? Math.floor(getAttr(distance, 500, 700, maxDist)) : 600
                  const italicValue = italic ? getAttr(distance, 0, 0.1, maxDist).toFixed(2) : "0"
                  const opacityValue = alpha ? Math.max(0.85, getAttr(distance, 0.85, 1, maxDist)).toFixed(2) : "1"

                  // Apply styles with extensive safety checks
                  if (span.style && typeof span.style === "object") {
                    try {
                      span.style.opacity = opacityValue
                      span.style.fontWeight = fontWeight.toString()

                      // Only apply font variations if supported and safe
                      if (
                        typeof CSS !== "undefined" &&
                        CSS.supports &&
                        CSS.supports("font-variation-settings", "'wght' 400") &&
                        fontWeight >= 400 &&
                        fontWeight <= 900 &&
                        fontWidth >= 80 &&
                        fontWidth <= 120
                      ) {
                        try {
                          span.style.fontVariationSettings = `'wght' ${fontWeight}, 'wdth' ${fontWidth}, 'ital' ${italicValue}`
                        } catch (fontVarError) {
                          // Fallback to regular font-weight
                          span.style.fontWeight = fontWeight.toString()
                        }
                      }
                    } catch (styleError) {
                      console.warn(`Style application error for span ${index}:`, styleError)
                    }
                  }
                } catch (spanError) {
                  console.warn(`Span processing error for index ${index}:`, spanError)
                }
              })
            }
          }

          if (mountedRef.current && isAnimating && typeof requestAnimationFrame === "function") {
            animationFrameRef.current = requestAnimationFrame(animate)
          }
        } catch (animationError) {
          console.warn("Animation loop error:", animationError)
          isAnimating = false
        }
      }

      if (typeof requestAnimationFrame === "function") {
        animate()
      }
    }, 1200) // Extended delay for maximum stability

    return () => {
      clearTimeout(startTimer)
      isAnimating = false
      if (animationFrameRef.current && typeof cancelAnimationFrame === "function") {
        try {
          cancelAnimationFrame(animationFrameRef.current)
        } catch (cancelError) {
          console.warn("Animation cancel error:", cancelError)
        }
      }
    }
  }, [isClient, width, weight, italic, alpha, dist, getAttr])

  // Always render visible text - no conditional hiding
  const renderVisibleText = () => (
    <h1
      ref={titleRef}
      className={`text-pressure-title ${className} ${flex ? "flex" : ""} ${stroke ? "stroke" : ""}`}
      style={{
        fontFamily: `'${fontFamily}', 'Space Grotesk', system-ui, sans-serif`,
        fontSize: `${fontSize}px`,
        fontWeight: stroke ? 400 : 600,
        lineHeight: 1.2,
        margin: 0,
        padding: 0,
        textAlign: "center" as const,
        userSelect: "none" as const,
        textRendering: "optimizeLegibility" as const,
        WebkitFontSmoothing: "antialiased" as const,
        MozOsxFontSmoothing: "grayscale" as const,
        // FIXED: Proper gradient with fallback
        ...(stroke
          ? {
              color: textColor,
            }
          : {
              background: "linear-gradient(135deg, #8b5cf6, #a855f7, #ec4899)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "#8b5cf6", // CRITICAL: Fallback color
            }),
        // FIXED: Ensure visibility
        opacity: 1,
        visibility: "visible" as const,
        display: "block",
        position: "relative" as const,
        zIndex: 1,
      }}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          ref={(el) => (spansRef.current[i] = el)}
          data-char={char}
          style={{
            display: "inline-block",
            fontVariationSettings: "'wght' 600, 'wdth' 100, 'ital' 0",
            fontWeight: 600,
            transition: isClient ? "font-variation-settings 0.2s ease-out, font-weight 0.2s ease-out" : "none",
            transformOrigin: "center center",
            backfaceVisibility: "hidden" as const,
            willChange: isClient ? "font-variation-settings, font-weight" : "auto",
            // FIXED: Ensure each character is visible
            opacity: 1,
            visibility: "visible" as const,
            color: stroke ? textColor : "inherit",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  )

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center relative"
      style={{
        minHeight: `${fontSize * 1.4}px`,
        // FIXED: Ensure container visibility
        opacity: 1,
        visibility: "visible",
        position: "relative",
        zIndex: 1,
      }}
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

      {/* FIXED: Stroke styles with proper visibility */}
      {stroke && (
        <style>{`
          .stroke .text-pressure-title span {
            position: relative;
            color: ${textColor} !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
          .stroke .text-pressure-title span::after {
            content: attr(data-char);
            position: absolute;
            left: 0;
            top: 0;
            color: transparent;
            z-index: -1;
            -webkit-text-stroke-width: ${strokeWidth}px;
            -webkit-text-stroke-color: ${strokeColor};
          }
        `}</style>
      )}

      {renderVisibleText()}
    </div>
  )
}

export default TextPressureFixed
