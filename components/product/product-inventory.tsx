"use client"

import { Badge } from "@/components/ui/badge"

interface ProductInventoryStatusProps {
  product: any
  className?: string
}

export function ProductInventoryStatus({ product, className }: ProductInventoryStatusProps) {
  const isAvailable = product?.variants?.some((variant: any) => variant.availableForSale)
  const totalInventory =
    product?.variants?.reduce((sum: number, variant: any) => sum + (variant.quantityAvailable || 0), 0) || 0

  let inventoryStatus = "Out of Stock"
  if (isAvailable) {
    if (totalInventory > 10) {
      inventoryStatus = "In Stock"
    } else if (totalInventory > 0) {
      inventoryStatus = "Low Stock"
    } else {
      inventoryStatus = "Available for Backorder"
    }
  }

  if (!isAvailable) {
    return (
      <Badge variant="destructive" className={className}>
        Out of Stock
      </Badge>
    )
  }

  if (inventoryStatus === "Low Stock") {
    return (
      <Badge variant="outline" className={`bg-amber-100 text-amber-800 ${className}`}>
        Low Stock - Only {totalInventory} left
      </Badge>
    )
  }

  if (inventoryStatus === "Available for Backorder") {
    return (
      <Badge variant="outline" className={`bg-blue-100 text-blue-800 ${className}`}>
        Available for Backorder
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={`bg-green-100 text-green-800 ${className}`}>
      In Stock
    </Badge>
  )
}

