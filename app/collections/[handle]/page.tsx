import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import { getCollection } from "@/lib/shopify"
import { ProductGrid } from "@/components/product/product-grid"
import { CollectionFilters } from "@/components/product/collection-filters"

interface CollectionPageProps {
  params: {
    handle: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const collection = await getCollection(params.handle)

  if (!collection) {
    return {
      title: "Collection Not Found",
      description: "The requested collection could not be found.",
    }
  }

  return {
    title: collection.title,
    description: collection.description || `Browse our ${collection.title} collection.`,
    openGraph: {
      images: collection.image
        ? [
            {
              url: collection.image.url,
              alt: collection.image.altText || collection.title,
            },
          ]
        : [],
    },
  }
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const collection = await getCollection(params.handle)

  if (!collection) {
    notFound()
  }

  return (
    <div>
      {/* Collection Hero */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        {collection.image ? (
          <Image
            src={collection.image.url || "/placeholder.svg"}
            alt={collection.image.altText || collection.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{collection.title}</h1>
            {collection.description && <p className="text-lg md:text-xl">{collection.description}</p>}
          </div>
        </div>
      </div>

      {/* Products with Filters */}
      <div className="container mx-auto py-12">
        <Suspense fallback={<div>Loading filters...</div>}>
          <CollectionFilters products={collection.products} />
        </Suspense>

        <Suspense fallback={<div>Loading products...</div>}>
          <ProductGrid products={collection.products} />
        </Suspense>
      </div>
    </div>
  )
}

