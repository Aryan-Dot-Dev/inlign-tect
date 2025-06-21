"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Volume2, VolumeX, Maximize, X, RotateCcw } from "lucide-react"

interface VideoModalProps {
  isVisible: boolean
  onClose: () => void
}

export default function VideoModalNew({ isVisible, onClose }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Demo video URL - using a sample tech demo video
  const videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("ended", handleEnded)
    }
  }, [isVisible])

  useEffect(() => {
    if (isVisible && videoRef.current) {
      // Auto-play when modal opens
      videoRef.current.play()
      setIsPlaying(true)
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [isVisible])

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = percent * duration
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const restartVideo = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    videoRef.current.play()
    setIsPlaying(true)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={onClose}
        style={{ animation: "fadeIn 300ms ease-out" }}
      />

      {/* Modal Content */}
      <div
        ref={containerRef}
        className="relative bg-black border-0 rounded-2xl shadow-2xl max-w-6xl mx-4 w-full overflow-hidden"
        style={{ animation: "slideIn 300ms ease-out" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-black/50 backdrop-blur-sm p-2 text-white hover:bg-black/70 transition-colors"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        {/* Video Container */}
        <div className="relative bg-black">
          <video
            ref={videoRef}
            className="w-full h-auto max-h-[80vh] object-contain"
            src={videoUrl}
            poster="/placeholder.svg?height=600&width=1200&text=Inlighn+Tech+Demo"
            preload="metadata"
          />

          {/* Video Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors group"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white ml-0" />
                ) : (
                  <Play className="h-8 w-8 text-white ml-1" />
                )}
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {/* Progress Bar */}
              <div className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-4 group" onClick={handleSeek}>
                <div
                  className="h-full bg-primary rounded-full transition-all duration-150 group-hover:h-3"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </button>

                  <button onClick={restartVideo} className="text-white hover:text-primary transition-colors">
                    <RotateCcw className="h-5 w-5" />
                  </button>

                  <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </button>

                  <div className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={toggleFullscreen} className="text-white hover:text-primary transition-colors">
                    <Maximize className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {duration === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Loading demo video...</span>
              </div>
            </div>
          )}
        </div>

        {/* Video Information */}
        <div className="p-6 bg-gradient-to-r from-black to-gray-900 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">Inlighn Tech Platform Demo</h3>
              <p className="text-gray-300 text-lg mb-3">
                See how our innovative learning platform transforms tech education through hands-on projects and
                real-world applications.
              </p>
            </div>
            <Badge className="bg-primary text-white px-3 py-1">Demo Video</Badge>
          </div>

          {/* Demo Highlights */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Play className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Interactive Learning</h4>
                <p className="text-sm text-gray-400">Hands-on coding environment</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Play className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold">Real Projects</h4>
                <p className="text-sm text-gray-400">Build portfolio-worthy apps</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Play className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold">Expert Mentorship</h4>
                <p className="text-sm text-gray-400">1-on-1 guidance from pros</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <p className="text-gray-300">Ready to start your tech journey?</p>
                <p className="text-sm text-gray-400">Join thousands of successful graduates</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    onClose()
                    // Scroll to programs section
                    setTimeout(() => {
                      const programsSection = document.querySelector(".programs")
                      programsSection?.scrollIntoView({ behavior: "smooth" })
                    }, 300)
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  View Programs
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    onClose()
                    // Navigate to contact
                    setTimeout(() => {
                      window.location.href = "/contact"
                    }, 300)
                  }}
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
