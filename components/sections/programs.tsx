"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Code, BarChart3, Database, Clock, Users, Award, ArrowRight } from "lucide-react"
import ProgramSkeleton from "@/components/skeletons/program-skeleton"
import dynamic from "next/dynamic"
import { useModalManager } from "@/hooks/use-modal-manager"

// Dynamically import 3D component
const NeuralNetwork = dynamic(() => import("@/components/3d/neural-network"), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg" />,
})

const programs = [
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    description: "Master the art of digital defense and ethical hacking",
    icon: Shield,
    duration: "12 weeks",
    students: "150+",
    level: "Intermediate",
    skills: ["Penetration Testing", "Network Security", "Incident Response", "Risk Assessment"],
    color: "from-red-500 to-orange-500",
  },
  {
    id: "fullstack",
    title: "Full Stack Development",
    description: "Build end-to-end web applications with modern technologies",
    icon: Code,
    duration: "16 weeks",
    students: "200+",
    level: "Beginner to Advanced",
    skills: ["React/Next.js", "Node.js", "Database Design", "Cloud Deployment"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "datascience",
    title: "Data Science",
    description: "Extract insights from data using machine learning and AI",
    icon: BarChart3,
    duration: "14 weeks",
    students: "120+",
    level: "Intermediate",
    skills: ["Python/R", "Machine Learning", "Statistical Analysis", "Data Visualization"],
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "dataanalysis",
    title: "Data Analysis",
    description: "Transform raw data into actionable business insights",
    icon: Database,
    duration: "10 weeks",
    students: "180+",
    level: "Beginner",
    skills: ["SQL", "Excel/Power BI", "Statistical Methods", "Business Intelligence"],
    color: "from-purple-500 to-pink-500",
  },
]

export default function Programs() {
  const [isLoading, setIsLoading] = useState(true)
  const { openModal } = useModalManager()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleLearnMoreClick = (programId: string) => {
    console.log(`Learn More clicked for program: ${programId}`)
    openModal("course", { courseId: programId })
  }

  return (
    <section className="programs py-20 bg-muted/30 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 reveal-up">
          <h2 className="text-3xl md:text-5xl font-bold font-space-grotesk mb-4">
            Our <span className="gradient-text">Programs</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our comprehensive internship programs designed to launch your tech career
          </p>
        </div>

        {/* 3D Neural Network Visualization */}
        <div className="flex justify-center mb-16 reveal-up">
          <div className="w-80 h-64 relative">
            <NeuralNetwork />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-sm text-muted-foreground">AI-Powered Learning Network</p>
              <p className="text-xs text-muted-foreground">Connecting knowledge and skills</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => <ProgramSkeleton key={index} />)
            : programs.map((program, index) => {
                const Icon = program.icon
                return (
                  <Card
                    key={program.id}
                    className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 glass-card reveal-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="relative overflow-hidden">
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${program.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                      />
                      <div className="flex items-center justify-between relative z-10">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${program.color} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary">{program.level}</Badge>
                      </div>
                      <CardTitle className="text-xl font-space-grotesk">{program.title}</CardTitle>
                      <CardDescription className="text-base">{program.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {program.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {program.students}
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          Certificate
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Key Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {program.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="w-full group"
                        onClick={() => handleLearnMoreClick(program.id)}
                        data-testid={`learn-more-${program.id}`}
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
        </div>
      </div>
    </section>
  )
}
