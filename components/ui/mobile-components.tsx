"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Share, 
  BarChart3, 
  Edit, 
  Copy, 
  Trash, 
  MoreHorizontal,
  Eye,
  Download,
  Settings
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-gestures"

interface MobileActionSheetProps {
  survey: any
  onEdit?: () => void
  onShare?: () => void
  onAnalytics?: () => void
  onCopy?: () => void
  onDelete?: () => void
  onPreview?: () => void
  onExport?: () => void
  onSettings?: () => void
}

export function MobileActionSheet({
  survey,
  onEdit,
  onShare,
  onAnalytics,
  onCopy,
  onDelete,
  onPreview,
  onExport,
  onSettings
}: MobileActionSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  if (!isMobile) return null

  const actions = [
    {
      icon: <Edit className="h-5 w-5" />,
      label: "Edit Survey",
      onClick: () => {
        onEdit?.()
        setIsOpen(false)
      },
      primary: true
    },
    {
      icon: <Eye className="h-5 w-5" />,
      label: "Preview",
      onClick: () => {
        onPreview?.()
        setIsOpen(false)
      }
    },
    {
      icon: <Share className="h-5 w-5" />,
      label: "Share",
      onClick: () => {
        onShare?.()
        setIsOpen(false)
      }
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Analytics",
      onClick: () => {
        onAnalytics?.()
        setIsOpen(false)
      }
    },
    {
      icon: <Copy className="h-5 w-5" />,
      label: "Duplicate",
      onClick: () => {
        onCopy?.()
        setIsOpen(false)
      }
    },
    {
      icon: <Download className="h-5 w-5" />,
      label: "Export",
      onClick: () => {
        onExport?.()
        setIsOpen(false)
      }
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      onClick: () => {
        onSettings?.()
        setIsOpen(false)
      }
    },
    {
      icon: <Trash className="h-5 w-5" />,
      label: "Delete",
      onClick: () => {
        onDelete?.()
        setIsOpen(false)
      },
      destructive: true
    }
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto">
        <div className="py-4">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold">{survey?.title}</h3>
            <p className="text-sm text-gray-500 mt-1">Choose an action</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {actions.filter(action => action.onClick).map((action, index) => (
              <Button
                key={index}
                variant={action.primary ? "default" : action.destructive ? "destructive" : "outline"}
                className="h-16 flex flex-col gap-2"
                onClick={action.onClick}
              >
                {action.icon}
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Floating Action Button for Mobile
interface MobileFloatingActionButtonProps {
  onClick: () => void
  icon?: React.ReactNode
  label?: string
}

export function MobileFloatingActionButton({
  onClick,
  icon = <Edit className="h-6 w-6" />,
  label = "Create"
}: MobileFloatingActionButtonProps) {
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      size="lg"
    >
      {icon}
      <span className="sr-only">{label}</span>
    </Button>
  )
}

// Mobile Navigation Bottom Bar
interface MobileBottomNavProps {
  currentPage: 'dashboard' | 'surveys' | 'analytics' | 'profile'
  onNavigate: (page: string) => void
}

export function MobileBottomNav({ currentPage, onNavigate }: MobileBottomNavProps) {
  const isMobile = useIsMobile()

  if (!isMobile) return null

  const navItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      key: 'surveys',
      label: 'Surveys',
      icon: <Edit className="h-5 w-5" />
    },
    {
      key: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="h-5 w-5" />
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              currentPage === item.key
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
