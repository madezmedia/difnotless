"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { updateCartBuyerIdentity, applyDiscountCode } from "@/lib/shopify"
import { formatPrice } from "@/lib/utils"

export function CheckoutForm() {
  const router = useRouter()
  const { cart, isLoading } = useCart()
  const [email, setEmail] = useState("")
  const [discountCode, setDiscountCode] = useState("")
  const [discountError, setDiscountError] = useState("")
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [isUpdatingCart, setIsUpdatingCart] = useState(false)

  if (!cart) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Your cart is empty</p>
        <Button onClick={() => router.push("/collections")} className="mt-4">
          Continue Shopping
        </Button>
      </div>
    )
  }

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!discountCode.trim() || !cart) return

    setIsApplyingDiscount(true)
    setDiscountError("")

    try {
      await applyDiscountCode(cart.id, discountCode)
      // The cart provider should automatically update with the new cart data
    } catch (error: any) {
      setDiscountError(error.message || "Failed to apply discount code")
    } finally {
      setIsApplyingDiscount(false)
    }
  }

  const handleProceedToCheckout = async () => {
    if (!email || !cart) return

    setIsUpdatingCart(true)

    try {
      // Update cart with customer information
      await updateCartBuyerIdentity(cart.id, {
        email,
        marketingConsent: {
          marketingOptInLevel: marketingConsent ? "EXPLICIT" : "UNSUBSCRIBED",
        },
      })

      // Redirect to Shopify checkout
      window.location.href = cart.checkoutUrl
    } catch (error) {
      console.error("Error proceeding to checkout:", error)
    } finally {
      setIsUpdatingCart(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Checkout</h2>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="marketing"
            checked={marketingConsent}
            onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
          />
          <Label htmlFor="marketing" className="text-sm">
            Email me about new products, features, and exclusive offers
          </Label>
        </div>

        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="discount">Discount Code</Label>
              <Input
                id="discount"
                type="text"
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleApplyDiscount}
              disabled={isApplyingDiscount || !discountCode.trim()}
            >
              {isApplyingDiscount ? "Applying..." : "Apply"}
            </Button>
          </div>
          {discountError && <p className="text-sm text-destructive">{discountError}</p>}
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(cart.cost.subtotal, cart.cost.subtotalCurrencyCode)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Calculated at next step</span>
        </div>

        {cart.cost.tax && (
          <div className="flex justify-between">
            <span>Estimated Tax</span>
            <span>{formatPrice(cart.cost.tax, cart.cost.taxCurrencyCode)}</span>
          </div>
        )}

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(cart.cost.total, cart.cost.totalCurrencyCode)}</span>
        </div>
      </div>

      <Button
        className="w-full bg-gradient-to-r from-gold to-teal text-black hover:from-gold/90 hover:to-teal/90"
        size="lg"
        onClick={handleProceedToCheckout}
        disabled={isUpdatingCart || !email}
      >
        {isUpdatingCart ? "Processing..." : "Proceed to Checkout"}
      </Button>
    </div>
  )
}

