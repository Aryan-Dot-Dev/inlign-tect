"use client"

import { useState, useCallback } from "react"

export type ModalType = "course" | "video" | "ai"

interface ModalState {
  isOpen: boolean
  type: ModalType | null
  data?: any
}

export function useModalManager() {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    data: null,
  })

  const openModal = useCallback((type: ModalType, data?: any) => {
    console.log(`Opening modal: ${type}`, data)
    setModalState({
      isOpen: true,
      type,
      data,
    })
  }, [])

  const closeModal = useCallback(() => {
    console.log("Closing modal")
    setModalState({
      isOpen: false,
      type: null,
      data: null,
    })
  }, [])

  const isModalOpen = useCallback(
    (type: ModalType) => {
      return modalState.isOpen && modalState.type === type
    },
    [modalState],
  )

  return {
    modalState,
    openModal,
    closeModal,
    isModalOpen,
  }
}
