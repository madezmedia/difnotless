import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProduct } from "@/lib/shopify"
import { getProductSensoryDetails } from "@/lib/sanity"
import { ProductDetails } from "@/components/product/product-details"
// Import the enhanced components
import { EnhancedProductRecommendations } from "@/components/product/enhanced-product-recommendations"
import { RealTimeInventory } from "@/components/product/real-time-inventory"
// Import the RecentlyViewedProducts component
import { RecentlyViewedProducts } from "@/components/product/recently-viewed-products"

interface ProductPageProps {
  params: {
    handle: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.handle)

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    }
  }

  return {
    title: product.title,
    description: product.description.substring(0, 160),
    openGraph: {
      images: product.images[0]?.url
        ? [
            {
              url: product.images[0].url,
              width: product.images[0].width,
              height: product.images[0].height,
              alt: product.images[0].altText || product.title,
            },
          ]
        : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.handle)

  if (!product) {
    notFound()
  }

  // Get sensory details from Sanity
  const sensoryDetails = await getProductSensoryDetails(product.id)

  // Combine product data with sensory details
  const enrichedProduct = {
    ...product,
    sensoryDetails: sensoryDetails || {
      material: "100% organic cotton",
      weight: "5.3 oz/yd²",
      tagType: "Heat transfer (tagless)",
      printMethod: "Water-based screen print",
      materialDetails: "Premium ring-spun cotton for softness",
      careInstructions: {
        washing: "Machine wash cold with like colors",
        drying: "Tumble dry low or hang to dry",
        ironing: "Iron on low heat if needed",
        special: "Avoid fabric softeners",
      },
      features: [
        "Sensory-friendly fabric",
        "Tagless design",
        "Flat seams for comfort",
        "Pre-washed for softness",
        "Ethically produced",
      ],
      sensorySuitability: "Suitable for all sensory needs, especially those with tactile sensitivities",
    },
  }

  return (
    <div className="container mx-auto py-12">
      <ProductDetails product={enrichedProduct} />

      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-8">You might also like</h2>
        <Suspense fallback={<div>Loading recommendations...</div>}>
          <EnhancedProductRecommendations productId={product.id} />
        </Suspense>
      </div>

      <div className="mt-20">
        <RecentlyViewedProducts currentProductId={product.handle} />
      </div>

      <div className="mt-4">
        <RealTimeInventory productId={product.id} pollingInterval={30000} />
      </div>
    </div>
  )
}

