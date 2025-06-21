"use client"

import type React from "react"
import { useAIAssistant } from "@/hooks/use-ai-assistant"
import dynamic from "next/dynamic"

const FloatingAIAssistant = dynamic(() => import("@/components/3d/floating-ai-assistant"), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-6 right-6 z-50 w-20 h-20 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full animate-pulse" />
  ),
})

export default function AIAssistantProvider({ children }: { children: React.ReactNode }) {
  const { currentMessage, isActive, toggleActive, closeAssistant } = useAIAssistant()

  return (
    <>
      {children}
      <FloatingAIAssistant
        message={currentMessage}
        isActive={isActive}
        onClick={toggleActive}
        onClose={closeAssistant}
      />
    </>
  )
}
