"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Users, Lock, Calendar, Hash, Volume2, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import type { Deck, DeckCard } from "@/lib/types"

interface DeckDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deck: Deck | null
  onRemoveCard?: (deckId: string, cardId: string) => Promise<{ success: boolean; message: string }>
}

export function DeckDetailDialog({ 
  open, 
  onOpenChange, 
  deck, 
  onRemoveCard
}: DeckDetailDialogProps) {
  const { userId } = useAuth()
  const { toast } = useToast()
  const [removingCardId, setRemovingCardId] = useState<string | null>(null)

  if (!deck) return null

  const isOwner = deck.owner === userId
  const isUniversal = deck.owner === null

  const handleRemoveCard = async (cardId: string) => {
    if (!onRemoveCard || !isOwner) return

    try {
      setRemovingCardId(cardId)
      const result = await onRemoveCard(deck._id, cardId)
      
      if (result.success) {
        toast({
          title: "Card removed",
          description: result.message
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove card from deck."
      })
    } finally {
      setRemovingCardId(null)
    }
  }



  const playPronunciation = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US' 
      utterance.rate = 0.9 
      utterance.pitch = 0.9
      speechSynthesis.cancel() 
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">
                {deck.title}
              </DialogTitle>
              
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  {isUniversal ? (
                    <>
                      <Users className="h-4 w-4" />
                      Universal
                    </>
                  ) : isOwner ? (
                    <>
                      <Lock className="h-4 w-4" />
                      My Deck
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4" />
                      Community
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(deck.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Description */}
              {deck.description && (
                <p className="text-muted-foreground mb-4">{deck.description}</p>
              )}

              {/* Tags */}
              {deck.tags && deck.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {deck.tags.map((tag) => (
                    <Badge key={tag._id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>


          </div>

          {/* Deck Image */}
          {deck.img && (
            <div className="mt-4">
              <img 
                src={deck.img} 
                alt={deck.title}
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
          )}
        </DialogHeader>

        <Separator className="my-4 flex-shrink-0" />
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
  <h3 className="font-semibold mb-4 flex-shrink-0">Vocabulary Cards</h3>
  <ScrollArea className="flex-1 overflow-y-auto pr-4">
    <div className="space-y-3 pb-4">
      {deck.cards.map((card) => (
        <Card key={card._id} className="group hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium text-lg">{card.word}</h4>
                  {card.pronunciation && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                      onClick={() => playPronunciation(card.word)}
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {card.pronunciation && (
                  <p className="text-sm text-muted-foreground mb-2">
                    /{card.pronunciation}/
                  </p>
                )}
                {card.meaning && (
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {card.meaning.type}
                    </Badge>
                    <p className="text-sm">{card.meaning.definition}</p>
                  </div>
                )}
              </div>
              {isOwner && onRemoveCard && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveCard(card._id)}
                  disabled={removingCardId === card._id}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  </ScrollArea>
</div>
       
      </DialogContent>
    </Dialog>
  )
} 