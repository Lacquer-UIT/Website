"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchApi } from "@/lib/api-client"
import { useAuth } from "@/contexts/auth-context"
import type { Tag, TagsResponse } from "@/lib/types"
import { API_CONFIG } from "@/config/api-config"

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

    fetchTags()
  }, [isAuthenticated, router])

  return { tags, isLoading, error }
}
