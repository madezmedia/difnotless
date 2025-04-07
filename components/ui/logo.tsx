import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import "@/styles/logo-3d.css"

interface LogoProps {
  variant?: "default" | "light"
  className?: string
  href?: string
}

export function Logo({ variant = "default", className, href }: LogoProps) {
  const prefersReducedMotion = useReducedMotion()

  const logoContent = (
    <>
      <div className="relative h-10 w-10 overflow-hidden">
        <Image
          src="/logo.png"
          alt="Different Not Less Logo - Hand sign with heart symbols"
          width={40}
          height={40}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex items-center">
        {/* Fallback solid color text for screen readers */}
        <span className="sr-only">Different Not Less</span>

        {/* Gradient Text with reduced shadow */}
        <span
          aria-hidden="true"
          className={cn(
            "font-brand text-xl font-bold logo-text-gradient",
            variant === "light" ? "text-white" : "text-foreground",
          )}
        >
          Different Not Less
        </span>
      </div>
    </>
  )

  // If href is provided, wrap in Link, otherwise just return the content
  if (href) {
    return (
      <Link href={href} className={cn("flex items-center gap-3", className)} aria-label="Different Not Less - Home">
        {logoContent}
      </Link>
    )
  }

  // Return without link wrapper
  return <div className={cn("flex items-center gap-3", className)}>{logoContent}</div>
}

