"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import type { Tag } from "@/lib/types"
import type { TagFormData } from "@/hooks/use-tags"

interface TagFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TagFormData) => Promise<{ success: boolean; message: string }>
  initialData?: Tag
  isLoading?: boolean
}

export function TagForm({ isOpen, onClose, onSubmit, initialData, isLoading = false }: TagFormProps) {
  const [formData, setFormData] = useState<TagFormData>({
    name: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const isEdit = !!initialData
  const title = isEdit ? "Edit Tag" : "Create New Tag"
  const submitText = isEdit ? "Update Tag" : "Create Tag"

  // Reset form data when the modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || "",
        description: initialData?.description || "",
      })
    }
  }, [isOpen, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      const result = await onSubmit(formData)
      if (result.success) {
        onClose()
        // Reset form for next use
        setFormData({ name: "", description: "" })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof TagFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleClose = () => {
    onClose()
    // Reset form when closing
    setFormData({ name: "", description: "" })
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
        onClick={handleClose}
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
              isDark ? "bg-white/10" : "bg-gray-100"
            )}>
              {isEdit ? (
                <Edit className={cn("h-5 w-5", isDark ? "text-white/70" : "text-gray-700")} />
              ) : (
                <Plus className={cn("h-5 w-5", isDark ? "text-white/70" : "text-gray-700")} />
              )}
            </div>
            <h2 className="text-xl font-heading font-semibold">{title}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Tag Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter tag name..."
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={cn(
                isDark
                  ? "bg-white/10 border-white/20 focus-visible:ring-lacquer-red/50 text-white placeholder:text-white/60"
                  : "bg-white/60 border-gray-200/50 focus-visible:ring-lacquer-red/30 text-gray-800 placeholder:text-gray-600/60"
              )}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter tag description (optional)..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={cn(
                "min-h-[80px] resize-none",
                isDark
                  ? "bg-white/10 border-white/20 focus-visible:ring-lacquer-red/50 text-white placeholder:text-white/60"
                  : "bg-white/60 border-gray-200/50 focus-visible:ring-lacquer-red/30 text-gray-800 placeholder:text-gray-600/60"
              )}
              disabled={isSubmitting}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-lacquer-red hover:bg-lacquer-red/90"
              disabled={isSubmitting || !formData.name.trim()}
            >
              {isSubmitting ? "Saving..." : submitText}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
} 