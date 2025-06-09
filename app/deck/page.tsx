"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { DeckCard } from "@/components/deck-card"
import { DeckFormDialog } from "@/components/deck-form-dialog"
import { DeckDetailDialog } from "@/components/deck-detail-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useDecks } from "@/hooks/use-decks"
import { useTags } from "@/hooks/use-tags"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Plus, Search, Filter, Loader2 } from "lucide-react"
import type { Deck, DeckFormData } from "@/lib/types"

export default function DeckPage() {
  const {
    decks,
    isLoading,
    error,
    fetchUniversalDecks,
    fetchDecksByTag,
    fetchDecksByTags,
    fetchDecksWithoutTags,
    createDeck,
    updateDeck,
    deleteDeck,
    removeCardFromDeck,
    refreshDecks
  } = useDecks()

  const { tags } = useTags()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [deckFormOpen, setDeckFormOpen] = useState(false)
  const [editingDeck, setEditingDeck] = useState<Deck | undefined>()
  const [detailDeck, setDetailDeck] = useState<Deck | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("my-decks")
  const [universalDecks, setUniversalDecks] = useState<Deck[]>([])
  const [taggedDecks, setTaggedDecks] = useState<Array<{ tag: any; decks: Deck[] }>>([])
  const [isLoadingUniversal, setIsLoadingUniversal] = useState(false)
  const [isLoadingTagged, setIsLoadingTagged] = useState(false)

  // Filter decks based on search and tag
  const filteredDecks = decks.filter(deck => {
    const matchesSearch = deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deck.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (selectedTag === "all") return matchesSearch
    if (selectedTag === "no-tags") return matchesSearch && deck.tags.length === 0
    
    return matchesSearch && deck.tags.some(tag => tag._id === selectedTag)
  })

  // Load universal decks when tab changes
  useEffect(() => {
    if (activeTab === "universal") {
      loadUniversalDecks()
    } else if (activeTab === "by-tags") {
      loadTaggedDecks()
    }
  }, [activeTab])

  const loadUniversalDecks = async () => {
    setIsLoadingUniversal(true)
    try {
      const result = await fetchUniversalDecks()
      if (result.success && result.decks) {
        setUniversalDecks(result.decks)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load universal decks."
      })
    } finally {
      setIsLoadingUniversal(false)
    }
  }

  const loadTaggedDecks = async () => {
    setIsLoadingTagged(true)
    try {
      const result = await fetchDecksByTags()
      if (result.success && result.data) {
        setTaggedDecks(result.data)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load decks by tags."
      })
    } finally {
      setIsLoadingTagged(false)
    }
  }

  const handleCreateDeck = async (data: DeckFormData, imageFile?: File) => {
    return await createDeck(data, imageFile)
  }

  const handleUpdateDeck = async (data: DeckFormData, imageFile?: File) => {
    if (!editingDeck) return { success: false, message: "No deck selected" }
    return await updateDeck(editingDeck._id, data, imageFile)
  }

  const handleDeleteDeck = async (deckId: string) => {
    const result = await deleteDeck(deckId)
    if (result.success) {
      toast({
        title: "Deck deleted",
        description: result.message
      })
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message
      })
    }
    return result
  }



  const handleViewDeck = (deck: Deck) => {
    setDetailDeck(deck)
    setDetailDialogOpen(true)
  }

  const handleEditDeck = (deck: Deck) => {
    setEditingDeck(deck)
    setDeckFormOpen(true)
  }

  const handleRemoveCard = async (deckId: string, cardId: string) => {
    return await removeCardFromDeck(deckId, cardId)
  }

  const handleFormClose = () => {
    setDeckFormOpen(false)
    setEditingDeck(undefined)
  }

  if (error) {
    return (
      <>
        <Header />
        <main className={cn(
          "pt-20 min-h-screen p-8",
          "bg-gradient-to-b dark:from-gray-900 dark:to-black dark:text-white light:from-[#f8f4e9] light:to-white light:text-gray-800",
        )}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Error loading decks</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={refreshDecks}>Try Again</Button>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className={cn(
        "pt-20 min-h-screen p-8",
        "bg-gradient-to-b dark:from-gray-900 dark:to-black dark:text-white light:from-[#f8f4e9] light:to-white light:text-gray-800",
      )}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-heading font-bold mb-2">My Decks</h1>
              <p className="text-lg opacity-80">
                Create and manage your Vietnamese vocabulary decks
              </p>
            </div>
            <Button onClick={() => setDeckFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Deck
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="my-decks">My Decks</TabsTrigger>
              <TabsTrigger value="universal">Universal Decks</TabsTrigger>
              <TabsTrigger value="by-tags">By Tags</TabsTrigger>
            </TabsList>

            {/* My Decks Tab */}
            <TabsContent value="my-decks" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search decks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All tags</SelectItem>
                    <SelectItem value="no-tags">No tags</SelectItem>
                    {tags.map((tag) => (
                      <SelectItem key={tag._id} value={tag._id}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Deck Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredDecks.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No decks found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || selectedTag !== "all" 
                      ? "Try adjusting your search or filters."
                      : "Create your first deck to get started!"
                    }
                  </p>
                  {!searchQuery && selectedTag === "all" && (
                    <Button onClick={() => setDeckFormOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Deck
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDecks.map((deck) => (
                    <DeckCard
                      key={deck._id}
                      deck={deck}
                      onEdit={handleEditDeck}
                      onDelete={handleDeleteDeck}
                      onView={handleViewDeck}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Universal Decks Tab */}
            <TabsContent value="universal" className="space-y-6">
              {isLoadingUniversal ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : universalDecks.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No universal decks available</h3>
                  <p className="text-muted-foreground">
                    Check back later for community-shared decks!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {universalDecks.map((deck) => (
                    <DeckCard
                      key={deck._id}
                      deck={deck}
                      onView={handleViewDeck}
                      showOwnership={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* By Tags Tab */}
            <TabsContent value="by-tags" className="space-y-6">
              {isLoadingTagged ? (
                <div className="space-y-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-6 w-32" />
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="space-y-3">
                            <Skeleton className="h-48 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : taggedDecks.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No tagged decks found</h3>
                  <p className="text-muted-foreground">
                    Create decks with tags to see them organized here!
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {taggedDecks.map((group) => (
                    <div key={group.tag._id}>
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                          {group.tag.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {group.decks.length} {group.decks.length === 1 ? "deck" : "decks"}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {group.decks.map((deck) => (
                          <DeckCard
                            key={deck._id}
                            deck={deck}
                            onEdit={handleEditDeck}
                            onDelete={handleDeleteDeck}
                            onView={handleViewDeck}
                            showOwnership={false}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Dialogs */}
      <DeckFormDialog
        open={deckFormOpen}
        onOpenChange={handleFormClose}
        deck={editingDeck}
        onSubmit={editingDeck ? handleUpdateDeck : handleCreateDeck}
      />

      <DeckDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        deck={detailDeck}
        onRemoveCard={handleRemoveCard}
      />
    </>
  )
}
