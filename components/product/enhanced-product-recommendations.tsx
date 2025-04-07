"use client"

import { useEffect, useState } from "react"
import { getProductRecommendations } from "@/lib/shopify"
import { ProductGrid } from "@/components/product/product-grid"
import { Loader2 } from "lucide-react"

interface EnhancedProductRecommendationsProps {
  productId: string
  title?: string
}

export function EnhancedProductRecommendations({
  productId,
  title = "You might also like",
}: EnhancedProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getProductRecommendations(productId)
        setRecommendations(data)
      } catch (error) {
        console.error("Error fetching product recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [productId])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <ProductGrid products={recommendations} />
    </div>
  )
}

