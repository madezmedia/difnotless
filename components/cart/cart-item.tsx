"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart/cart-provider"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Minus, Plus, Trash2 } from "lucide-react"

interface CartItemProps {
  item: {
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
}

export function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem, isLoading, setIsCartOpen } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(item.id)
    } else {
      updateItem(item.id, newQuantity)
    }
  }

  return (
    <div className="flex gap-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
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
          <Link
            href={`/products/${item.merchandise.product.handle}`}
            className="font-medium hover:underline"
            onClick={() => setIsCartOpen(false)}
          >
            {item.merchandise.product.title}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">{item.merchandise.title}</p>
          <p className="mt-1 text-sm font-medium">
            {formatPrice(item.merchandise.price, item.merchandise.currencyCode)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none rounded-l-md"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isLoading}
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="flex h-8 w-8 items-center justify-center text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none rounded-r-md"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isLoading}
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => removeItem(item.id)}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

