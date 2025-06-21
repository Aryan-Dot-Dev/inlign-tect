import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function CTA() {
  return (
    <section className="cta py-20 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8 reveal-up">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/20 rounded-full">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold font-space-grotesk">
            Ready to Start Your <span className="gradient-text">Tech Journey?</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers through our comprehensive internship programs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group animate-glow" asChild>
              <Link href="/programs">
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Get More Info</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
