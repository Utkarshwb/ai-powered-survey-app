"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Search, Command, Plus, Save, Eye, Share, Download, Trash2, Copy, Settings, FileText, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CommandAction {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  shortcut?: string
  category: string
  action: () => void
  keywords?: string[]
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  actions: CommandAction[]
}

export function CommandPalette({ isOpen, onClose, actions }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Filter actions based on search
  const filteredActions = useMemo(() => {
    if (!search.trim()) return actions

    const searchLower = search.toLowerCase()
    return actions.filter(action => 
      action.label.toLowerCase().includes(searchLower) ||
      action.description?.toLowerCase().includes(searchLower) ||
      action.category.toLowerCase().includes(searchLower) ||
      action.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower))
    )
  }, [actions, search])

  // Group actions by category
  const groupedActions = useMemo(() => {
    const groups: Record<string, CommandAction[]> = {}
    filteredActions.forEach(action => {
      if (!groups[action.category]) {
        groups[action.category] = []
      }
      groups[action.category].push(action)
    })
    return groups
  }, [filteredActions])

  // Reset selection when filtered actions change
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredActions])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setSearch('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, filteredActions.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (filteredActions[selectedIndex]) {
            filteredActions[selectedIndex].action()
            onClose()
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredActions, selectedIndex, onClose])

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Command Palette
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={inputRef}
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="max-h-96 overflow-auto border-t" ref={listRef}>
          {Object.keys(groupedActions).length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No commands found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          ) : (
            Object.entries(groupedActions).map(([category, categoryActions]) => (
              <div key={category} className="p-2">
                <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {category}
                </div>
                {categoryActions.map((action, index) => {
                  const globalIndex = filteredActions.indexOf(action)
                  const isSelected = globalIndex === selectedIndex
                  
                  return (
                    <button
                      key={action.id}
                      onClick={() => {
                        action.action()
                        onClose()
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                        isSelected && "bg-blue-100 dark:bg-blue-900/50"
                      )}
                    >
                      <div className="flex-shrink-0 text-gray-500">
                        {action.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {action.label}
                        </div>
                        {action.description && (
                          <div className="text-sm text-gray-500 truncate">
                            {action.description}
                          </div>
                        )}
                      </div>
                      {action.shortcut && (
                        <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800">
                          {action.shortcut}
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="border-t px-4 py-3 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-between">
            <span>Use ↑↓ to navigate • Enter to select • Esc to close</span>
            <span>Ctrl+K to open</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook for managing command palette
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }
}

// Pre-defined action creators for common survey operations
export const createSurveyActions = (handlers: {
  onAddQuestion?: () => void
  onSave?: () => void
  onPreview?: () => void
  onPublish?: () => void
  onDuplicate?: () => void
  onExport?: () => void
  onDelete?: () => void
  onSettings?: () => void
  onAIGenerate?: () => void
  onAnalytics?: () => void
}): CommandAction[] => [
  {
    id: 'add-question',
    label: 'Add Question',
    description: 'Add a new question to your survey',
    icon: <Plus className="h-4 w-4" />,
    shortcut: 'Ctrl+N',
    category: 'Survey',
    action: handlers.onAddQuestion || (() => {}),
    keywords: ['new', 'create', 'question']
  },
  {
    id: 'save-survey',
    label: 'Save Survey',
    description: 'Save your current changes',
    icon: <Save className="h-4 w-4" />,
    shortcut: 'Ctrl+S',
    category: 'Survey',
    action: handlers.onSave || (() => {}),
    keywords: ['save', 'persist']
  },
  {
    id: 'preview-survey',
    label: 'Preview Survey',
    description: 'See how your survey looks to respondents',
    icon: <Eye className="h-4 w-4" />,
    shortcut: 'Ctrl+P',
    category: 'Survey',
    action: handlers.onPreview || (() => {}),
    keywords: ['preview', 'view', 'test']
  },
  {
    id: 'publish-survey',
    label: 'Publish Survey',
    description: 'Make your survey live and shareable',
    icon: <Share className="h-4 w-4" />,
    category: 'Survey',
    action: handlers.onPublish || (() => {}),
    keywords: ['publish', 'share', 'live', 'activate']
  },
  {
    id: 'ai-generate',
    label: 'AI Generate Questions',
    description: 'Use AI to generate questions for your survey',
    icon: <Sparkles className="h-4 w-4" />,
    category: 'AI',
    action: handlers.onAIGenerate || (() => {}),
    keywords: ['ai', 'generate', 'automatic', 'smart']
  },
  {
    id: 'duplicate-survey',
    label: 'Duplicate Survey',
    description: 'Create a copy of this survey',
    icon: <Copy className="h-4 w-4" />,
    category: 'Actions',
    action: handlers.onDuplicate || (() => {}),
    keywords: ['duplicate', 'copy', 'clone']
  },
  {
    id: 'export-survey',
    label: 'Export Survey',
    description: 'Download survey data and responses',
    icon: <Download className="h-4 w-4" />,
    category: 'Actions',
    action: handlers.onExport || (() => {}),
    keywords: ['export', 'download', 'backup']
  },
  {
    id: 'view-analytics',
    label: 'View Analytics',
    description: 'See response data and insights',
    icon: <FileText className="h-4 w-4" />,
    category: 'Analytics',
    action: handlers.onAnalytics || (() => {}),
    keywords: ['analytics', 'data', 'responses', 'insights']
  },
  {
    id: 'survey-settings',
    label: 'Survey Settings',
    description: 'Configure survey options and permissions',
    icon: <Settings className="h-4 w-4" />,
    category: 'Settings',
    action: handlers.onSettings || (() => {}),
    keywords: ['settings', 'config', 'options']
  },
  {
    id: 'delete-survey',
    label: 'Delete Survey',
    description: 'Permanently delete this survey',
    icon: <Trash2 className="h-4 w-4" />,
    category: 'Danger',
    action: handlers.onDelete || (() => {}),
    keywords: ['delete', 'remove', 'destroy']
  }
]
