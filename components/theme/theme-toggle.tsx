"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor, Palette } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  showLabel?: boolean
  position?: "header" | "footer" | "floating"
}

export function ThemeToggle({
  variant = "outline",
  size = "default",
  className = "",
  showLabel = false,
  position = "header",
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Determine if we're in dark mode
  const isDarkMode = theme === "dark"

  // Floating position styles
  const floatingStyles = position === "floating" ? "fixed bottom-4 right-4 shadow-lg rounded-full z-50" : ""

  return (
    <div className={cn("flex items-center gap-2", floatingStyles, className)}>
      {/* Simple toggle button for quick light/dark switching */}
      <Button
        variant={variant}
        size={size}
        onClick={() => setTheme(isDarkMode ? "light" : "dark")}
        className={cn(
          "transition-all duration-300",
          isDarkMode ? "bg-gray-700 text-gray-100 hover:bg-gray-600" : "bg-gray-100 text-gray-800 hover:bg-gray-200",
          position === "floating" && "rounded-full h-12 w-12",
        )}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        )}
        {showLabel && <span className="ml-2">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>}
      </Button>

      {/* Advanced dropdown for more theme options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className={cn(position === "floating" && "rounded-full h-12 w-12", "hidden md:flex")}
            aria-label="Select a theme"
          >
            <Palette className="h-[1.2rem] w-[1.2rem]" />
            {showLabel && <span className="ml-2">Theme</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            className={cn("flex items-center gap-2 cursor-pointer", theme === "light" && "bg-accent font-medium")}
          >
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            className={cn("flex items-center gap-2 cursor-pointer", theme === "dark" && "bg-accent font-medium")}
          >
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("system")}
            className={cn("flex items-center gap-2 cursor-pointer", theme === "system" && "bg-accent font-medium")}
          >
            <Monitor className="h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

