"use client"

import { motion } from "framer-motion"
import { TagIcon as TagOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export function TagEmpty() {
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
          isDark ? "bg-white/10" : "bg-gray-100",
        )}
      >
        <TagOff className={cn("h-8 w-8", isDark ? "text-white/70" : "text-gray-500")} />
      </div>
      <h3 className="text-xl font-heading font-semibold mb-2">No Tags Found</h3>
      <p className={cn("text-sm", isDark ? "text-white/70" : "text-gray-600")}>
        There are currently no tags available in the system.
      </p>
    </motion.div>
  )
}
