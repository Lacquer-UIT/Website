"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { TagCard } from "@/components/tag/tag-card"
import { TagSkeleton } from "@/components/tag/tag-skeleton"
import { TagError } from "@/components/tag/tag-error"
import { TagEmpty } from "@/components/tag/tag-empty"
import { TagForm } from "@/components/tag/tag-form"
import { TagDeleteDialog } from "@/components/tag/tag-delete-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToastContainer, useToast } from "@/components/ui/toast"
import { useTags } from "@/hooks/use-tags"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Search, Plus } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import type { Tag } from "@/lib/types"

export default function TagPage() {
  const { tags, isLoading, error, createTag, updateTag, deleteTag, refreshTags } = useTags()
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const { theme } = useTheme()
  const { toasts, showSuccess, showError, removeToast } = useToast()
  const isDark = theme === "dark"

  // Filter tags based on search query
  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tag.description && tag.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Function to retry fetching tags
  const handleRetry = () => {
    refreshTags()
  }

  // Handle create new tag
  const handleCreateTag = () => {
    setSelectedTag(null)
    setIsFormOpen(true)
  }

  // Handle edit tag
  const handleEditTag = (tag: Tag) => {
    setSelectedTag(tag)
    setIsFormOpen(true)
  }

  // Handle delete tag
  const handleDeleteTag = (tag: Tag) => {
    setSelectedTag(tag)
    setIsDeleteDialogOpen(true)
  }

  // Handle form submission
  const handleFormSubmit = async (formData: { name: string; description?: string }) => {
    try {
      let result
      if (selectedTag) {
        // Update existing tag
        result = await updateTag(selectedTag._id, formData)
      } else {
        // Create new tag
        result = await createTag(formData)
      }

      if (result.success) {
        showSuccess(result.message)
        setIsFormOpen(false)
        setSelectedTag(null)
      } else {
        showError(result.message)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      showError(errorMessage)
      return { success: false, message: errorMessage }
    }
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedTag) return { success: false, message: "No tag selected" }

    try {
      const result = await deleteTag(selectedTag._id)
      
      if (result.success) {
        showSuccess(result.message)
        setIsDeleteDialogOpen(false)
        setSelectedTag(null)
      } else {
        showError(result.message)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      showError(errorMessage)
      return { success: false, message: errorMessage }
    }
  }

  // Close modals
  const closeForm = () => {
    setIsFormOpen(false)
    setSelectedTag(null)
  }

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedTag(null)
  }

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(6)
      .fill(0)
      .map((_, index) => <TagSkeleton key={index} />)
  }

  const renderContent = () => (
    <>
      <Header />
      <main
        className={cn(
          "pt-20 min-h-screen p-4 md:p-8",
          "bg-gradient-to-b dark:from-gray-900 dark:to-black dark:text-white light:from-[#f8f4e9] light:to-white light:text-gray-800",
        )}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-heading font-bold mb-2">Tags</h1>
                <p className={cn("text-lg", isDark ? "text-white/70" : "text-gray-600")}>
                  Browse and manage Vietnamese cultural content tags
                </p>
              </div>
              <Button
                onClick={handleCreateTag}
                className="bg-lacquer-red hover:bg-lacquer-red/90 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Tag</span>
              </Button>
            </div>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 relative max-w-md"
          >
            <Input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-10",
                isDark
                  ? "bg-white/10 border-white/20 focus-visible:ring-lacquer-red/50 text-white placeholder:text-white/60"
                  : "bg-white/60 border-gray-200/50 focus-visible:ring-lacquer-red/30 text-gray-800 placeholder:text-gray-600/60",
              )}
            />
            <Search
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
                isDark ? "text-white/60" : "text-gray-500",
              )}
            />
          </motion.div>

          {/* Content area */}
          <div className="space-y-6">
            {isLoading ? (
              // Loading state
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{renderSkeletons()}</div>
            ) : error ? (
              // Error state
              <TagError message={error} onRetry={handleRetry} />
            ) : filteredTags.length === 0 && searchQuery === "" ? (
              // Empty state
              <TagEmpty />
            ) : filteredTags.length === 0 ? (
              // No search results
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <p className={cn("text-lg font-medium", isDark ? "text-white/70" : "text-gray-600")}>
                  No tags found matching "{searchQuery}"
                </p>
              </motion.div>
            ) : (
              // Tags grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTags.map((tag, index) => (
                  <TagCard 
                    key={tag._id} 
                    tag={tag} 
                    index={index}
                    onEdit={handleEditTag}
                    onDelete={handleDeleteTag}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <TagForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        initialData={selectedTag || undefined}
      />

      {selectedTag && (
        <TagDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDeleteConfirm}
          tag={selectedTag}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )

  return <ProtectedRoute>{renderContent()}</ProtectedRoute>
}
