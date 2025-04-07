import { getProductRecommendations } from "@/lib/shopify"
import { ProductGrid } from "@/components/product/product-grid"

interface ProductRecommendationsProps {
  productId: string
}

export async function ProductRecommendations({ productId }: ProductRecommendationsProps) {
  const recommendations = await getProductRecommendations(productId)

  if (!recommendations.length) {
    return null
  }

  return <ProductGrid products={recommendations} />
}

