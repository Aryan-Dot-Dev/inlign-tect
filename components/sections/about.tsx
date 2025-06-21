"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Users, Award, Lightbulb } from "lucide-react"
import ProfileSkeleton from "@/components/skeletons/profile-skeleton"
import dynamic from "next/dynamic"
import InteractiveHeaderBgOptimized from "@/components/3d/interactive-header-bg-optimized"
import FluidTextDistortion from "@/components/text/fluid-text-distortion"
import GradientTextFluid from "@/components/text/gradient-text-fluid"

// Dynamically import 3D component with better loading state
const TechHologram = dynamic(() => import("@/components/3d/tech-hologram"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg animate-pulse" />
  ),
})

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "Empowering the next generation of tech professionals through hands-on learning and industry exposure.",
  },
  {
    icon: Users,
    title: "Community-Focused",
    description: "Building a supportive network of learners, mentors, and industry professionals.",
  },
  {
    icon: Award,
    title: "Excellence-Oriented",
    description: "Maintaining the highest standards in education and professional development.",
  },
  {
    icon: Lightbulb,
    title: "Innovation-Led",
    description: "Staying ahead of industry trends and emerging technologies.",
  },
]

const team = [
  {
    name: "Sarah Chen",
    role: "Head of Cybersecurity",
    image: "/placeholder.svg?height=100&width=100",
    skills: ["Ethical Hacking", "Network Security", "Compliance"],
  },
  {
    name: "Marcus Rodriguez",
    role: "Full Stack Lead",
    image: "/placeholder.svg?height=100&width=100",
    skills: ["React", "Node.js", "Cloud Architecture"],
  },
  {
    name: "Dr. Priya Patel",
    role: "Data Science Director",
    image: "/placeholder.svg?height=100&width=100",
    skills: ["Machine Learning", "Statistics", "Python"],
  },
]

export default function About() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="about py-20">
      <div className="container mx-auto px-4">
        {/* Enhanced Interactive Header with Fluid Text */}
        <InteractiveHeaderBgOptimized className="text-center mb-16 reveal-up py-16 rounded-3xl">
          <div className="relative z-10">
            {/* Fluid Text Distortion Effect */}
            <FluidTextDistortion
              text="About Inlighn Tech"
              className="mb-6"
              baseSize={48}
              intensity={1.2}
              viscosity={0.25}
              surfaceTension={2.5}
            />

            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6 relative leading-relaxed">
              We're dedicated to bridging the gap between academic learning and industry requirements, providing
              students with practical skills and{" "}
              <GradientTextFluid intensity={0.8}>real-world experience</GradientTextFluid> through innovative technology
              and interactive learning.
            </p>

            {/* Enhanced interaction hint */}
            <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-background/20 backdrop-blur-sm rounded-full border border-white/10">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground/80">
                Experience fluid text dynamics - hover over the title above
              </span>
            </div>
          </div>
        </InteractiveHeaderBgOptimized>

        {/* Values Section with enhanced animations */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card
                key={index}
                className="text-center group hover:shadow-xl transition-all duration-300 reveal-up glass-card hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    <GradientTextFluid intensity={0.6}>{value.title}</GradientTextFluid>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 3D Tech Hologram with enhanced presentation */}
        <div className="flex justify-center mb-16 reveal-up">
          <div className="w-80 h-56 relative group">
            <TechHologram />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-sm text-muted-foreground font-medium">
                <GradientTextFluid intensity={0.5}>Innovation Visualization</GradientTextFluid>
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">Interactive 3D Technology Showcase</p>
            </div>
          </div>
        </div>

        {/* Team Section with enhanced styling */}
        <div className="reveal-up">
          <h3 className="text-2xl md:text-3xl font-bold font-space-grotesk text-center mb-12">
            Meet Our <GradientTextFluid intensity={1.0}>Expert Team</GradientTextFluid>
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => <ProfileSkeleton key={index} />)
              : team.map((member, index) => (
                  <Card
                    key={index}
                    className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 glass-card"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-primary to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-xl">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <h4 className="font-semibold text-lg mb-1">
                        <GradientTextFluid intensity={0.7}>{member.name}</GradientTextFluid>
                      </h4>
                      <p className="text-muted-foreground mb-4">{member.role}</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs hover:bg-primary/20 transition-colors"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </div>
    </section>
  )
}
