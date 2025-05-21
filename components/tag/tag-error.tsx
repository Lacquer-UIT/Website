"use client"

import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface TagErrorProps {
  message: string
  onRetry: () => void
}

export function TagError({ message, onRetry }: TagErrorProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-2xl p-8 backdrop-blur-md shadow-md text-center max-w-md mx-auto",
        isDark ? "bg-white/5 border border-white/10" : "bg-white/60 border border-gray-200/50",
      )}
    >
      <div
        className={cn(
          "mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4",
          isDark ? "bg-red-500/20" : "bg-red-100",
        )}
      >
        <AlertTriangle className={cn("h-8 w-8", isDark ? "text-red-400" : "text-red-500")} />
      </div>
      <h3 className="text-xl font-heading font-semibold mb-2">Error Loading Tags</h3>
      <p className={cn("text-sm mb-6", isDark ? "text-white/70" : "text-gray-600")}>{message}</p>
      <Button onClick={onRetry} className="bg-lacquer-red hover:bg-lacquer-red/90">
        Try Again
      </Button>
    </motion.div>
  )
}
