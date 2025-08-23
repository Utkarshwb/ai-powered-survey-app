"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Trash2, Copy, Move, Check, X, CheckSquare } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

interface BulkOperationsProps {
  selectedItems: string[]
  totalItems: number
  onSelectAll: () => void
  onSelectNone: () => void
  onDelete: (ids: string[]) => void
  onDuplicate?: (ids: string[]) => void
  onMove?: (ids: string[], direction: 'up' | 'down') => void
  className?: string
}

export function BulkOperations({
  selectedItems,
  totalItems,
  onSelectAll,
  onSelectNone,
  onDelete,
  onDuplicate,
  onMove,
  className
}: BulkOperationsProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleDelete = () => {
    if (showConfirmDelete) {
      onDelete(selectedItems)
      setShowConfirmDelete(false)
    } else {
      setShowConfirmDelete(true)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirmDelete(false)
  }

  if (selectedItems.length === 0) {
    return null
  }

  return (
    <div className={cn("fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50", className)}>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-96">
        {showConfirmDelete ? (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span className="text-red-800 dark:text-red-200">
                  Delete {selectedItems.length} selected item{selectedItems.length !== 1 ? 's' : ''}?
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={handleDelete}
                    className="h-7"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleCancelDelete}
                    className="h-7"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="font-medium">
                {selectedItems.length} selected
              </Badge>
              
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onSelectAll}
                  className="h-7 text-xs"
                  disabled={selectedItems.length === totalItems}
                >
                  <CheckSquare className="h-3 w-3 mr-1" />
                  All
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onSelectNone}
                  className="h-7 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  None
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onMove && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMove(selectedItems, 'up')}
                    className="h-7"
                    title="Move up"
                  >
                    <Move className="h-3 w-3 rotate-180" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMove(selectedItems, 'down')}
                    className="h-7"
                    title="Move down"
                  >
                    <Move className="h-3 w-3" />
                  </Button>
                </>
              )}
              
              {onDuplicate && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDuplicate(selectedItems)}
                  className="h-7"
                  title="Duplicate"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
              
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                className="h-7"
                title="Delete"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Hook for managing bulk selection
export function useBulkSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedIds(items.map(item => item.id))
  }

  const selectNone = () => {
    setSelectedIds([])
  }

  const isSelected = (id: string) => selectedIds.includes(id)

  const selectedItems = items.filter(item => selectedIds.includes(item.id))

  const deleteSelected = (onDelete: (ids: string[]) => void) => {
    onDelete(selectedIds)
    setSelectedIds([])
  }

  return {
    selectedIds,
    selectedItems,
    toggleSelection,
    selectAll,
    selectNone,
    isSelected,
    deleteSelected,
    hasSelection: selectedIds.length > 0
  }
}

// Selectable wrapper component
interface SelectableItemProps {
  id: string
  isSelected: boolean
  onToggleSelection: (id: string) => void
  children: React.ReactNode
  className?: string
}

export function SelectableItem({ 
  id, 
  isSelected, 
  onToggleSelection, 
  children, 
  className 
}: SelectableItemProps) {
  return (
    <div className={cn("relative group", className)}>
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(id)}
          className="bg-white dark:bg-gray-800 border-2"
        />
      </div>
      <div 
        className={cn(
          "transition-all duration-200",
          isSelected && "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50 dark:bg-blue-950/20"
        )}
      >
        {children}
      </div>
    </div>
  )
}
