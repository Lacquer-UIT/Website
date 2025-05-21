"use client"

import { motion } from "framer-motion"
import type { Tag } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { TagIcon } from "lucide-react"

interface TagCardProps {
  tag: Tag
  index: number
}

export function TagCard({ tag, index }: TagCardProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Format the date to be more readable
  const formattedDate = new Date(tag.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "rounded-2xl p-6 backdrop-blur-md shadow-md transition-all duration-300 hover:shadow-lg",
        isDark
          ? "bg-white/5 border border-white/10 hover:bg-white/10"
          : "bg-white/60 border border-gray-200/50 hover:bg-white/80",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-heading font-semibold capitalize mb-2">{tag.name}</h3>
          {tag.description && (
            <p className={cn("text-sm mb-4", isDark ? "text-white/70" : "text-gray-600")}>{tag.description}</p>
          )}
          <p className={cn("text-xs", isDark ? "text-white/50" : "text-gray-500")}>Created: {formattedDate}</p>
        </div>
        <div className={cn("p-3 rounded-full", isDark ? "bg-white/10" : "bg-gray-100/80")}>
          <TagIcon className={cn("h-5 w-5", isDark ? "text-white/70" : "text-gray-700")} />
        </div>
      </div>
    </motion.div>
  )
}
