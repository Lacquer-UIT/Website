"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Pencil, Trash2, AlertCircle, RefreshCw, Eye } from 'lucide-react'
import { useBadges } from '@/hooks/use-badges'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'
import type { Badge as BadgeType, BadgeRequest } from '@/lib/types'

// Form for creating/editing badges
interface BadgeFormProps {
  badge?: BadgeType
  onSubmit: (data: BadgeRequest) => Promise<boolean>
  onCancel: () => void
  isLoading: boolean
}

function BadgeForm({ badge, onSubmit, onCancel, isLoading }: BadgeFormProps) {
  const [formData, setFormData] = useState<BadgeRequest>({
    name: badge?.name || '',
    icon: undefined,
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(badge?.iconUrl || null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }

      // Validate file size (5MB limit)
      const maxSizeInBytes = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSizeInBytes) {
        toast.error('Image must be smaller than 5MB')
        return
      }

      setFormData({ ...formData, icon: file })
      
      // Clean up previous preview URL
      if (previewUrl && !badge) {
        URL.revokeObjectURL(previewUrl)
      }
      
      // Create new preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }

      // Validate file size (5MB limit)
      const maxSizeInBytes = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSizeInBytes) {
        toast.error('Image must be smaller than 5MB')
        return
      }

      setFormData({ ...formData, icon: file })
      
      // Clean up previous preview URL
      if (previewUrl && !badge) {
        URL.revokeObjectURL(previewUrl)
      }
      
      // Create new preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Please enter a badge name')
      return
    }

    if (!badge && !formData.icon) {
      toast.error('Please select an icon for the badge')
      return
    }

    const success = await onSubmit(formData)
    if (success) {
      toast.success(badge ? 'Badge updated successfully' : 'Badge created successfully')
      // Clean up preview URL
      if (previewUrl && !badge) {
        URL.revokeObjectURL(previewUrl)
      }
      onCancel()
    }
  }

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && !badge) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl, badge])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Badge Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter badge name"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Badge Icon</Label>
        <div
          className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Input
            id="icon"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            disabled={isLoading}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {badge ? 'Upload a new icon to replace the current one (optional)' : 'Select an image file for the badge icon'}
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Drag & drop or click to browse • JPEG, PNG, GIF, WebP • Max 5MB
          </p>
        </div>
        
        {previewUrl && (
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-12 h-12 object-cover rounded border"
            />
            <div className="flex-1">
              <span className="text-sm font-medium">Icon preview</span>
              {formData.icon && (
                <p className="text-xs text-muted-foreground">
                  {formData.icon.name} ({(formData.icon.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              {badge ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            badge ? 'Update Badge' : 'Create Badge'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

// Individual badge card component
interface BadgeCardProps {
  badge: BadgeType
  onEdit: (badge: BadgeType) => void
  onDelete: (badgeId: string) => void
  onView: (badge: BadgeType) => void
  canManage: boolean
}

function BadgeCard({ badge, onEdit, onDelete, onView, canManage }: BadgeCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={badge.iconUrl}
              alt={badge.name}
              className="w-12 h-12 object-cover rounded-full border-2 border-muted"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-badge.png'
              }}
            />
            <div>
              <CardTitle className="text-lg">{badge.name}</CardTitle>
              <CardDescription className="text-sm">
                Created {new Date(badge.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            ID: {badge._id.slice(-6)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(badge)}
            className="flex items-center space-x-1"
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </Button>

          {canManage && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(badge)}
                className="flex items-center space-x-1"
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Badge</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{badge.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(badge._id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Badge view modal
interface BadgeViewModalProps {
  badge: BadgeType | null
  isOpen: boolean
  onClose: () => void
}

function BadgeViewModal({ badge, isOpen, onClose }: BadgeViewModalProps) {
  if (!badge) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Badge Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={badge.iconUrl}
              alt={badge.name}
              className="w-24 h-24 object-cover rounded-full border-4 border-primary/20"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-badge.png'
              }}
            />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold">{badge.name}</h3>
            <p className="text-muted-foreground">Badge ID: {badge._id}</p>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Created:</span>
              <span>{new Date(badge.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Updated:</span>
              <span>{new Date(badge.updatedAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Icon URL:</span>
              <a 
                href={badge.iconUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate max-w-32"
              >
                {badge.iconUrl}
              </a>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Main Badge Management Component
export default function BadgeManagement() {
  const { 
    badges, 
    isLoading, 
    error, 
    fetchBadges, 
    createBadge, 
    updateBadge, 
    deleteBadge, 
    clearError 
  } = useBadges()
  
  const { isAuthenticated } = useAuth()
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingBadge, setEditingBadge] = useState<BadgeType | null>(null)
  const [viewingBadge, setViewingBadge] = useState<BadgeType | null>(null)

  const handleCreateBadge = async (data: BadgeRequest) => {
    const success = await createBadge(data)
    if (success) {
      setIsCreateDialogOpen(false)
    }
    return success
  }

  const handleUpdateBadge = async (data: BadgeRequest) => {
    if (!editingBadge) return false
    const success = await updateBadge(editingBadge._id, data)
    if (success) {
      setEditingBadge(null)
    }
    return success
  }

  const handleDeleteBadge = async (badgeId: string) => {
    const success = await deleteBadge(badgeId)
    if (success) {
      toast.success('Badge deleted successfully')
    }
  }

  const handleRefresh = () => {
    clearError()
    fetchBadges()
    toast.success('Badges refreshed')
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Badge Management</h1>
          <p className="text-muted-foreground">
            Manage badges and create new ones
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          {isAuthenticated && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Badge</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Badge</DialogTitle>
                  <DialogDescription>
                    Create a new badge with a name and icon URL.
                  </DialogDescription>
                </DialogHeader>
                <BadgeForm
                  onSubmit={handleCreateBadge}
                  onCancel={() => setIsCreateDialogOpen(false)}
                  isLoading={isLoading}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={clearError}>
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Content */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Badges ({badges.length})</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading && badges.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-16" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : badges.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No badges found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Get started by creating your first badge.
                </p>
                {isAuthenticated && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Badge
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                {badges.map((badge) => (
                  <BadgeCard
                    key={badge._id}
                    badge={badge}
                    onEdit={setEditingBadge}
                    onDelete={handleDeleteBadge}
                    onView={setViewingBadge}
                    canManage={isAuthenticated}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
              {badges
                .slice()
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 10)
                .map((badge) => (
                  <BadgeCard
                    key={badge._id}
                    badge={badge}
                    onEdit={setEditingBadge}
                    onDelete={handleDeleteBadge}
                    onView={setViewingBadge}
                    canManage={isAuthenticated}
                  />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editingBadge} onOpenChange={(open) => !open && setEditingBadge(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Badge</DialogTitle>
            <DialogDescription>
              Update the badge information below.
            </DialogDescription>
          </DialogHeader>
          {editingBadge && (
            <BadgeForm
              badge={editingBadge}
              onSubmit={handleUpdateBadge}
              onCancel={() => setEditingBadge(null)}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <BadgeViewModal
        badge={viewingBadge}
        isOpen={!!viewingBadge}
        onClose={() => setViewingBadge(null)}
      />
    </div>
  )
} 