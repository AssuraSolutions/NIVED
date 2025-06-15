import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingProps {
  value: number
  max?: number
  className?: string
}

export function Rating({ value, max = 5, className }: RatingProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} className={cn("w-4 h-4", i < value ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
      ))}
    </div>
  )
}
