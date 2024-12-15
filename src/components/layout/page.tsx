import { cn } from "../../lib/utils"

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  action?: React.ReactNode
}

export function Page({
  title,
  description,
  action,
  children,
  className,
  ...props
}: PageProps) {
  return (
    <div className="space-y-6" {...props}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
      <div className={cn("space-y-4", className)}>
        {children}
      </div>
    </div>
  )
} 