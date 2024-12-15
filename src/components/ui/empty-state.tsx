import { LucideIcon } from "lucide-react"
import { Card } from "./card"
import { cn } from "../../lib/utils"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <Card className={cn("p-8 text-center", className)} {...props}>
      <div className="flex flex-col items-center gap-2">
        <Icon className="h-8 w-8 text-muted-foreground" />
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
        {action && (
          <div className="mt-4">
            {action}
          </div>
        )}
      </div>
    </Card>
  )
} 