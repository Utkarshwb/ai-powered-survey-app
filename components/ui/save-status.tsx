import { useState, useEffect } from "react"
import { Check, Loader2, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface SaveStatusProps {
  lastSaved?: Date | null
  isSaving?: boolean
  hasUnsavedChanges?: boolean
  isOnline?: boolean
  className?: string
}

export function SaveStatus({ 
  lastSaved, 
  isSaving = false, 
  hasUnsavedChanges = false,
  isOnline = true,
  className 
}: SaveStatusProps) {
  const getStatusContent = () => {
    if (!isOnline) {
      return {
        icon: <WifiOff className="h-3 w-3" />,
        text: "Offline - changes saved locally",
        color: "text-orange-500"
      }
    }
    
    if (isSaving) {
      return {
        icon: <Loader2 className="h-3 w-3 animate-spin" />,
        text: "Saving...",
        color: "text-blue-500"
      }
    }
    
    if (hasUnsavedChanges) {
      return {
        icon: <AlertCircle className="h-3 w-3" />,
        text: "Unsaved changes",
        color: "text-yellow-500"
      }
    }
    
    if (lastSaved) {
      return {
        icon: <Check className="h-3 w-3" />,
        text: `Saved ${formatDistanceToNow(lastSaved, { addSuffix: true })}`,
        color: "text-green-500"
      }
    }
    
    return {
      icon: <AlertCircle className="h-3 w-3" />,
      text: "Not saved",
      color: "text-gray-500"
    }
  }

  const status = getStatusContent()

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm",
      status.color,
      className
    )}>
      {status.icon}
      <span>{status.text}</span>
      {isOnline && (
        <Wifi className="h-3 w-3 text-green-400" />
      )}
    </div>
  )
}

// Auto-save hook for forms
export function useAutoSave<T>(
  data: T,
  saveFunction: (data: T) => Promise<void>,
  delay: number = 2000
) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  useEffect(() => {
    setHasUnsavedChanges(true)
    
    const timer = setTimeout(async () => {
      if (!data) return
      
      setIsSaving(true)
      try {
        await saveFunction(data)
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
      } catch (error) {
        console.error('Auto-save failed:', error)
      } finally {
        setIsSaving(false)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [data, saveFunction, delay])

  return { lastSaved, isSaving, hasUnsavedChanges }
}
