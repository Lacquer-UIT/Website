"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useTags } from "@/hooks/use-tags"
import { Upload, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Deck, DeckFormData } from "@/lib/types"

interface DeckFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deck?: Deck
  onSubmit: (data: DeckFormData, imageFile?: File) => Promise<{ success: boolean; message: string }>
}

export function DeckFormDialog({ open, onOpenChange, deck, onSubmit }: DeckFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState<DeckFormData>({
    title: "",
    description: "",
    img: "",
    tags: [],
    cards: []
  })

  const { tags } = useTags()
  const { toast } = useToast()

  const isEditing = !!deck

  // Reset form when dialog opens/closes or deck changes
  useEffect(() => {
    if (open) {
      if (deck) {
        setFormData({
          title: deck.title,
          description: deck.description || "",
          img: deck.img || "",
          tags: deck.tags.map(tag => tag._id),
          cards: deck.cards.map(card => card._id)
        })
        setImagePreview(deck.img || null)
      } else {
        setFormData({
          title: "",
          description: "",
          img: "",
          tags: [],
          cards: []
        })
        setImagePreview(null)
      }
      setImageFile(null)
    }
  }, [open, deck])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 5MB."
        })
        return
      }

      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file."
        })
        return
      }

      setImageFile(file)
      
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData(prev => ({ ...prev, img: "" }))
  }

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.includes(tagId) 
        ? prev.tags.filter(id => id !== tagId)
        : [...(prev.tags || []), tagId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Title required",
        description: "Please enter a deck title."
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      const result = await onSubmit(formData, imageFile || undefined)
      
      if (result.success) {
        toast({
          title: isEditing ? "Deck updated" : "Deck created",
          description: result.message
        })
        onOpenChange(false)
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
        description: "An unexpected error occurred."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Deck" : "Create New Deck"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update your deck information and settings."
              : "Create a new deck to organize your Vietnamese vocabulary cards."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter deck title..."
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your deck..."
              rows={3}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Deck Image</Label>
            
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Deck preview" 
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <Label htmlFor="image-upload" className="cursor-pointer text-sm font-medium">
                      Click to upload an image
                    </Label>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  </div>
                </div>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="space-y-3">
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const isSelected = formData.tags?.includes(tag._id)
                    return (
                      <Badge
                        key={tag._id}
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isSelected && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => handleTagToggle(tag._id)}
                      >
                        {tag.name}
                      </Badge>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No tags available. Create tags first to organize your decks.
                </p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isSubmitting 
                ? (isEditing ? "Updating..." : "Creating...") 
                : (isEditing ? "Update Deck" : "Create Deck")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 