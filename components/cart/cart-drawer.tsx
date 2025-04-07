"use client"

import { useCart } from "@/components/cart/cart-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CartItem } from "@/components/cart/cart-item"
import { formatPrice } from "@/lib/utils"
import { Loader2, WifiOff } from "lucide-react"

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, isLoading, clearCart, isOfflineMode } = useCart()

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>Your Cart {cart?.lines?.length ? `(${cart.lines.length})` : ""}</SheetTitle>
        </SheetHeader>

        {isOfflineMode && (
          <div className="flex items-center justify-center p-4 mb-4 bg-amber-50 text-amber-800 rounded-md">
            <WifiOff className="h-4 w-4 mr-2" />
            <p className="text-sm">You're currently offline. Cart functionality is limited.</p>
          </div>
        )}

        {isLoading && (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && cart?.lines?.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-12">
            <div className="text-center">
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add items to your cart to see them here.</p>
            </div>
            <Button onClick={() => setIsCartOpen(false)} className="bg-gold hover:bg-gold/90 text-black">
              Continue Shopping
            </Button>
          </div>
        )}

        {!isLoading && cart?.lines?.length > 0 && (
          <>
            <ScrollArea className="flex-1 py-6">
              <div className="space-y-6 px-1">
                {cart.lines.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Subtotal</span>
                  <span>{formatPrice(cart.cost.subtotal, cart.cost.subtotalCurrencyCode)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-medium">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                {cart.cost.tax && (
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Tax</span>
                    <span>{formatPrice(cart.cost.tax, cart.cost.taxCurrencyCode)}</span>
                  </div>
                )}

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(cart.cost.total, cart.cost.totalCurrencyCode)}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Button
                  asChild
                  className="bg-gradient-to-r from-gold to-teal text-black hover:from-gold/90 hover:to-teal/90"
                  disabled={isOfflineMode || cart.id.startsWith("offline-")}
                >
                  <a
                    href={isOfflineMode || cart.id.startsWith("offline-") ? "#" : cart.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Checkout
                  </a>
                </Button>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsCartOpen(false)}>
                    Continue Shopping
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={clearCart}
                    disabled={isOfflineMode || cart.id.startsWith("offline-")}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

