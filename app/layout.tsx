import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import CustomCursor from "@/components/custom-cursor"
import AIAssistantProvider from "@/components/ai-assistant-provider"
import ModalProvider from "@/components/modal-provider"
import { PerformanceProvider } from "@/components/optimization/performance-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Inlighn Tech - Innovative Internship Programs",
  description:
    "Join our cutting-edge internship programs in Cybersecurity, Full Stack Development, Data Science, and Data Analysis.",
  keywords: "internship, technology, cybersecurity, full stack, data science, programming",
  authors: [{ name: "Inlighn Tech" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Inlighn Tech - Innovative Internship Programs",
    description:
      "Join our cutting-edge internship programs in Cybersecurity, Full Stack Development, Data Science, and Data Analysis.",
    type: "website",
    locale: "en_US",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <PerformanceProvider>
            <ModalProvider>
              <CustomCursor />
              <Navigation />
              {children}
              <Footer />
              <Toaster />
              <AIAssistantProvider />
            </ModalProvider>
          </PerformanceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
