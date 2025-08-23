"use client"

import { useEffect, useState } from "react"

interface TouchGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 75
}: TouchGestureOptions) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.targetTouches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
    setTouchEnd(null)
  }

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.targetTouches[0]
    setTouchEnd({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const deltaX = touchStart.x - touchEnd.x
    const deltaY = touchStart.y - touchEnd.y
    
    // Determine if it's a horizontal or vertical swipe
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY)
    
    if (isHorizontal) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          onSwipeLeft?.()
        } else {
          onSwipeRight?.()
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          onSwipeUp?.()
        } else {
          onSwipeDown?.()
        }
      }
    }
    
    setTouchStart(null)
    setTouchEnd(null)
  }

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }
}

// Hook for keyboard shortcuts
interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  callback: () => void
  description?: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        const isCtrlOrMeta = shortcut.ctrlKey || shortcut.metaKey
        const ctrlMetaMatch = isCtrlOrMeta ? (e.ctrlKey || e.metaKey) : true
        const shiftMatch = shortcut.shiftKey ? e.shiftKey : !e.shiftKey
        const altMatch = shortcut.altKey ? e.altKey : !e.altKey
        
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMetaMatch &&
          shiftMatch &&
          altMatch
        ) {
          e.preventDefault()
          shortcut.callback()
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

// Hook for mobile detection
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}
