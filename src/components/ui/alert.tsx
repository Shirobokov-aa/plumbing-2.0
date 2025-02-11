"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AlertProps {
  message: string
  type: "success" | "error"
  duration?: number
}

export function Alert({ message, type, duration = 3000 }: AlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 transition-all",
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      )}
    >
      {message}
    </div>
  )
}