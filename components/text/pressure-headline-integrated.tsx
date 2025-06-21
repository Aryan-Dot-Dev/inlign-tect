"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"

interface PressureHeadlineIntegratedProps {
  text?: string
  className?: string
}

const PressureHeadlineIntegrated: React.FC<PressureHeadlineIntegratedProps> = ({
  text = "ABOUT US",
  className = "",
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [pressedIndex, setPressedIndex] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <h1
        className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black font-space-grotesk bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center ${className}`}
      >
        {text}
      </h1>
    )
  }

  const letters = text.split("")

  const letterVariants = {
    initial: {
      scaleX: 1,
      scaleY: 1,
      rotateZ: 0,
      y: 0,
    },
    hover: {
      scaleX: 0.6,
      scaleY: 1.4,
      rotateZ: [-2, 2, -2, 0],
      y: [-4, 4, -2, 0],
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 8,
        mass: 0.4,
        rotateZ: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 0.12,
          ease: "easeInOut",
        },
        y: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 0.1,
          ease: "easeInOut",
        },
      },
    },
    pressed: {
      scaleX: 0.3,
      scaleY: 2.0,
      rotateZ: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 700,
        damping: 6,
        mass: 0.2,
      },
    },
    release: {
      scaleX: [0.3, 1.6, 0.8, 1.2, 1],
      scaleY: [2.0, 0.4, 1.2, 0.9, 1],
      rotateZ: [0, 8, -5, 3, 0],
      y: [0, -30, 8, -4, 0],
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 10,
        mass: 1.0,
        duration: 1.5,
      },
    },
  }

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  }

  const handleLetterClick = async (index: number) => {
    setPressedIndex(index)

    // Reset after animation
    setTimeout(() => {
      setPressedIndex(null)
    }, 1500)
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
    <motion.div
      className={`flex justify-center items-center ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      style={{ minHeight: "200px" }} // Ensure enough space for large text and animations
    >
      <h1 className="flex flex-wrap justify-center gap-1">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            className="inline-block text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black font-space-grotesk bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent cursor-pointer select-none"
            style={{
              transformOrigin: "center bottom",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 0.9,
            }}
            variants={letterVariants}
            initial="initial"
            animate={pressedIndex === index ? getReleaseState(index) : getLetterState(index)}
            onHoverStart={() => pressedIndex === null && setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            onTapStart={() => handleLetterClick(index)}
            whileTap={{ scale: 0.9 }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </h1>
    </motion.div>
  )
}

export default PressureHeadlineIntegrated
