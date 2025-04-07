import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getEducationalResource } from "@/lib/sanity"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { PortableText } from "@/lib/sanity"
import { FileText, ExternalLink, Download } from "lucide-react"

interface ResourcePageProps {
  params: {
    category: string
    slug: string
  }
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const resource = await getEducationalResource(params.slug)

  if (!resource) {
    return {
      title: "Resource Not Found",
      description: "The requested resource could not be found.",
    }
  }

  return {
    title: resource.title,
    description: resource.excerpt,
    openGraph: {
      images: resource.featuredImage
        ? [
            {
              url: resource.featuredImage,
              alt: resource.title,
            },
          ]
        : [],
    },
  }
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const resource = await getEducationalResource(params.slug)

  if (!resource) {
    notFound()
  }

  return (
    <div className="py-12">
      <Container className="max-w-4xl">
        <div className="mb-8">
          <Badge className="mb-4">{resource.type}</Badge>
          <h1 className="text-4xl font-bold mb-4">{resource.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{resource.excerpt}</p>
          <p className="text-sm text-muted-foreground">Published on {formatDate(resource.publishedAt)}</p>
        </div>

        {resource.featuredImage && (
          <div className="mb-8">
            <div className="aspect-video overflow-hidden rounded-lg">
              <Image
                src={resource.featuredImage || "/placeholder.svg"}
                alt={resource.title}
                width={1200}
                height={675}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="prose prose-lg max-w-none mb-12">
          {resource.content ? (
            <PortableText value={resource.content} />
          ) : (
            <p>
              This is a placeholder for the resource content. In a real application, this would be rendered using a rich
              text renderer that converts the structured content from Sanity into React components.
            </p>
          )}
        </div>

        {resource.downloadableFiles && resource.downloadableFiles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Downloadable Resources</h2>
            <div className="grid gap-4">
              {resource.downloadableFiles.map((file: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="bg-light-mint p-3 rounded-full">
                    <FileText className="h-6 w-6 text-teal" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{file.title || "Downloadable File"}</h3>
                    {file.description && <p className="text-sm text-muted-foreground">{file.description}</p>}
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <a href={file.asset.url} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {resource.externalLinks && resource.externalLinks.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">External Resources</h2>
            <div className="grid gap-4">
              {resource.externalLinks.map((link: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="bg-light-mint p-3 rounded-full">
                    <ExternalLink className="h-6 w-6 text-teal" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{link.title}</h3>
                    {link.description && <p className="text-sm text-muted-foreground">{link.description}</p>}
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      Visit
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {resource.relatedResources && resource.relatedResources.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {resource.relatedResources.map((relatedResource: any) => (
                <Card key={relatedResource.id}>
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">
                      {relatedResource.type}
                    </Badge>
                    <CardTitle>{relatedResource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">{relatedResource.excerpt}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/resources/${relatedResource.category}/${relatedResource.slug}`}>Read More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}

