"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createCart, getCart, addToCart, updateCartItem, removeCartItem } from "@/lib/shopify"
import { useToast } from "@/components/ui/use-toast"

type CartItem = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      title: string
      handle: string
      image: string
      imageAlt: string
    }
    price: string
    currencyCode: string
  }
}

type CartCost = {
  subtotal: string
  subtotalCurrencyCode: string
  total: string
  totalCurrencyCode: string
  tax?: string
  taxCurrencyCode?: string
}

type Cart = {
  id: string
  checkoutUrl: string
  lines: CartItem[]
  cost: CartCost
}

type CartContextType = {
  cart: Cart | null
  isLoading: boolean
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  clearCart: () => Promise<void>
  cartCount: number
  isOfflineMode: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Check if the device is online
const isOnline = () => {
  return isBrowser ? navigator.onLine : true
}

// Create a fallback empty cart
const createFallbackCart = (): Cart => ({
  id: `offline-${Date.now()}`,
  checkoutUrl: "#",
  lines: [],
  cost: {
    subtotal: "0",
    subtotalCurrencyCode: "USD",
    total: "0",
    totalCurrencyCode: "USD",
  },
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isOfflineMode, setIsOfflineMode] = useState(!isOnline())
  const { toast } = useToast()

  // Listen for online/offline events
  useEffect(() => {
    if (!isBrowser) return

    const handleOnline = () => {
      setIsOfflineMode(false)
      // Attempt to re-initialize cart when coming back online
      initializeCart()
    }

    const handleOffline = () => {
      setIsOfflineMode(true)
      toast({
        title: "You're offline",
        description: "Some features may be limited until you reconnect.",
        variant: "destructive",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const initializeCart = async () => {
    setIsLoading(true)

    try {
      // First try to get an existing cart from localStorage
      const existingCartId = localStorage.getItem("cartId")

      if (existingCartId) {
        try {
          console.log("Attempting to fetch existing cart:", existingCartId)
          const cart = await getCart(existingCartId)
          if (cart) {
            console.log("Successfully retrieved existing cart")
            setCart(cart)
            setIsLoading(false)
            return
          }
        } catch (error) {
          console.error("Error fetching existing cart:", error)
          // Clear the invalid cart ID
          console.log("Clearing invalid cart ID from localStorage")
          localStorage.removeItem("cartId")
        }
      }

      // Create a new cart with retry logic
      let retries = 5 // Increase retries
      let success = false
      let lastError = null

      while (retries > 0 && !success) {
        try {
          console.log(`Creating new cart (${retries} retries left)...`)
          const newCart = await createCart()

          // Validate the cart has a proper ID (not offline)
          if (newCart.id && !newCart.id.startsWith("offline-")) {
            console.log("Successfully created new cart:", newCart.id)
            setCart(newCart)
            localStorage.setItem("cartId", newCart.id)
            success = true
          } else {
            console.warn("Created cart appears to be offline:", newCart.id)
            // If we got an offline cart but we're online, retry
            if (isOnline()) {
              retries--
              await new Promise((resolve) => setTimeout(resolve, 2000))
              continue
            } else {
              // We're actually offline, so use the offline cart
              console.log("Using offline cart as device is offline")
              setCart(newCart)
              success = true
            }
          }
        } catch (error) {
          lastError = error
          console.error(`Error creating cart (${retries} retries left):`, error)
          retries--

          if (retries === 0) {
            // If all retries fail, create a temporary local cart
            console.warn("Using fallback local cart due to Shopify API issues")
            const fallbackCart = createFallbackCart()
            setCart(fallbackCart)
          } else {
            // Wait before retrying (with increasing delay)
            const delay = (5 - retries) * 2000 // 2s, 4s, 6s, 8s
            await new Promise((resolve) => setTimeout(resolve, delay))
          }
        }
      }
    } catch (error) {
      console.error("Unhandled error in cart initialization:", error)
      // Always ensure we have at least a fallback cart
      setCart(createFallbackCart())
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize cart on component mount
  useEffect(() => {
    initializeCart()
  }, [])

  const addItem = async (variantId: string, quantity: number) => {
    if (!cart) return

    setIsLoading(true)

    try {
      // Check if we're using a fallback local cart or offline
      if (cart.id.startsWith("offline-") || isOfflineMode) {
        // Show a message that the cart functionality is limited
        toast({
          title: "Limited functionality",
          description: "Cart operations are currently unavailable. Please try again later.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const updatedCart = await addToCart(cart.id, variantId, quantity)
      setCart(updatedCart)
      setIsCartOpen(true)
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      })
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateItem = async (lineId: string, quantity: number) => {
    if (!cart) return

    setIsLoading(true)

    try {
      if (cart.id.startsWith("offline-") || isOfflineMode) {
        toast({
          title: "Limited functionality",
          description: "Cart operations are currently unavailable. Please try again later.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      const updatedCart = await updateCartItem(cart.id, lineId, quantity)
      setCart(updatedCart)
    } catch (error) {
      console.error("Error updating cart item:", error)
      toast({
        title: "Error",
        description: "Could not update item quantity. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (lineId: string) => {
    if (!cart) return

    setIsLoading(true)

    try {
      if (cart.id.startsWith("offline-") || isOfflineMode) {
        toast({
          title: "Limited functionality",
          description: "Cart operations are currently unavailable. Please try again later.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      const updatedCart = await removeCartItem(cart.id, lineId)
      setCart(updatedCart)
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      })
    } catch (error) {
      console.error("Error removing cart item:", error)
      toast({
        title: "Error",
        description: "Could not remove item from cart. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    if (!cart) return

    setIsLoading(true)

    try {
      if (cart.id.startsWith("offline-") || isOfflineMode) {
        toast({
          title: "Limited functionality",
          description: "Cart operations are currently unavailable. Please try again later.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      // Remove each item from the cart
      for (const line of cart.lines) {
        await removeCartItem(cart.id, line.id)
      }

      // Create a new cart
      const newCart = await createCart()
      setCart(newCart)
      localStorage.setItem("cartId", newCart.id)

      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      })
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        title: "Error",
        description: "Could not clear cart. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const cartCount = cart?.lines?.reduce((total, item) => total + item.quantity, 0) || 0

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isCartOpen,
        setIsCartOpen,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        cartCount,
        isOfflineMode,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}

