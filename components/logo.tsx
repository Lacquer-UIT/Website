import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  }

  return (
    <div className={cn("flex items-center", className)}>
      <span className={cn("font-heading font-bold text-lacquer-red", sizeClasses[size])}>LacQuer</span>
    </div>
  )
}
