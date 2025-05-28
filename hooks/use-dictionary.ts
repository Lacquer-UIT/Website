import { useState, useEffect, useCallback } from "react"
import { fetchApi } from "@/lib/api-client"
import { API_CONFIG } from "@/config/api-config"
import type { 
  ApiResponse, 
  EnglishWordResponse, 
  VietnameseWordResponse, 
  SearchSuggestionsResponse 
} from "@/lib/types"

export type Language = "en" | "vn"
export type WordData = EnglishWordResponse | VietnameseWordResponse

export function useDictionary() {
  const [language, setLanguage] = useState<Language>("en")
  const [searchTerm, setSearchTerm] = useState("")
  const [wordData, setWordData] = useState<WordData | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounced search for suggestions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoadingSuggestions(true)
      try {
        const endpoint = language === "en" 
          ? API_CONFIG.ENDPOINTS.DICTIONARY_SEARCH_EN 
          : API_CONFIG.ENDPOINTS.DICTIONARY_SEARCH_VN
        
        const url = `${endpoint}?prefix=${encodeURIComponent(searchTerm)}`
        console.log('Fetching suggestions from:', `${API_CONFIG.BASE_URL}${url}`)
        console.log('Search term:', searchTerm, 'Language:', language)
        
        const response = await fetchApi<string[]>(url)
        console.log('Suggestions response:', response)
        setSuggestions(response.data)
      } catch (err) {
        console.error("Failed to fetch suggestions:", err)
        setSuggestions([])
      } finally {
        setIsLoadingSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, language])

  const searchWord = useCallback(async (word: string) => {
    if (!word.trim()) return

    setIsLoading(true)
    setError(null)
    setWordData(null)

    try {
      const endpoint = language === "en" 
        ? API_CONFIG.ENDPOINTS.DICTIONARY_SEARCH_EN 
        : API_CONFIG.ENDPOINTS.DICTIONARY_SEARCH_VN
      
      const url = `${endpoint}?word=${encodeURIComponent(word)}`
      console.log('Searching word at:', `${API_CONFIG.BASE_URL}${url}`)
      
      const response = await fetchApi<WordData>(url)
      console.log('Word search response:', response)
      setWordData(response.data)
    } catch (err) {
      console.error("Word search error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to search word"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [language])

  const getRandomWord = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setWordData(null)
    setSearchTerm("")

    try {
      // Use the correct API base URL for random words
      const baseUrl = "https://lacquer-server.onrender.com"
      const endpoint = language === "en" 
        ? "/random/en"
        : "/random/vn"
      
      const url = `${baseUrl}${endpoint}`
      console.log('Fetching random word from:', url)
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Random word response:', data)
      console.log('Random word data[0]:', JSON.stringify(data.data[0], null, 2))
      
      if (data.success && data.data && data.data.length > 0) {
        const randomWord = data.data[0]
        
        // Additional validation to ensure the word has the expected structure
        if (language === "en" && !('wordTypes' in randomWord)) {
          throw new Error("Invalid English word structure from API")
        }
        if (language === "vn" && !('meanings' in randomWord)) {
          throw new Error("Invalid Vietnamese word structure from API")
        }
        
        console.log('Setting word data:', randomWord)
        setWordData(randomWord)
        setSearchTerm(randomWord.word)
      } else {
        throw new Error("No random word found")
      }
    } catch (err) {
      console.error("Random word error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to get random word"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [language])

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === "en" ? "vn" : "en")
    setSearchTerm("")
    setWordData(null)
    setSuggestions([])
    setError(null)
  }, [])

  return {
    language,
    searchTerm,
    setSearchTerm,
    wordData,
    suggestions,
    isLoading,
    isLoadingSuggestions,
    error,
    searchWord,
    getRandomWord,
    toggleLanguage,
  }
} 