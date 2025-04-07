import { Badge } from "@/components/ui/badge"
import { getProductAvailability } from "@/lib/product-sync"

interface ProductInventoryStatusProps {
  product: any
  className?: string
}

export function ProductInventoryStatus({ product, className }: ProductInventoryStatusProps) {
  const { isAvailable, inventoryStatus, totalInventory } = getProductAvailability(product)

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

