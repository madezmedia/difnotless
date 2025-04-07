import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { getCollections } from "@/lib/shopify"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Collections",
  description: "Browse our collections of sensory-friendly apparel celebrating AAC and autism acceptance.",
}

export default function CollectionsPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Collections</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore our thoughtfully crafted collections designed for different audiences and needs.
        </p>
      </div>

      <Suspense fallback={<div>Loading collections...</div>}>
        <CollectionsList />
      </Suspense>
    </div>
  )
}

async function CollectionsList() {
  const collections = await getCollections()

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {collections.map((collection) => (
        <Link key={collection.id} href={`/collections/${collection.handle}`}>
          <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
            <div className="aspect-video relative">
              {collection.image ? (
                <Image
                  src={collection.image.url || "/placeholder.svg"}
                  alt={collection.image.altText || collection.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h2 className="text-3xl font-bold text-white">{collection.title}</h2>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                {collection.description || `Browse our ${collection.title} collection.`}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

