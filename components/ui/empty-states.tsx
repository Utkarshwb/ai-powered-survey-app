import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Layers, FileText, BarChart3, Sparkles, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  secondaryActions?: Array<{
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }>
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  primaryAction, 
  secondaryActions 
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 text-gray-400 mb-6 flex items-center justify-center">
        {icon || <FileText className="h-24 w-24" />}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        {description}
      </p>
      
      {primaryAction && (
        <div className="space-y-4">
          <Button size="lg" onClick={primaryAction.onClick} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            {primaryAction.icon}
            {primaryAction.label}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          {secondaryActions && secondaryActions.length > 0 && (
            <div className="flex gap-2 justify-center flex-wrap">
              {secondaryActions.map((action, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  size="sm" 
                  onClick={action.onClick}
                  className="text-sm"
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function EmptyDashboard() {
  const router = useRouter()
  
  return (
    <EmptyState
      title="Ready to create your first survey?"
      description="Start gathering valuable feedback in minutes with our intuitive survey builder"
      icon={<BarChart3 className="h-24 w-24" />}
      primaryAction={{
        label: "Create Your First Survey",
        onClick: () => router.push('/surveys/new'),
        icon: <Plus className="mr-2 h-4 w-4" />
      }}
      secondaryActions={[
        {
          label: "Browse Templates",
          onClick: () => router.push('/surveys/new?tab=templates'),
          icon: <Layers className="mr-2 h-4 w-4" />
        },
        {
          label: "View Demo",
          onClick: () => window.open('/demo', '_blank'),
          icon: <Sparkles className="mr-2 h-4 w-4" />
        }
      ]}
    />
  )
}

export function EmptySearchResults({ searchQuery }: { searchQuery: string }) {
  return (
    <EmptyState
      title="No surveys found"
      description={`We couldn't find any surveys matching "${searchQuery}". Try adjusting your search terms or create a new survey.`}
      icon={<FileText className="h-24 w-24" />}
    />
  )
}

export function EmptyResponses() {
  return (
    <EmptyState
      title="No responses yet"
      description="Share your survey to start collecting responses. Each response will appear here with detailed analytics."
      icon={<BarChart3 className="h-24 w-24" />}
    />
  )
}
