import { Skeleton } from "./skeleton"
import { Card, CardContent, CardHeader } from "./card"

interface LoadingListProps {
  count?: number
  variant?: "default" | "compact"
}

export function LoadingList({ count = 3, variant = "default" }: LoadingListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {variant === "default" ? (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </>
              ) : (
                <Skeleton className="h-4 w-full" />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 