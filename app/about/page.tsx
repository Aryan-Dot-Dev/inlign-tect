import About from "@/components/sections/about"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Inlighn Tech",
  description:
    "Learn about our mission, values, and the expert team behind Inlighn Tech's innovative internship programs.",
}

export default function AboutPage() {
  return (
    <main className="pt-16">
      <About />
    </main>
  )
}
