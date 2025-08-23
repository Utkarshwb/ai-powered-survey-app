import { cn } from "@/lib/utils"
import { Clock, CheckCircle } from "lucide-react"

interface ProgressHeaderProps {
  current: number
  total: number
  estimatedTimeMinutes?: number
  title?: string
  className?: string
}

export function ProgressHeader({ 
  current, 
  total, 
  estimatedTimeMinutes, 
  title,
  className 
}: ProgressHeaderProps) {
  const progressPercentage = (current / total) * 100
  const remainingQuestions = total - current
  const estimatedTimeRemaining = estimatedTimeMinutes 
    ? Math.ceil((remainingQuestions / total) * estimatedTimeMinutes)
    : null

  return (
    <div className={cn("mb-8", className)}>
      {title && (
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          {title}
        </h1>
      )}
      
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">Question {current} of {total}</span>
          {current === total && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </div>
        
        {estimatedTimeRemaining !== null && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              {estimatedTimeRemaining > 0 
                ? `~${estimatedTimeRemaining} min remaining`
                : "Almost done!"
              }
            </span>
          </div>
        )}
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 transition-all duration-700 ease-out relative overflow-hidden"
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
          </div>
        </div>
        
        {/* Progress percentage text */}
        <div className="absolute right-0 -top-6 text-xs font-medium text-gray-500 dark:text-gray-400">
          {Math.round(progressPercentage)}%
        </div>
      </div>
      
      {/* Milestone indicators */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: Math.min(total, 10) }).map((_, index) => {
          const questionNumber = Math.ceil(((index + 1) / 10) * total)
          const isCompleted = current >= questionNumber
          const isCurrent = current === questionNumber
          
          return (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-300",
                {
                  "bg-blue-500": isCompleted,
                  "bg-blue-600 ring-2 ring-blue-200": isCurrent,
                  "bg-gray-300 dark:bg-gray-600": !isCompleted && !isCurrent
                }
              )}
            />
          )
        })}
      </div>
    </div>
  )
}

interface StepProgressProps {
  steps: Array<{
    label: string
    completed: boolean
    current?: boolean
  }>
  className?: string
}

export function StepProgress({ steps, className }: StepProgressProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                {
                  "bg-blue-500 text-white": step.completed,
                  "bg-blue-100 text-blue-600 ring-2 ring-blue-500": step.current,
                  "bg-gray-200 text-gray-500": !step.completed && !step.current
                }
              )}
            >
              {step.completed ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            <span className={cn(
              "text-xs mt-2 text-center max-w-20",
              {
                "text-blue-600 font-medium": step.current,
                "text-gray-500": !step.current
              }
            )}>
              {step.label}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-px w-12 mx-2 transition-colors duration-300",
                step.completed ? "bg-blue-500" : "bg-gray-300"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
