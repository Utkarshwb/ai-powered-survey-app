import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Layers, Import, BarChart3, Users, Zap, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  color: string
  featured?: boolean
}

export function QuickActionsGrid() {
  const router = useRouter()
  
  const quickActions: QuickAction[] = [
    {
      title: "Create Survey",
      description: "Start from scratch with our intuitive builder",
      icon: <Plus className="h-6 w-6" />,
      onClick: () => router.push('/surveys/new'),
      color: "blue",
      featured: true
    },
    {
      title: "Use Template",
      description: "Quick start with proven survey templates",
      icon: <Layers className="h-6 w-6" />,
      onClick: () => router.push('/surveys/new?tab=templates'),
      color: "green"
    },
    {
      title: "AI Assistant",
      description: "Generate questions with AI help",
      icon: <Zap className="h-6 w-6" />,
      onClick: () => router.push('/surveys/new?ai=true'),
      color: "purple",
      featured: true
    },
    {
      title: "Import Survey",
      description: "Upload from file or copy from URL",
      icon: <Import className="h-6 w-6" />,
      onClick: () => router.push('/surveys/import'),
      color: "orange"
    },
    {
      title: "View Analytics",
      description: "Explore insights from all surveys",
      icon: <BarChart3 className="h-6 w-6" />,
      onClick: () => router.push('/analytics'),
      color: "indigo"
    },
    {
      title: "Manage Team",
      description: "Invite collaborators and set permissions",
      icon: <Users className="h-6 w-6" />,
      onClick: () => router.push('/team'),
      color: "pink"
    }
  ]

  const getColorClasses = (color: string, featured?: boolean) => {
    const baseClasses = "transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
    
    if (featured) {
      return {
        card: `${baseClasses} border-2 border-${color}-200 bg-gradient-to-br from-${color}-50 to-white dark:from-${color}-950 dark:to-gray-900`,
        icon: `p-3 bg-gradient-to-br from-${color}-500 to-${color}-600 text-white rounded-xl group-hover:scale-110 transition-transform`,
        title: `text-${color}-900 dark:text-${color}-100`,
        description: `text-${color}-700 dark:text-${color}-300`
      }
    }
    
    return {
      card: `${baseClasses} hover:border-${color}-200`,
      icon: `p-3 bg-${color}-100 dark:bg-${color}-900 text-${color}-600 dark:text-${color}-400 rounded-xl group-hover:scale-110 transition-transform`,
      title: "text-gray-900 dark:text-white",
      description: "text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          <p className="text-gray-600 dark:text-gray-400">Get started with common tasks</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const colorClasses = getColorClasses(action.color, action.featured)
          
          return (
            <Card 
              key={index}
              className={colorClasses.card}
              onClick={action.onClick}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={colorClasses.icon}>
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold mb-1 ${colorClasses.title}`}>
                      {action.title}
                      {action.featured && (
                        <span className="ml-2 text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </h3>
                    <p className={`text-sm leading-relaxed ${colorClasses.description}`}>
                      {action.description}
                    </p>
                    <div className="mt-3 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700">
                      Get started
                      <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
