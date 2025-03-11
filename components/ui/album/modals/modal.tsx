"use client"

import type React from "react"

import { useRef, useEffect } from "react"

export function Modal({
                          isOpen,
                          onClose,
                          children,
                      }: {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}) {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Handle click outside to close
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose()
            }
        }

        // Handle escape key to close
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            document.addEventListener("keydown", handleEscKey)
            // Prevent scrolling when modal is open
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscKey)
            // Restore scrolling when modal is closed
            document.body.style.overflow = ""
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                ref={modalRef}
                className="bg-card rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
            >
                {children}
            </div>
        </div>
    )
}

