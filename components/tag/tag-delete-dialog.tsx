"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import type { Tag } from "@/lib/types"

interface TagDeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<{ success: boolean; message: string }>
  tag: Tag
}

export function TagDeleteDialog({ isOpen, onClose, onConfirm, tag }: TagDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      const result = await onConfirm()
      if (result.success) {
        onClose()
      }
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "relative w-full max-w-md mx-4 rounded-2xl p-6 shadow-xl",
          isDark
            ? "bg-gray-900/95 border border-white/10"
            : "bg-white/95 border border-gray-200/50"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-full",
              isDark ? "bg-red-500/20" : "bg-red-100"
            )}>
              <AlertTriangle className={cn("h-5 w-5", isDark ? "text-red-400" : "text-red-500")} />
            </div>
            <h2 className="text-xl font-heading font-semibold">Delete Tag</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
            disabled={isDeleting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className={cn("text-sm mb-4", isDark ? "text-white/70" : "text-gray-600")}>
            Are you sure you want to delete the tag "{tag.name}"? This action cannot be undone.
          </p>
          {tag.description && (
            <div className={cn(
              "p-3 rounded-lg",
              isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"
            )}>
              <p className={cn("text-xs font-medium mb-1", isDark ? "text-white/50" : "text-gray-500")}>
                Description:
              </p>
              <p className={cn("text-sm", isDark ? "text-white/70" : "text-gray-600")}>
                {tag.description}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            className="flex-1"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Tag"}
          </Button>
        </div>
      </motion.div>
    </div>
  )
} 