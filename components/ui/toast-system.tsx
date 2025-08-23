"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { X, Check, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Toast {
  id: string
  title?: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 5000)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (message: string, title?: string) => {
    addToast({ type: 'success', message, title })
  }

  const error = (message: string, title?: string) => {
    addToast({ type: 'error', message, title, duration: 7000 })
  }

  const warning = (message: string, title?: string) => {
    addToast({ type: 'warning', message, title })
  }

  const info = (message: string, title?: string) => {
    addToast({ type: 'info', message, title })
  }

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      success,
      error,
      warning,
      info
    }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map(toast => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

function ToastComponent({ 
  toast, 
  onRemove 
}: { 
  toast: Toast
  onRemove: () => void 
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleRemove = () => {
    setIsLeaving(true)
    setTimeout(onRemove, 300) // Match animation duration
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check className="h-5 w-5" />
      case 'error':
        return <AlertCircle className="h-5 w-5" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />
      case 'info':
        return <Info className="h-5 w-5" />
    }
  }

  const getStyles = () => {
    const baseStyles = "flex items-start gap-3 p-4 rounded-lg shadow-lg border transition-all duration-300 transform"
    
    switch (toast.type) {
      case 'success':
        return cn(baseStyles, "bg-green-50 border-green-200 text-green-900")
      case 'error':
        return cn(baseStyles, "bg-red-50 border-red-200 text-red-900")
      case 'warning':
        return cn(baseStyles, "bg-yellow-50 border-yellow-200 text-yellow-900")
      case 'info':
        return cn(baseStyles, "bg-blue-50 border-blue-200 text-blue-900")
    }
  }

  const getIconColor = () => {
    switch (toast.type) {
      case 'success':
        return "text-green-500"
      case 'error':
        return "text-red-500"
      case 'warning':
        return "text-yellow-500"
      case 'info':
        return "text-blue-500"
    }
  }

  return (
    <div
      className={cn(
        getStyles(),
        {
          "translate-x-full opacity-0": !isVisible || isLeaving,
          "translate-x-0 opacity-100": isVisible && !isLeaving
        }
      )}
    >
      <div className={cn("flex-shrink-0", getIconColor())}>
        {getIcon()}
      </div>
      
      <div className="flex-1">
        {toast.title && (
          <h4 className="font-medium mb-1">{toast.title}</h4>
        )}
        <p className="text-sm">{toast.message}</p>
        
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium underline hover:no-underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      
      <button
        onClick={handleRemove}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Helper hook for common toast patterns
export function useToastActions() {
  const { success, error, warning, info } = useToast()
  
  return {
    successSave: () => success("Changes saved successfully"),
    successCreate: (item: string) => success(`${item} created successfully`),
    successDelete: (item: string) => success(`${item} deleted successfully`),
    errorSave: () => error("Failed to save changes", "Save Error"),
    errorLoad: () => error("Failed to load data", "Loading Error"),
    errorNetwork: () => error("Network error. Please check your connection.", "Connection Error"),
    warningUnsaved: () => warning("You have unsaved changes"),
    infoAutoSave: () => info("Changes auto-saved"),
  }
}
