"use client"

import { useState, useEffect } from "react"
import RobotModel from "./robot-model"
import AICard from "../ai-assistant/ai-card"

interface AIAssistantProps {
  message: string
  isActive: boolean
  onClick: () => void
  onClose: () => void
}

export default function FloatingAIAssistant({ message, isActive, onClick, onClose }: AIAssistantProps) {
  const [mounted, setMounted] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isActive && message) {
      setIsThinking(true)
      const timer = setTimeout(() => setIsThinking(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [isActive, message])

  if (!mounted) return null

  return (
    <>
      {/* AI Card */}
      <AICard
        message={message}
        isVisible={isActive}
        onClose={onClose}
        onMinimize={() => setIsMinimized(!isMinimized)}
        isMinimized={isMinimized}
      />

      {/* Robot Container */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Robot Model */}
          <div className="w-20 h-20 relative">
            <RobotModel isActive={isActive} isThinking={isThinking} onClick={onClick} />
          </div>

          {/* Status Indicator */}
          <div className="absolute -top-1 -right-1">
            <div
              className={`
              w-4 h-4 rounded-full border-2 border-background
              ${isActive ? "bg-green-500" : "bg-blue-500"}
              ${!isActive ? "animate-pulse" : ""}
            `}
            />
          </div>

          {/* Interaction Hint */}
          {!isActive && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg px-2 py-1">
                <span className="text-xs text-muted-foreground">Click me!</span>
              </div>
            </div>
          )}

          {/* Ambient Glow */}
          <div
            className={`
            absolute inset-0 rounded-full blur-lg -z-10
            ${isActive ? "bg-primary/30" : "bg-blue-500/20"}
            ${!isActive ? "animate-pulse" : ""}
          `}
          />
        </div>
      </div>
    </>
  )
}
