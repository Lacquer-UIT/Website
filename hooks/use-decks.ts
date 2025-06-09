"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchApi } from "@/lib/api-client"
import { useAuth } from "@/contexts/auth-context"
import type { Deck, DeckFormData, DecksResponse, DecksByTagResponse } from "@/lib/types"
import { API_CONFIG } from "@/config/api-config"

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/deck")
      return
    }

    fetchDecks()
  }, [isAuthenticated, router])

  // Fetch all decks (user's + universal)
  async function fetchDecks() {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetchApi<DecksResponse>(API_CONFIG.ENDPOINTS.DECKS)

      if (response.success && response.data) {
        setDecks(response.data.data)
      } else {
        setError(response.message || "Failed to fetch decks")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)

      if (errorMessage.includes("Authentication required")) {
        router.push("/login?redirect=/deck")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch universal and other users' decks
  async function fetchUniversalDecks(): Promise<{ success: boolean; message: string; decks?: Deck[] }> {
    try {
      const response = await fetchApi<DecksResponse>(`${API_CONFIG.ENDPOINTS.DECKS}/uni`)

      if (response.success && response.data) {
        return { success: true, message: response.message, decks: response.data.data }
      } else {
        return { success: false, message: response.message || "Failed to fetch universal decks" }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      return { success: false, message: errorMessage }
    }
  }

  // Fetch decks by tag
  async function fetchDecksByTag(tagId: string): Promise<{ success: boolean; message: string; decks?: Deck[] }> {
    try {
      const response = await fetchApi<DecksResponse>(`${API_CONFIG.ENDPOINTS.DECKS}/tag/${tagId}`)

      if (response.success && response.data) {
        return { success: true, message: response.message, decks: response.data.data }
      } else {
        return { success: false, message: response.message || "Failed to fetch decks by tag" }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      return { success: false, message: errorMessage }
    }
  }

  // Fetch all decks grouped by tags
  async function fetchDecksByTags(): Promise<{ success: boolean; message: string; data?: DecksByTagResponse["data"] }> {
    try {
      const response = await fetchApi<DecksByTagResponse>(`${API_CONFIG.ENDPOINTS.DECKS}/tag`)

      if (response.success && response.data) {
        return { success: true, message: response.message, data: response.data.data }
      } else {
        return { success: false, message: response.message || "Failed to fetch decks by tags" }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      return { success: false, message: errorMessage }
    }
  }

  // Fetch decks without tags
  async function fetchDecksWithoutTags(): Promise<{ success: boolean; message: string; decks?: Deck[] }> {
    try {
      const response = await fetchApi<DecksResponse>(`${API_CONFIG.ENDPOINTS.DECKS}/notag`)

      if (response.success && response.data) {
        return { success: true, message: response.message, decks: response.data.data }
      } else {
        return { success: false, message: response.message || "Failed to fetch decks without tags" }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      return { success: false, message: errorMessage }
    }
  }

  // Get deck by ID
  async function getDeckById(deckId: string): Promise<{ success: boolean; message: string; deck?: Deck }> {
    try {
      const response = await fetchApi<Deck>(`${API_CONFIG.ENDPOINTS.DECKS}/${deckId}`)

      if (response.success && response.data) {
        return { success: true, message: response.message, deck: response.data }
      } else {
        return { success: false, message: response.message || "Failed to fetch deck" }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      return { success: false, message: errorMessage }
    }
  }

  // Create a new deck
  async function createDeck(deckData: DeckFormData, imageFile?: File): Promise<{ success: boolean; message: string; deck?: Deck }> {
    try {
      let endpoint = API_CONFIG.ENDPOINTS.DECKS
      let options: RequestInit

      if (imageFile) {
        // Create FormData for file upload
        const formData = new FormData()
        formData.append("title", deckData.title)
        if (deckData.description) formData.append("description", deckData.description)
        if (deckData.tags) {
          deckData.tags.forEach(tag => formData.append("tags", tag))
        }
        if (deckData.cards) {
          deckData.cards.forEach(card => formData.append("cards", card))
        }
        formData.append("image", imageFile)

        options = {
          method: "POST",
          body: formData,
          headers: {
            // Don't set Content-Type for FormData, let browser set it with boundary
          }
        }

        // Remove Content-Type from fetchApi for file uploads
        const token = typeof window !== "undefined" ? localStorage.getItem("lacquer_token") : null
        const headers = new Headers()
        if (token) {
          headers.set("Authorization", `Bearer ${token}`)
        }

        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
          ...options,
          headers
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP error: ${response.status}` }))
          throw new Error(errorData.message || `API error: ${response.status}`)
        }

        const result = await response.json()

        if (result.success && result.data) {
          setDecks(prevDecks => [result.data, ...prevDecks])
          return { success: true, message: result.message || "Deck created successfully", deck: result.data }
        } else {
          return { success: false, message: result.message || "Failed to create deck" }
        }
      } else {
        // Regular JSON request
        const response = await fetchApi<Deck>(endpoint, {
          method: "POST",
          body: JSON.stringify(deckData),
        })

        if (response.success && response.data) {
          setDecks(prevDecks => [response.data, ...prevDecks])
          return { success: true, message: response.message || "Deck created successfully", deck: response.data }
        } else {
          return { success: false, message: response.message || "Failed to create deck" }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      return { success: false, message: errorMessage }
    }
  }

  // Update a deck
  async function updateDeck(deckId: string, deckData: DeckFormData, imageFile?: File): Promise<{ success: boolean; message: string; deck?: Deck }> {
    try {
      let endpoint = `${API_CONFIG.ENDPOINTS.DECKS}/${deckId}`
      let options: RequestInit

      if (imageFile) {
        // Create FormData for file upload
        const formData = new FormData()
        if (deckData.title) formData.append("title", deckData.title)
        if (deckData.description) formData.append("description", deckData.description)
        if (deckData.tags) {
          deckData.tags.forEach(tag => formData.append("tags", tag))
        }
        if (deckData.cards) {
          deckData.cards.forEach(card => formData.append("cards", card))
        }
        formData.append("image", imageFile)

        const token = typeof window !== "undefined" ? localStorage.getItem("lacquer_token") : null
        const headers = new Headers()
        if (token) {
          headers.set("Authorization", `Bearer ${token}`)
        }

        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
          method: "PUT",
          body: formData,
          headers
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP error: ${response.status}` }))
          throw new Error(errorData.message || `API error: ${response.status}`)
        }

        const result = await response.json()

        if (result.success && result.data) {
          setDecks(prevDecks => 
            prevDecks.map(deck => deck._id === deckId ? result.data : deck)
          )
          return { success: true, message: result.message || "Deck updated successfully", deck: result.data }
        } else {
          return { success: false, message: result.message || "Failed to update deck" }
        }
      } else {
        // Regular JSON request
        const response = await fetchApi<Deck>(endpoint, {
          method: "PUT",
          body: JSON.stringify(deckData),
        })

        if (response.success && response.data) {
          setDecks(prevDecks => 
            prevDecks.map(deck => deck._id === deckId ? response.data : deck)
          )
          return { success: true, message: response.message || "Deck updated successfully", deck: response.data }
        } else {
          return { success: false, message: response.message || "Failed to update deck" }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      return { success: false, message: errorMessage }
    }
  }

  // Delete a deck
  async function deleteDeck(deckId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetchApi(`${API_CONFIG.ENDPOINTS.DECKS}/${deckId}`, {
        method: "DELETE",
      })

      if (response.success) {
        setDecks(prevDecks => prevDecks.filter(deck => deck._id !== deckId))
        return { success: true, message: response.message || "Deck deleted successfully" }
      } else {
        return { success: false, message: response.message || "Failed to delete deck" }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      return { success: false, message: errorMessage }
    }
  }

  // Add card to deck
  async function addCardToDeck(deckId: string, cardId: string): Promise<{ success: boolean; message: string; deck?: Deck }> {
    try {
      const response = await fetchApi<Deck>(`${API_CONFIG.ENDPOINTS.DECKS}/${deckId}/cards`, {
        method: "POST",
        body: JSON.stringify({ cardId }),
      })

      if (response.success && response.data) {
        setDecks(prevDecks => 
          prevDecks.map(deck => deck._id === deckId ? response.data : deck)
        )
        return { success: true, message: response.message || "Card added to deck successfully", deck: response.data }
      } else {
        return { success: false, message: response.message || "Failed to add card to deck" }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      return { success: false, message: errorMessage }
    }
  }

  // Remove card from deck
  async function removeCardFromDeck(deckId: string, cardId: string): Promise<{ success: boolean; message: string; deck?: Deck }> {
    try {
      const response = await fetchApi<Deck>(`${API_CONFIG.ENDPOINTS.DECKS}/${deckId}/cards/${cardId}`, {
        method: "DELETE",
      })

      if (response.success && response.data) {
        setDecks(prevDecks => 
          prevDecks.map(deck => deck._id === deckId ? response.data : deck)
        )
        return { success: true, message: response.message || "Card removed from deck successfully", deck: response.data }
      } else {
        return { success: false, message: response.message || "Failed to remove card from deck" }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      return { success: false, message: errorMessage }
    }
  }

  // Toggle deck completion
  async function toggleDeckCompletion(deckId: string): Promise<{ success: boolean; message: string; deck?: Deck }> {
    try {
      const response = await fetchApi<Deck>(`${API_CONFIG.ENDPOINTS.DECKS}/${deckId}/finish`, {
        method: "PUT",
      })

      if (response.success && response.data) {
        setDecks(prevDecks => 
          prevDecks.map(deck => deck._id === deckId ? response.data : deck)
        )
        return { success: true, message: response.message || "Deck status updated successfully", deck: response.data }
      } else {
        return { success: false, message: response.message || "Failed to update deck status" }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      return { success: false, message: errorMessage }
    }
  }

  // Refresh decks manually
  function refreshDecks() {
    fetchDecks()
  }

  return { 
    decks, 
    isLoading, 
    error,
    fetchDecks,
    fetchUniversalDecks,
    fetchDecksByTag,
    fetchDecksByTags,
    fetchDecksWithoutTags,
    getDeckById,
    createDeck,
    updateDeck,
    deleteDeck,
    addCardToDeck,
    removeCardFromDeck,
    toggleDeckCompletion,
    refreshDecks
  }
} 