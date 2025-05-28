"use client"

import { motion } from "framer-motion"
import { Edit, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Tag } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { TagIcon } from "lucide-react"

interface TagCardProps {
  tag: Tag
  index: number
  onEdit?: (tag: Tag) => void
  onDelete?: (tag: Tag) => void
}

export function TagCard({ tag, index, onEdit, onDelete }: TagCardProps) {
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
        "rounded-2xl p-6 backdrop-blur-md shadow-md transition-all duration-300 hover:shadow-lg group",
        isDark
          ? "bg-white/5 border border-white/10 hover:bg-white/10"
          : "bg-white/60 border border-gray-200/50 hover:bg-white/80",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-heading font-semibold capitalize mb-2 truncate">{tag.name}</h3>
          {tag.description && (
            <p className={cn("text-sm mb-4 line-clamp-2", isDark ? "text-white/70" : "text-gray-600")}>
              {tag.description}
            </p>
          )}
          <p className={cn("text-xs", isDark ? "text-white/50" : "text-gray-500")}>
            Created: {formattedDate}
          </p>
        </div>
        
        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-2 opacity-0 group-hover:opacity-100 transition-opacity",
                "hover:bg-white/10 focus:bg-white/10"
              )}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className={cn(
              "w-36",
              isDark 
                ? "bg-gray-900/95 border-white/10" 
                : "bg-white/95 border-gray-200/50"
            )}
          >
            {onEdit && (
              <DropdownMenuItem 
                onClick={() => onEdit(tag)}
                className={cn(
                  "cursor-pointer",
                  isDark ? "hover:bg-white/10 focus:bg-white/10" : "hover:bg-gray-100 focus:bg-gray-100"
                )}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem 
                onClick={() => onDelete(tag)}
                className={cn(
                  "cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600",
                  isDark ? "hover:bg-red-500/10 focus:bg-red-500/10" : "hover:bg-red-50 focus:bg-red-50"
                )}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )
}
