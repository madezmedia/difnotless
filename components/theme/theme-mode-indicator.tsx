"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeModeIndicatorProps {
  className?: string
  showIcon?: boolean
  showText?: boolean
}

export function ThemeModeIndicator({ className = "", showIcon = true, showText = true }: ThemeModeIndicatorProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const getIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="h-4 w-4" />
      case "light":
        return <Sun className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getText = () => {
    switch (theme) {
      case "dark":
        return "Dark Mode"
      case "light":
        return "Light Mode"
      default:
        return "System Theme"
    }
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
        theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800",
        className,
      )}
    >
      {showIcon && getIcon()}
      {showText && <span>{getText()}</span>}
    </div>
  )
}

