import Programs from "@/components/sections/programs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Programs - Inlighn Tech",
  description:
    "Explore our comprehensive internship programs in Cybersecurity, Full Stack Development, Data Science, and Data Analysis.",
}

export default function ProgramsPage() {
  return (
    <main className="pt-16">
      <Programs />
    </main>
  )
}
