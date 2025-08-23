"use client"

import React, { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DragDropItem {
  id: string
  content: React.ReactNode
}

interface DragDropListProps {
  items: DragDropItem[]
  onReorder: (items: DragDropItem[]) => void
  className?: string
  itemClassName?: string
  dragHandleClassName?: string
  showArrows?: boolean
}

export function DragDropList({ 
  items, 
  onReorder, 
  className, 
  itemClassName,
  dragHandleClassName,
  showArrows = false
}: DragDropListProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragCounter = useRef(0)

  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', itemId)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null)
    setDragOverIndex(null)
    dragCounter.current = 0
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    dragCounter.current++
    setDragOverIndex(index)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    dragCounter.current--
    if (dragCounter.current === 0) {
      setDragOverIndex(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (!draggedItem) return

    const dragIndex = items.findIndex(item => item.id === draggedItem)
    if (dragIndex === -1 || dragIndex === dropIndex) return

    const newItems = [...items]
    const draggedItemData = newItems[dragIndex]
    
    // Remove the dragged item
    newItems.splice(dragIndex, 1)
    
    // Insert at new position
    const actualDropIndex = dragIndex < dropIndex ? dropIndex - 1 : dropIndex
    newItems.splice(actualDropIndex, 0, draggedItemData)
    
    onReorder(newItems)
    setDraggedItem(null)
    setDragOverIndex(null)
    dragCounter.current = 0
  }, [items, draggedItem, onReorder])

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= items.length) return
    
    const newItems = [...items]
    const item = newItems[fromIndex]
    newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, item)
    onReorder(newItems)
  }, [items, onReorder])

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "relative group transition-all duration-200",
            draggedItem === item.id && "opacity-50 scale-95",
            dragOverIndex === index && "transform translate-y-1",
            itemClassName
          )}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
        >
          {/* Drop indicator */}
          {dragOverIndex === index && draggedItem && (
            <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10" />
          )}
          
          <div className="flex items-center gap-2">
            {/* Drag handle */}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragEnd={handleDragEnd}
              className={cn(
                "cursor-grab active:cursor-grabbing p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100",
                dragHandleClassName
              )}
              title="Drag to reorder"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>

            {/* Item content */}
            <div className="flex-1">
              {item.content}
            </div>

            {/* Arrow controls */}
            {showArrows && (
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveItem(index, index - 1)}
                  disabled={index === 0}
                  className="h-6 w-6 p-0"
                  title="Move up"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveItem(index, index + 1)}
                  disabled={index === items.length - 1}
                  className="h-6 w-6 p-0"
                  title="Move down"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Hook for managing drag and drop state
export function useDragDrop<T extends { id: string }>(initialItems: T[]) {
  const [items, setItems] = useState(initialItems)

  const reorderItems = useCallback((newItems: T[]) => {
    setItems(newItems)
  }, [])

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= items.length) return
    
    const newItems = [...items]
    const item = newItems[fromIndex]
    newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, item)
    setItems(newItems)
  }, [items])

  const addItem = useCallback((item: T, index?: number) => {
    const newItems = [...items]
    if (index !== undefined) {
      newItems.splice(index, 0, item)
    } else {
      newItems.push(item)
    }
    setItems(newItems)
  }, [items])

  const removeItem = useCallback((id: string) => {
    setItems(items => items.filter(item => item.id !== id))
  }, [])

  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    setItems(items => items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }, [])

  return {
    items,
    setItems,
    reorderItems,
    moveItem,
    addItem,
    removeItem,
    updateItem
  }
}

// Utility for creating draggable items
export function createDragDropItem(id: string, content: React.ReactNode): DragDropItem {
  return { id, content }
}
