"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Globe, Shuffle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Language } from "@/hooks/use-dictionary"

interface DictionarySearchProps {
  language: Language
  searchTerm: string
  suggestions: string[]
  isLoadingSuggestions: boolean
  isLoading: boolean
  onSearchTermChange: (term: string) => void
  onSearchWord: (word: string) => void
  onGetRandomWord: () => void
  onToggleLanguage: () => void
}

export function DictionarySearch({
  language,
  searchTerm,
  suggestions,
  isLoadingSuggestions,
  isLoading,
  onSearchTermChange,
  onSearchWord,
  onGetRandomWord,
  onToggleLanguage,
}: DictionarySearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setShowSuggestions(suggestions.length > 0 && searchTerm.trim().length > 0)
    setSelectedIndex(-1)
  }, [suggestions, searchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onSearchTermChange(value)
  }

  const handleSearch = (word?: string) => {
    const searchWord = word || searchTerm
    if (searchWord.trim()) {
      onSearchWord(searchWord.trim())
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onSearchTermChange(suggestion)
    handleSearch(suggestion)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) {
      if (e.key === "Enter") {
        handleSearch()
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else {
          handleSearch()
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(e.target as Node) &&
      !inputRef.current?.contains(e.target as Node)
    ) {
      setShowSuggestions(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleLanguage}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          {language === "en" ? "English" : "Tiếng Việt"}
        </Button>
        <Badge variant="secondary" className="flex items-center">
          {language === "en" ? "EN → VN" : "VN → EN"}
        </Badge>
      </div>

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={
              language === "en"
                ? "Search for an English word..."
                : "Tìm kiếm từ tiếng Việt..."
            }
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-4 py-3 text-lg"
            autoComplete="off"
          />
        </div>

        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {isLoadingSuggestions ? (
              <div className="p-3 text-center text-muted-foreground">
                Loading suggestions...
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  className={cn(
                    "w-full px-3 py-2 text-left hover:bg-muted transition-colors",
                    selectedIndex === index && "bg-muted"
                  )}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2 justify-center">
        <Button
          onClick={() => handleSearch()}
          disabled={!searchTerm.trim()}
          className="px-8"
        >
          Search
        </Button>
        <Button
          variant="outline"
          onClick={onGetRandomWord}
          disabled={isLoading}
          className="px-6 flex items-center gap-2"
        >
          <Shuffle className="h-4 w-4" />
          I'm Feeling Lucky
        </Button>
      </div>
    </div>
  )
} 