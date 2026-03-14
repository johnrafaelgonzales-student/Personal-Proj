/**
 * @fileoverview Defines the Skeleton component, used for showing a placeholder loading state.
 * It's a simple div with an animation to indicate that content is being loaded.
 * This component is part of the ShadCN UI library.
 * @see https://ui.shadcn.com/docs/components/skeleton
 */
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
