"use client"

import { useState, useEffect, useCallback } from "react"

interface AssistantMessage {
  id: string
  message: string
  section: string
}

const assistantMessages: AssistantMessage[] = [
  {
    id: "hero",
    message:
      "👋 Welcome to Inlighn Tech! I'm ARIA, your AI learning companion. I'm here to guide you through our innovative internship programs and help you find the perfect path for your tech career!",
    section: "hero",
  },
  {
    id: "about",
    message:
      "🎯 Discover our mission and meet the expert team behind Inlighn Tech! Our instructors are industry professionals who bring real-world experience to every lesson. Want to know more about any specific team member?",
    section: "about",
  },
  {
    id: "programs",
    message:
      "🚀 Here are our cutting-edge programs! Each one includes hands-on projects, industry mentorship, and job placement assistance. Which field interests you most? I can provide detailed information about any program!",
    section: "programs",
  },
  {
    id: "stats",
    message:
      "📊 These numbers showcase our commitment to student success! Our 95% job placement rate and 4.9/5 rating reflect the quality of education and support we provide. Ready to become part of these success stories?",
    section: "stats",
  },
  {
    id: "testimonials",
    message:
      "⭐ Read inspiring stories from our graduates! These testimonials show real career transformations. Many of our students land jobs at top tech companies within months of graduation. Your success story could be next!",
    section: "testimonials",
  },
  {
    id: "cta",
    message:
      "🎉 Ready to transform your career? This is your moment! Click 'Apply Now' to start your application, or 'Get More Info' if you have questions. I'm here to help with any concerns about the application process!",
    section: "cta",
  },
  {
    id: "contact",
    message:
      "📞 Need personalized guidance? Our admissions team is ready to help! Fill out the contact form with your questions, and we'll provide detailed information about programs, schedules, and career outcomes.",
    section: "contact",
  },
  {
    id: "verify",
    message:
      "🔍 Verify the authenticity of any Inlighn Tech certificate here! Our blockchain-secured certificates ensure your achievements are recognized worldwide. Enter any certificate ID to see the verification process in action!",
    section: "verify",
  },
  {
    id: "default",
    message:
      "👋 Hi there! I'm ARIA, your AI assistant at Inlighn Tech. I can help you navigate our programs, answer questions about admissions, or provide guidance on choosing the right tech career path. What would you like to know?",
    section: "default",
  },
]

export function useAIAssistant() {
  const [currentMessage, setCurrentMessage] = useState<AssistantMessage>(assistantMessages[8]) // Start with default
  const [isActive, setIsActive] = useState(false)
  const [hasShownWelcome, setHasShownWelcome] = useState(false)

  const getCurrentSection = useCallback(() => {
    const pathname = window.location.pathname
    if (pathname === "/contact") return "contact"
    if (pathname === "/verify") return "verify"
    if (pathname === "/about") return "about"
    if (pathname === "/programs") return "programs"

    if (pathname === "/") {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      const sections = document.querySelectorAll("section")
      let currentSection = "hero"

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
          if (section.classList.contains("hero")) currentSection = "hero"
          else if (section.classList.contains("about")) currentSection = "about"
          else if (section.classList.contains("programs")) currentSection = "programs"
          else if (section.classList.contains("stats")) currentSection = "stats"
          else if (section.classList.contains("testimonials")) currentSection = "testimonials"
          else if (section.classList.contains("cta")) currentSection = "cta"
        }
      })

      return currentSection
    }

    return "default"
  }, [])

  const updateMessage = useCallback(() => {
    const currentSection = getCurrentSection()
    const message = assistantMessages.find((msg) => msg.section === currentSection)

    if (message && message.id !== currentMessage.id) {
      setCurrentMessage(message)
    }
  }, [currentMessage.id, getCurrentSection])

  useEffect(() => {
    // Show welcome message after 3 seconds
    const welcomeTimer = setTimeout(() => {
      if (!hasShownWelcome) {
        const heroMessage = assistantMessages.find((msg) => msg.section === "hero")
        if (heroMessage) {
          setCurrentMessage(heroMessage)
          setIsActive(true)
          setHasShownWelcome(true)

          // Auto-hide welcome after 8 seconds
          setTimeout(() => {
            setIsActive(false)
          }, 8000)
        }
      }
    }, 3000)

    const handleScroll = () => {
      updateMessage()
    }

    const handleRouteChange = () => {
      updateMessage()
    }

    updateMessage()

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      clearTimeout(welcomeTimer)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [hasShownWelcome, updateMessage])

  const toggleActive = useCallback(() => {
    setIsActive(!isActive)
  }, [isActive])

  const closeAssistant = useCallback(() => {
    setIsActive(false)
  }, [])

  const showMessage = useCallback((message: string) => {
    setCurrentMessage({ id: "custom", message, section: "custom" })
    setIsActive(true)
  }, [])

  return {
    currentMessage: currentMessage.message,
    isActive,
    toggleActive,
    closeAssistant,
    showMessage,
  }
}
