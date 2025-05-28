"use client"

import { Header } from "@/components/header"
import { DictionarySearch } from "@/components/dictionary/search"
import { WordDisplay } from "@/components/dictionary/word-display"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useDictionary } from "@/hooks/use-dictionary"
import { BookOpen, AlertCircle } from "lucide-react"

export default function DictionaryPage() {
  const {
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
  } = useDictionary()

  return (
    <>
      <Header />
      <main
        className={cn(
          "pt-20 min-h-screen p-8",
          "bg-gradient-to-b dark:from-gray-900 dark:to-black dark:text-white light:from-[#f8f4e9] light:to-white light:text-gray-800",
        )}
      >
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-heading font-bold">Dictionary</h1>
            </div>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Explore Vietnamese and English words with detailed definitions, examples, and translations. 
              Switch between languages to find the meaning you're looking for.
            </p>
          </div>

          {/* Search Section */}
          <div className="space-y-6">
            <DictionarySearch
              language={language}
              searchTerm={searchTerm}
              suggestions={suggestions}
              isLoadingSuggestions={isLoadingSuggestions}
              isLoading={isLoading}
              onSearchTermChange={setSearchTerm}
              onSearchWord={searchWord}
              onGetRandomWord={getRandomWord}
              onToggleLanguage={toggleLanguage}
            />

            {/* Error Display */}
            {error && (
              <Alert variant="destructive" className="max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && (
              <Card className="max-w-4xl mx-auto">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-6 w-48" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Word Display */}
            {wordData && !isLoading && (
              <WordDisplay wordData={wordData} language={language} />
            )}

            {/* Empty State */}
            {!wordData && !isLoading && !error && (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8 text-center space-y-4">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Start Your Search</h3>
                    <p className="text-muted-foreground">
                      Enter a word in the search box above to explore its meaning, pronunciation, and usage examples.
                      Or try the "I'm Feeling Lucky" button to discover a random word!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Comprehensive Definitions</h3>
                <p className="text-sm text-muted-foreground">
                  Get detailed word meanings with multiple definitions and usage contexts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">EN/VN</span>
                </div>
                <h3 className="font-semibold">Bilingual Support</h3>
                <p className="text-sm text-muted-foreground">
                  Search in both English and Vietnamese with accurate translations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">🔍</span>
                </div>
                <h3 className="font-semibold">Smart Suggestions</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant word suggestions as you type for faster search.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
