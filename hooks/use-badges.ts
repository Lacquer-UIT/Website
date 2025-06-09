"use client"

import { useState, useEffect } from 'react'
import { fetchApi } from '@/lib/api-client'
import { API_CONFIG } from '@/config/api-config'
import type { Badge, BadgeRequest, ApiResponse } from '@/lib/types'
import { useAuth } from '@/contexts/auth-context'

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  // Fetch all badges
  const fetchBadges = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetchApi<Badge[]>(API_CONFIG.ENDPOINTS.BADGES)
      if (response.success) {
        setBadges(response.data)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch badges')
    } finally {
      setIsLoading(false)
    }
  }

  // Create a new badge
  const createBadge = async (badgeData: BadgeRequest): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Authentication required')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('name', badgeData.name)
      if (badgeData.icon) {
        formData.append('icon', badgeData.icon)
      }

      const token = localStorage.getItem('lacquer_token')
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BADGES}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || `Create failed with status: ${response.status}`)
      }

      if (responseData.success) {
        setBadges(prev => [...prev, responseData.data])
        return true
      } else {
        setError(responseData.message)
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create badge')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Update a badge
  const updateBadge = async (badgeId: string, badgeData: BadgeRequest): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Authentication required')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('name', badgeData.name)
      if (badgeData.icon) {
        formData.append('icon', badgeData.icon)
      }

      const token = localStorage.getItem('lacquer_token')
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BADGES}/${badgeId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || `Update failed with status: ${response.status}`)
      }

      if (responseData.success) {
        setBadges(prev => 
          prev.map(badge => 
            badge._id === badgeId ? responseData.data : badge
          )
        )
        return true
      } else {
        setError(responseData.message)
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update badge')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a badge
  const deleteBadge = async (badgeId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Authentication required')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchApi(`${API_CONFIG.ENDPOINTS.BADGES}/${badgeId}`, {
        method: 'DELETE',
      })

      if (response.success) {
        setBadges(prev => prev.filter(badge => badge._id !== badgeId))
        return true
      } else {
        setError(response.message)
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete badge')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Get badge by ID
  const getBadgeById = async (badgeId: string): Promise<Badge | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchApi<Badge>(`${API_CONFIG.ENDPOINTS.BADGES}/${badgeId}`)
      
      if (response.success) {
        return response.data
      } else {
        setError(response.message)
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch badge')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Award badge to user
  const awardBadge = async (badgeId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Authentication required')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchApi(`${API_CONFIG.ENDPOINTS.BADGES}/${badgeId}/award`, {
        method: 'POST',
      })

      if (response.success) {
        return true
      } else {
        setError(response.message)
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to award badge')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Load badges on mount
  useEffect(() => {
    fetchBadges()
  }, [])

  return {
    badges,
    isLoading,
    error,
    fetchBadges,
    createBadge,
    updateBadge,
    deleteBadge,
    getBadgeById,
    awardBadge,
    clearError: () => setError(null),
  }
} 