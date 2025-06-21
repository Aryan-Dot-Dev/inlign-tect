"use client"

import type React from "react"
import { useModalManager } from "@/hooks/use-modal-manager"
import CourseModalNew from "@/components/modals/course-modal-new"
import VideoModalNew from "@/components/modals/video-modal-new"

interface ModalProviderProps {
  children: React.ReactNode
}

export default function ModalProvider({ children }: ModalProviderProps) {
  const { modalState, closeModal, isModalOpen } = useModalManager()

  return (
    <>
      {children}

      {/* Course Modal */}
      <CourseModalNew courseId={modalState.data?.courseId} isVisible={isModalOpen("course")} onClose={closeModal} />

      {/* Video Modal */}
      <VideoModalNew isVisible={isModalOpen("video")} onClose={closeModal} />
    </>
  )
}
