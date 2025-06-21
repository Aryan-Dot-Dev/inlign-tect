"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Users, Award, Lightbulb } from "lucide-react"
import ProfileSkeleton from "@/components/skeletons/profile-skeleton"
import { usePerformanceContext } from "@/components/optimization/performance-provider"
import TextPressureFixed from "@/components/text/text-pressure-fixed"
import Optimized3DLoader from "@/components/3d/optimized-3d-loader"
import AdaptiveComponent from "@/components/optimization/adaptive-component"

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

export default function AboutFixed() {
  const [isLoading, setIsLoading] = useState(true)
  const { config, metrics } = usePerformanceContext()

  useEffect(() => {
    const loadTime = metrics.performanceLevel > 0.6 ? 1200 : 600
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, loadTime)

    return () => clearTimeout(timer)
  }, [metrics.performanceLevel])

  return (
    <section className="about py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* FIXED: Enhanced Interactive Header */}
        <div className="text-center mb-16 reveal-up py-16 rounded-3xl relative overflow-hidden">
          {config.enableFluidEffects && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/6 via-purple-500/4 to-pink-500/6 rounded-3xl" />
          )}

          <div className="relative z-10">
            {/* FIXED: Flexible container with proper sizing */}
            <div
              className="w-full max-w-6xl mx-auto mb-8 flex items-center justify-center"
              style={{
                minHeight: "100px",
                // FIXED: Remove fixed height constraint
              }}
            >
              {typeof window !== "undefined" ? (
                <TextPressureFixed
                  text="About Inlighn Tech"
                  flex={false}
                  alpha={false}
                  stroke={false}
                  width={true}
                  weight={true}
                  italic={false}
                  scale={false}
                  textColor="#8b5cf6"
                  minFontSize={metrics.deviceType === "mobile" ? 24 : 36}
                  className="text-3xl md:text-5xl font-bold"
                />
              ) : (
                <h1 className="text-3xl md:text-5xl font-bold gradient-text text-center">About Inlighn Tech</h1>
              )}
            </div>

            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6 relative leading-relaxed">
              We're dedicated to bridging the gap between academic learning and industry requirements, providing
              students with practical skills and{" "}
              <span className="gradient-text font-semibold">real-world experience</span> through innovative technology
              and interactive learning.
            </p>

            {config.enableFluidEffects && (
              <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-background/20 backdrop-blur-sm rounded-full border border-white/10">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground/80">
                  Move your cursor over the title to see the pressure effect
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Values Section */}
        <div
          className={`grid ${metrics.deviceType === "mobile" ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-4"} gap-6 mb-20`}
        >
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card
                key={index}
                className={`text-center group glass-card transition-all duration-300 reveal-up bg-card border-border ${
                  config.enableAnimations ? "hover:shadow-xl hover:-translate-y-2" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                      config.enableAnimations ? "group-hover:bg-primary/20 group-hover:scale-110" : ""
                    }`}
                  >
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 gradient-text">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 3D Tech Hologram */}
        <AdaptiveComponent
          minPerformanceLevel={0.5}
          requireDesktop={false}
          require3D={true}
          fallback={
            <div className="flex justify-center mb-16 reveal-up">
              <div className="w-80 h-56 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium gradient-text">Innovation Visualization</p>
                </div>
              </div>
            </div>
          }
        >
          <div className="flex justify-center mb-16 reveal-up">
            <div className="w-80 h-56 relative group">
              <Optimized3DLoader component="tech-hologram" />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-sm text-muted-foreground font-medium gradient-text">Innovation Visualization</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Interactive 3D Technology Showcase</p>
              </div>
            </div>
          </div>
        </AdaptiveComponent>

        {/* Team Section */}
        <div className="reveal-up">
          <div className="text-center mb-12">
            {/* FIXED: Flexible container for team title */}
            <div
              className="w-full max-w-5xl mx-auto mb-4 flex items-center justify-center"
              style={{
                minHeight: "70px",
                // FIXED: Remove fixed height constraint
              }}
            >
              {typeof window !== "undefined" ? (
                <TextPressureFixed
                  text="Meet Our Expert Team"
                  flex={false}
                  alpha={false}
                  stroke={false}
                  width={true}
                  weight={true}
                  italic={false}
                  scale={false}
                  textColor="#8b5cf6"
                  minFontSize={metrics.deviceType === "mobile" ? 20 : 28}
                  className="text-2xl md:text-3xl font-bold"
                />
              ) : (
                <h2 className="text-2xl md:text-3xl font-bold gradient-text text-center">Meet Our Expert Team</h2>
              )}
            </div>
          </div>

          <div className={`grid ${metrics.deviceType === "mobile" ? "grid-cols-1" : "md:grid-cols-3"} gap-8`}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => <ProfileSkeleton key={index} />)
              : team.map((member, index) => (
                  <Card
                    key={index}
                    className={`group glass-card transition-all duration-300 bg-card border-border ${
                      config.enableAnimations ? "hover:shadow-2xl hover:-translate-y-2" : ""
                    }`}
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-20 h-20 bg-gradient-to-r from-primary to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center transition-transform duration-300 ${
                          config.enableAnimations ? "group-hover:scale-110" : ""
                        }`}
                      >
                        <span className="text-white font-bold text-xl">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <h4 className="font-semibold text-lg mb-1 gradient-text">{member.name}</h4>
                      <p className="text-muted-foreground mb-4">{member.role}</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className={`text-xs transition-colors ${
                              config.enableAnimations ? "hover:bg-primary/20" : ""
                            }`}
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
