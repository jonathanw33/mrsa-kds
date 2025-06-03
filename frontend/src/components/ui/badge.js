import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-bio-500 text-white hover:bg-bio-600",
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        medical:
          "border-transparent bg-medical-500 text-white hover:bg-medical-600",
        high: "border-transparent bg-bio-500 text-white",
        medium: "border-transparent bg-medical-500 text-white", 
        low: "border-transparent bg-yellow-500 text-white",
        none: "border-transparent bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

// Specialized confidence badge
const ConfidenceBadge = ({ confidence, className, ...props }) => {
  const getVariant = () => {
    if (confidence >= 90) return "high"
    if (confidence >= 70) return "medium"
    if (confidence >= 50) return "low"
    return "none"
  }

  const getLabel = () => {
    if (confidence >= 90) return "High Confidence"
    if (confidence >= 70) return "Medium Confidence"
    if (confidence >= 50) return "Low Confidence"
    return "No Confidence"
  }

  return (
    <Badge 
      variant={getVariant()} 
      className={cn("text-xs font-medium", className)}
      {...props}
    >
      {getLabel()} ({confidence.toFixed(1)}%)
    </Badge>
  )
}

export { Badge, ConfidenceBadge, badgeVariants }
