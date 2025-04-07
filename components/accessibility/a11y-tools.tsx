"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Eye } from "lucide-react"
import { useTheme } from "next-themes"

export function AccessibilityTools() {
  const [mounted, setMounted] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)

    // Check for saved preference
    const savedContrast = localStorage.getItem("high-contrast") === "true"
    setHighContrast(savedContrast)

    if (savedContrast) {
      document.documentElement.classList.add("high-contrast")
    }
  }, [])

  const toggleHighContrast = () => {
    const newValue = !highContrast
    setHighContrast(newValue)
    localStorage.setItem("high-contrast", String(newValue))

    if (newValue) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }

  if (!mounted) return null

  return (
    <>
      {/* Skip to content link - only visible on keyboard focus */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:shadow-md focus:rounded-md"
      >
        Skip to main content
      </a>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={toggleHighContrast}
          aria-label={highContrast ? "Disable high contrast" : "Enable high contrast"}
        >
          <Eye className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
    </>
  )
}

