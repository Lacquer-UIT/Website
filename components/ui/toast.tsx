"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export interface Toast {
  id: string
  type: "success" | "error"
  message: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastComponent({ toast, onRemove }: ToastProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  const Icon = toast.type === "success" ? CheckCircle : AlertCircle
  const iconColor = toast.type === "success" 
    ? (isDark ? "text-green-400" : "text-green-500")
    : (isDark ? "text-red-400" : "text-red-500")

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        "flex items-center space-x-3 p-4 rounded-lg shadow-lg backdrop-blur-md border max-w-md",
        isDark
          ? "bg-gray-900/95 border-white/10"
          : "bg-white/95 border-gray-200/50"
      )}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0", iconColor)} />
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className={cn(
          "p-1 rounded-full hover:bg-white/10 transition-colors",
          isDark ? "text-white/70 hover:text-white" : "text-gray-500 hover:text-gray-700"
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (message: string, duration?: number) => {
    addToast({ type: "success", message, duration })
  }

  const showError = (message: string, duration?: number) => {
    addToast({ type: "error", message, duration })
  }

  return {
    toasts,
    showSuccess,
    showError,
    removeToast,
  }
}
