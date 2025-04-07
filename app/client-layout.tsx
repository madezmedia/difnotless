"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/components/cart/cart-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import { AccessibilityTools } from "@/components/accessibility/a11y-tools"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw } from "lucide-react"
import "@/styles/globals.css"

// Add error boundary around the CartProvider to prevent the entire app from crashing
import { ErrorBoundary } from "react-error-boundary"

// Add this component inside the file
function CartErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true)

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <div className="text-center py-4 px-6 bg-red-50 text-red-800 rounded-md m-4">
      <h2 className="text-lg font-semibold mb-2">Cart Error</h2>

      {!isOnline ? (
        <div className="flex flex-col items-center">
          <WifiOff className="h-6 w-6 mb-2" />
          <p className="mb-4">You appear to be offline. Some features may be limited until you reconnect.</p>
        </div>
      ) : (
        <p className="mb-4">There was an error loading the shopping cart. Some features may be limited.</p>
      )}

      <Button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 inline-flex items-center"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <ErrorBoundary
        FallbackComponent={CartErrorFallback}
        onReset={() => {
          // Clear cart ID from localStorage to force a fresh start
          if (typeof window !== "undefined") {
            localStorage.removeItem("cartId")
          }
          // Reload the page
          window.location.reload()
        }}
      >
        <CartProvider>
          <AccessibilityTools />
          <div className="flex min-h-screen flex-col font-marker transition-colors duration-300 bg-background">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </CartProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

