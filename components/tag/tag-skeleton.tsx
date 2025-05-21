"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export function TagSkeleton() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div
      className={cn(
        "rounded-2xl p-6 backdrop-blur-md shadow-md",
        isDark ? "bg-white/5 border border-white/10" : "bg-white/60 border border-gray-200/50",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={cn("h-6 w-32 rounded mb-2 animate-pulse", isDark ? "bg-white/10" : "bg-gray-200")} />
          <div className={cn("h-4 w-full rounded mb-4 animate-pulse", isDark ? "bg-white/10" : "bg-gray-200")} />
          <div className={cn("h-3 w-24 rounded animate-pulse", isDark ? "bg-white/10" : "bg-gray-200")} />
        </div>
        <div className={cn("h-11 w-11 rounded-full animate-pulse", isDark ? "bg-white/10" : "bg-gray-200")} />
      </div>
    </div>
  )
}
