import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "../../lib/utils"

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

// Enhanced progress with label and medical theming
const MedicalProgress = React.forwardRef(({ 
  className, 
  value = 0, 
  label, 
  showPercentage = true,
  variant = "default",
  ...props 
}, ref) => {
  const getProgressColor = () => {
    if (variant === "bio") return "bg-bio-500"
    if (variant === "medical") return "bg-medical-500"
    if (value >= 90) return "bg-bio-500"
    if (value >= 70) return "bg-medical-500"
    if (value >= 50) return "bg-yellow-500"
    return "bg-destructive"
  }

  return (
    <div className="space-y-2">
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-foreground">{label}</span>}
          {showPercentage && (
            <span className="text-muted-foreground">{value.toFixed(1)}%</span>
          )}
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-out",
            getProgressColor()
          )}
          style={{ transform: `translateX(-${100 - value}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
})
MedicalProgress.displayName = "MedicalProgress"

export { Progress, MedicalProgress }
