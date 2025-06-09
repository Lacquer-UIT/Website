"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { MoreVertical, Edit, Trash2, Users, Lock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import type { Deck } from "@/lib/types"

interface DeckCardProps {
  deck: Deck
  onEdit?: (deck: Deck) => void
  onDelete?: (deckId: string) => void
  onView?: (deck: Deck) => void
  showOwnership?: boolean
}

export function DeckCard({ 
  deck, 
  onEdit, 
  onDelete, 
  onView,
  showOwnership = true 
}: DeckCardProps) {
  const { userId } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = deck.owner === userId
  const isUniversal = deck.owner === null

  const handleDelete = async () => {
    if (!onDelete) return
    
    try {
      setIsDeleting(true)
      await onDelete(deck._id)
    } finally {
      setIsDeleting(false)
    }
  }



  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg">
      {/* Deck Image */}
      {deck.img && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={deck.img} 
            alt={deck.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight">
              {deck.title}
            </h3>
            {deck.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {deck.description}
              </p>
            )}
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwner && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(deck)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              
              {isOwner && onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Deck</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{deck.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Ownership indicator */}
        {showOwnership && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {isUniversal ? (
              <>
                <Users className="h-3 w-3" />
                Universal
              </>
            ) : isOwner ? (
              <>
                <Lock className="h-3 w-3" />
                My Deck
              </>
            ) : (
              <>
                <Users className="h-3 w-3" />
                Community
              </>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        {/* Tags */}
        {deck.tags && deck.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {deck.tags.map((tag) => (
              <Badge key={tag._id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Cards count */}
        <div className="text-sm text-muted-foreground">
          {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          onClick={() => onView?.(deck)}
          className="w-full"
        >
          View Deck
        </Button>
      </CardFooter>
    </Card>
  )
} 