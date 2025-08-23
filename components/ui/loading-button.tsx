import { Button } from "@/components/ui/button"
import { Loader2, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes } from "react"

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  success?: boolean
  error?: boolean
  loadingText?: string
  successText?: string
  errorText?: string
  icon?: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function LoadingButton({
  children,
  loading = false,
  success = false,
  error = false,
  loadingText,
  successText,
  errorText,
  icon,
  className,
  disabled,
  variant,
  ...props
}: LoadingButtonProps) {
  const getContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || children}
        </>
      )
    }
    
    if (success) {
      return (
        <>
          <Check className="mr-2 h-4 w-4" />
          {successText || children}
        </>
      )
    }
    
    if (error) {
      return (
        <>
          <AlertCircle className="mr-2 h-4 w-4" />
          {errorText || children}
        </>
      )
    }
    
    return (
      <>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </>
    )
  }

  const getVariant = () => {
    if (success) return "default"
    if (error) return "destructive"
    return variant || "default"
  }

  return (
    <Button
      {...props}
      variant={getVariant()}
      disabled={disabled || loading}
      className={cn(
        "transition-all duration-200",
        {
          "bg-green-600 hover:bg-green-700 border-green-600": success,
          "bg-red-600 hover:bg-red-700 border-red-600": error,
        },
        className
      )}
    >
      {getContent()}
    </Button>
  )
}

// Preset configurations for common use cases
export const CreateButton = (props: Omit<LoadingButtonProps, 'loadingText' | 'successText'>) => (
  <LoadingButton
    loadingText="Creating..."
    successText="Created!"
    {...props}
  />
)

export const SaveButton = (props: Omit<LoadingButtonProps, 'loadingText' | 'successText'>) => (
  <LoadingButton
    loadingText="Saving..."
    successText="Saved!"
    {...props}
  />
)

export const SubmitButton = (props: Omit<LoadingButtonProps, 'loadingText' | 'successText'>) => (
  <LoadingButton
    loadingText="Submitting..."
    successText="Submitted!"
    {...props}
  />
)

export const DeleteButton = (props: Omit<LoadingButtonProps, 'loadingText' | 'successText' | 'variant'>) => (
  <LoadingButton
    variant="destructive"
    loadingText="Deleting..."
    successText="Deleted!"
    {...props}
  />
)
