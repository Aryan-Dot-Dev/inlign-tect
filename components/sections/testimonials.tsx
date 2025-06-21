"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import ProfileSkeleton from "@/components/skeletons/profile-skeleton"

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Cybersecurity Analyst at TechCorp",
    program: "Cybersecurity",
    content:
      "The hands-on approach and real-world scenarios prepared me perfectly for my current role. The mentorship was exceptional.",
    rating: 5,
  },
  {
    name: "Maria Garcia",
    role: "Full Stack Developer at StartupXYZ",
    program: "Full Stack Development",
    content:
      "From zero to full-stack developer in 16 weeks. The curriculum is comprehensive and the support is outstanding.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Data Scientist at DataFlow Inc",
    program: "Data Science",
    content:
      "The practical projects and industry connections helped me land my dream job. Highly recommend this program.",
    rating: 5,
  },
]

export default function Testimonials() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="testimonials py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 reveal-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Student Success Stories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Hear from our graduates who are now thriving in their tech careers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => <ProfileSkeleton key={index} />)
            : testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 reveal-up bg-card border-border"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <p className="text-muted-foreground mb-6 italic leading-relaxed">"{testimonial.content}"</p>

                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-r from-primary to-purple-600 text-white font-semibold">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {testimonial.program}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  )
}
