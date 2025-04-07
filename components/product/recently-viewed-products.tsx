"use client"

import { useEffect, useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { getProduct } from "@/lib/shopify"
import { ProductGrid } from "@/components/product/product-grid"
import { Loader2 } from "lucide-react"

interface RecentlyViewedProductsProps {
  currentProductId?: string
  maxProducts?: number
}

export function RecentlyViewedProducts({ currentProductId, maxProducts = 4 }: RecentlyViewedProductsProps) {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<string[]>("recently-viewed-products", [])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Add current product to recently viewed
  useEffect(() => {
    if (currentProductId) {
      setRecentlyViewed((prev) => {
        // Remove current product if it exists (to move it to the front)
        const filtered = prev.filter((id) => id !== currentProductId)
        // Add current product to the front
        return [currentProductId, ...filtered].slice(0, 20) // Store up to 20 products
      })
    }
  }, [currentProductId, setRecentlyViewed])

  // Fetch product data for recently viewed products
  useEffect(() => {
    const fetchProducts = async () => {
      if (recentlyViewed.length === 0) {
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        // Filter out current product and limit to maxProducts
        const productIds = recentlyViewed.filter((id) => id !== currentProductId).slice(0, maxProducts)

        // Fetch products in parallel
        const productPromises = productIds.map((handle) => getProduct(handle))
        const productData = await Promise.all(productPromises)

        // Filter out any null results
        setProducts(productData.filter(Boolean))
      } catch (error) {
        console.error("Error fetching recently viewed products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [recentlyViewed, currentProductId, maxProducts])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recently Viewed</h2>
      <ProductGrid products={products} />
    </div>
  )
}

