import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Resource {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  featuredImage: string | null
  type: string
  featured?: boolean
}

interface ResourceGridProps {
  resources: Resource[]
}

export function ResourceGrid({ resources }: ResourceGridProps) {
  if (!resources.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No resources found</p>
      </div>
    )
  }

  // Separate featured resources
  const featuredResources = resources.filter((resource) => resource.featured)
  const regularResources = resources.filter((resource) => !resource.featured)

  return (
    <div className="space-y-12">
      {featuredResources.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Featured Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredResources.map((resource) => (
              <FeaturedResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {regularResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  )
}

function FeaturedResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="overflow-hidden border-2 border-gold/30">
      <div className="grid md:grid-cols-2 h-full">
        <div className="relative">
          {resource.featuredImage ? (
            <Image
              src={resource.featuredImage || "/placeholder.svg"}
              alt={resource.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}
          <Badge className="absolute top-2 right-2 bg-gold text-black">Featured</Badge>
        </div>
        <div className="flex flex-col h-full">
          <CardHeader>
            <Badge variant="outline" className="w-fit mb-2">
              {resource.type}
            </Badge>
            <CardTitle>{resource.title}</CardTitle>
            <CardDescription>{resource.excerpt}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">{resource.excerpt}</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/resources/${resource.category}/${resource.slug}`}>Read More</Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="outline">{resource.type}</Badge>
          {resource.featured && <Badge className="bg-gold text-black">Featured</Badge>}
        </div>
        <CardTitle className="mt-3">{resource.title}</CardTitle>
        <CardDescription>{resource.excerpt}</CardDescription>
      </CardHeader>
      {resource.featuredImage && (
        <div className="px-6">
          <div className="aspect-video overflow-hidden rounded-md">
            <Image
              src={resource.featuredImage || "/placeholder.svg"}
              alt={resource.title}
              width={600}
              height={338}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{resource.excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/resources/${resource.category}/${resource.slug}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

