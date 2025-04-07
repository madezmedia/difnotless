"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart/cart-provider"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function CartSummary() {
  const { cart, isLoading } = useCart()

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Your cart is empty</p>
        <Button asChild className="mt-4">
          <Link href="/collections">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold">Order Summary</h2>

      <div className="space-y-4">
        {cart.lines.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
              {item.merchandise.product.image ? (
                <Image
                  src={item.merchandise.product.image || "/placeholder.svg"}
                  alt={item.merchandise.product.imageAlt || item.merchandise.product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary/20">
                  <span className="text-xs text-muted-foreground">No image</span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-medium">{item.merchandise.product.title}</h3>
                <p className="text-sm text-muted-foreground">{item.merchandise.title}</p>
                <p className="text-sm">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">
                {formatPrice(
                  (Number.parseFloat(item.merchandise.price) * item.quantity).toString(),
                  item.merchandise.currencyCode,
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(cart.cost.subtotal, cart.cost.subtotalCurrencyCode)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>

        {cart.cost.tax && (
          <div className="flex justify-between">
            <span>Estimated Tax</span>
            <span>{formatPrice(cart.cost.tax, cart.cost.taxCurrencyCode)}</span>
          </div>
        )}

        <div className="flex justify-between font-bold pt-2 border-t">
          <span>Total</span>
          <span>{formatPrice(cart.cost.total, cart.cost.totalCurrencyCode)}</span>
        </div>
      </div>
    </div>
  )
}

