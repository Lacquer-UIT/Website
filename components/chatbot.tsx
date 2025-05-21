"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function Chatbot() {
  const [message, setMessage] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      // In a real app, you would process the message here
      // For now, we'll just redirect to a chat page
      router.push(`/chat?message=${encodeURIComponent(message)}`)
    }
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="relative backdrop-blur-md rounded-2xl p-1">
          <div className="flex items-center">
            <div className="flex-1 h-10 rounded-md" /> {/* Placeholder for input */}
            <div className="ml-2 h-10 w-10 rounded-xl" /> {/* Placeholder for button */}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
    >
      <div
        className={cn(
          "relative backdrop-blur-md rounded-2xl p-1 shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
          isDark ? "bg-white/10 border border-white/20" : "bg-white/60 border border-gray-200/50",
        )}
      >
        <form onSubmit={handleSubmit} className="flex items-center">
          <Input
            type="text"
            placeholder="Ask me anything about Vietnamese culture..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={cn(
              "flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              isDark ? "text-white placeholder:text-white/60" : "text-gray-800 placeholder:text-gray-600/60",
            )}
          />
          <Button
            type="submit"
            size="icon"
            className={cn(
              "rounded-xl ml-2",
              isDark ? "bg-white/20 hover:bg-white/30" : "bg-gray-100/70 hover:bg-gray-200/70",
            )}
          >
            <Send className={isDark ? "h-4 w-4 text-white" : "h-4 w-4 text-gray-800"} />
          </Button>
        </form>
      </div>
    </motion.div>
  )
}
