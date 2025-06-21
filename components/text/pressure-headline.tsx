"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"

interface PressureHeadlineProps {
  text?: string
  className?: string
}

const PressureHeadline: React.FC<PressureHeadlineProps> = ({ text = "ABOUT US", className = "" }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [pressedIndex, setPressedIndex] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className={`text-6xl md:text-8xl font-black text-white text-center ${className}`}>{text}</div>
  }

  const letters = text.split("")

  const letterVariants = {
    initial: {
      scaleX: 1,
      scaleY: 1,
      rotateZ: 0,
      y: 0,
      filter: "brightness(1)",
    },
    hover: {
      scaleX: 0.7,
      scaleY: 1.3,
      rotateZ: [-1, 1, -1, 0],
      y: [-2, 2, -1, 0],
      filter: "brightness(1.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
        mass: 0.5,
        rotateZ: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 0.15,
          ease: "easeInOut",
        },
        y: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 0.12,
          ease: "easeInOut",
        },
      },
    },
    pressed: {
      scaleX: 0.4,
      scaleY: 1.8,
      rotateZ: 0,
      y: 0,
      filter: "brightness(1.5)",
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 8,
        mass: 0.3,
      },
    },
    release: {
      scaleX: [0.4, 1.4, 0.9, 1.1, 1],
      scaleY: [1.8, 0.6, 1.1, 0.95, 1],
      rotateZ: [0, 5, -3, 2, 0],
      y: [0, -20, 5, -2, 0],
      filter: ["brightness(1.5)", "brightness(0.8)", "brightness(1.1)", "brightness(1)"],
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 12,
        mass: 0.8,
        duration: 1.2,
      },
    },
  }

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const handleLetterClick = async (index: number) => {
    setPressedIndex(index)

    // Reset after animation
    setTimeout(() => {
      setPressedIndex(null)
    }, 1200)
  }

  const getLetterState = (index: number) => {
    if (pressedIndex === index) return "pressed"
    if (hoveredIndex === index) return "hover"
    return "initial"
  }

  const getReleaseState = (index: number) => {
    return pressedIndex === index ? "release" : getLetterState(index)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-95" />

      {/* Animated background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: 0,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main headline */}
      <motion.div
        className="relative z-10 flex justify-center items-center min-h-[200px] px-4"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex flex-wrap justify-center gap-1 md:gap-2">
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              className="inline-block text-6xl md:text-8xl lg:text-9xl font-black text-white cursor-pointer select-none"
              style={{
                fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                textShadow: "0 4px 20px rgba(0,0,0,0.5)",
                transformOrigin: "center bottom",
              }}
              variants={letterVariants}
              initial="initial"
              animate={pressedIndex === index ? getReleaseState(index) : getLetterState(index)}
              onHoverStart={() => pressedIndex === null && setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onTapStart={() => handleLetterClick(index)}
              whileTap={{ scale: 0.95 }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Pressure indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-sm font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Hover to compress • Click to release
      </motion.div>

      {/* Intensity meter */}
      <div className="absolute top-8 right-8 flex flex-col items-end space-y-2">
        <div className="text-white/40 text-xs font-medium">PRESSURE</div>
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-8 bg-white/20 rounded-full"
              animate={{
                backgroundColor:
                  hoveredIndex !== null || pressedIndex !== null
                    ? i < 3
                      ? "#ef4444"
                      : "#fbbf24"
                    : "rgba(255,255,255,0.2)",
                scaleY: hoveredIndex !== null || pressedIndex !== null ? 1 + i * 0.2 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PressureHeadline
