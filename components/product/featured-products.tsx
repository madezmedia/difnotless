import { getCollection } from "@/lib/shopify"
import { ProductGrid } from "@/components/product/product-grid"

export async function FeaturedProducts() {
  // Fetch products from the "Featured" collection
  const featuredCollection = await getCollection("featured")

  if (!featuredCollection) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No featured products found</p>
      </div>
    )
  }

  return <ProductGrid products={featuredCollection.products.slice(0, 4)} />
}

