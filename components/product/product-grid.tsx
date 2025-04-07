import { AnimatedProductCard } from "@/components/product/animated-product-card"

interface Product {
  id: string
  title: string
  handle: string
  price: string
  currencyCode: string
  image?: string
  imageAlt?: string
  availableForSale?: boolean
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <AnimatedProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

