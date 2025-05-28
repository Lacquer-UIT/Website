"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchApi } from "@/lib/api-client"
import { useAuth } from "@/contexts/auth-context"
import type { Tag, TagsResponse } from "@/lib/types"
import { API_CONFIG } from "@/config/api-config"

// Tag form data type for create/edit operations
export interface TagFormData {
  name: string
  description?: string
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push("/login?redirect=/tag")
      return
    }

    fetchTags()
  }, [isAuthenticated, router])

  async function fetchTags() {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetchApi<TagsResponse>(API_CONFIG.ENDPOINTS.TAGS)

      if (response.success && response.data) {
        setTags(response.data.data)
      } else {
        setError(response.message || "Failed to fetch tags")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)

      // If authentication error, redirect to login
      if (errorMessage.includes("Authentication required")) {
        router.push("/login?redirect=/tag")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Create a new tag
  async function createTag(tagData: TagFormData): Promise<{ success: boolean; message: string; tag?: Tag }> {
    try {
      const response = await fetchApi<Tag>(API_CONFIG.ENDPOINTS.TAGS, {
        method: "POST",
        body: JSON.stringify(tagData),
      })

      if (response.success && response.data) {
        // Add the new tag to the local state
        setTags(prevTags => [response.data, ...prevTags])
        return { success: true, message: response.message || "Tag created successfully", tag: response.data }
      } else {
        return { success: false, message: response.message || "Failed to create tag" }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      return { success: false, message: errorMessage }
    }
  }

  // Update an existing tag
  async function updateTag(tagId: string, tagData: TagFormData): Promise<{ success: boolean; message: string; tag?: Tag }> {
    try {
      const response = await fetchApi<Tag>(`${API_CONFIG.ENDPOINTS.TAGS}/${tagId}`, {
        method: "PUT",
        body: JSON.stringify(tagData),
      })

      if (response.success && response.data) {
        // Update the tag in the local state
        setTags(prevTags => 
          prevTags.map(tag => tag._id === tagId ? response.data : tag)
        )
        return { success: true, message: response.message || "Tag updated successfully", tag: response.data }
      } else {
        return { success: false, message: response.message || "Failed to update tag" }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      return { success: false, message: errorMessage }
    }
  }

  // Delete a tag
  async function deleteTag(tagId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetchApi(`${API_CONFIG.ENDPOINTS.TAGS}/${tagId}`, {
        method: "DELETE",
      })

      if (response.success) {
        // Remove the tag from the local state
        setTags(prevTags => prevTags.filter(tag => tag._id !== tagId))
        return { success: true, message: response.message || "Tag deleted successfully" }
      } else {
        return { success: false, message: response.message || "Failed to delete tag" }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      return { success: false, message: errorMessage }
    }
  }

  // Refresh tags manually
  function refreshTags() {
    fetchTags()
  }

  return { 
    tags, 
    isLoading, 
    error,
    createTag,
    updateTag,
    deleteTag,
    refreshTags
  }
}
