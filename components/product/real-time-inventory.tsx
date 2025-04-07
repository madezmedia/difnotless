"use client"

import { useEffect, useState } from "react"
import { getProduct } from "@/lib/shopify"
import { ProductInventoryStatus } from "@/components/product/product-inventory-status"
import { Loader2 } from "lucide-react"

interface RealTimeInventoryProps {
  productId: string
  variantId?: string
  pollingInterval?: number // in milliseconds
}

export function RealTimeInventory({
  productId,
  variantId,
  pollingInterval = 60000, // Default to 1 minute
}: RealTimeInventoryProps) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProductData = async () => {
    try {
      const productData = await getProduct(productId)
      setProduct(productData)
      setError(null)
    } catch (err) {
      setError("Failed to fetch product inventory")
      console.error("Error fetching product inventory:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData()

    // Set up polling for real-time updates
    const intervalId = setInterval(fetchProductData, pollingInterval)

    return () => clearInterval(intervalId)
  }, [productId, pollingInterval])

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Checking inventory...</span>
      </div>
    )
  }

  if (error || !product) {
    return null
  }

  // If a specific variant is requested, filter to just that variant
  const productToDisplay = variantId
    ? {
        ...product,
        variants: product.variants.filter((v: any) => v.id === variantId),
      }
    : product

  return <ProductInventoryStatus product={productToDisplay} />
}

