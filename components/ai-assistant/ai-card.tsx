"use client"

import { useState, useEffect } from "react"
import { X, Minimize2, Maximize2, MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AICardProps {
  message: string
  isVisible: boolean
  onClose: () => void
  onMinimize: () => void
  isMinimized: boolean
}

export default function AICard({ message, isVisible, onClose, onMinimize, isMinimized }: AICardProps) {
  const [isTyping, setIsTyping] = useState(false)
  const [displayedMessage, setDisplayedMessage] = useState("")

  useEffect(() => {
    if (isVisible && message) {
      setIsTyping(true)
      setDisplayedMessage("")

      // Typing animation
      let currentIndex = 0
      const typingInterval = setInterval(() => {
        if (currentIndex < message.length) {
          setDisplayedMessage(message.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          setIsTyping(false)
          clearInterval(typingInterval)
        }
      }, 30)

      return () => clearInterval(typingInterval)
    }
  }, [message, isVisible])

  if (!isVisible) return null

  return (
    <div
      className={`
      fixed bottom-32 right-6 z-40 
      transition-all duration-300 ease-in-out
      ${isMinimized ? "w-16 h-16" : "w-96 max-w-[calc(100vw-2rem)]"}
    `}
    >
      <div
        className={`
        bg-gradient-to-br from-background/95 to-background/90 
        backdrop-blur-xl border border-border/50 
        rounded-2xl shadow-2xl
        transition-all duration-300
        ${isMinimized ? "p-2" : "p-6"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {!isMinimized && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">{isTyping ? "Typing..." : "Online"}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            {!isMinimized && (
              <Button variant="ghost" size="sm" onClick={onMinimize} className="w-8 h-8 p-0 hover:bg-muted/50">
                <Minimize2 className="w-4 h-4" />
              </Button>
            )}
            {isMinimized && (
              <Button variant="ghost" size="sm" onClick={onMinimize} className="w-8 h-8 p-0 hover:bg-muted/50">
                <Maximize2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0 hover:bg-destructive/20 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Message Content */}
        {!isMinimized && (
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
              <p className="text-sm text-foreground leading-relaxed">
                {displayedMessage}
                {isTyping && <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 px-3 bg-background/50 hover:bg-muted/50"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Go to Top
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 px-3 bg-background/50 hover:bg-muted/50"
                onClick={() => {
                  const programsSection = document.querySelector(".programs")
                  programsSection?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                View Programs
              </Button>
            </div>
          </div>
        )}

        {/* Minimized state */}
        {isMinimized && (
          <div className="flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
        )}

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl -z-10 blur-xl" />
      </div>

      {/* Connection line to robot */}
      <div className="absolute bottom-0 right-8 w-px h-8 bg-gradient-to-b from-border to-transparent" />
    </div>
  )
}
