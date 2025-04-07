import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getBlogPost } from "@/lib/sanity"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { PortableText } from "@/lib/sanity"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: post.featuredImage
        ? [
            {
              url: post.featuredImage,
              alt: post.title,
            },
          ]
        : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="py-12">
      <Container className="max-w-4xl">
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((category) => (
              <Link key={category.id} href={`/blog?category=${category.slug.current}`}>
                <Badge variant="outline" style={{ borderColor: category.color, color: category.color }}>
                  {category.title}
                </Badge>
              </Link>
            ))}
          </div>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              {post.author.image && (
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <Image
                    src={post.author.image || "/placeholder.svg"}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <span>{post.author.name}</span>
              {post.author.role && (
                <span className="text-xs bg-light-mint px-2 py-0.5 rounded-full">{post.author.role}</span>
              )}
            </div>
            <span>•</span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>

        {post.featuredImage && (
          <div className="mb-8">
            <div className="aspect-video overflow-hidden rounded-lg">
              <Image
                src={post.featuredImage || "/placeholder.svg"}
                alt={post.title}
                width={1200}
                height={675}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          {post.content ? (
            <PortableText value={post.content} />
          ) : (
            <p>
              This is a placeholder for the blog post content. In a real application, this would be rendered using a
              rich text renderer that converts the structured content from Sanity into React components.
            </p>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {post.author.bio && (
          <div className="mt-12 p-6 bg-light-mint rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              {post.author.image && (
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={post.author.image || "/placeholder.svg"}
                    alt={post.author.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold">{post.author.name}</h3>
                <p className="text-sm text-muted-foreground">{post.author.role || "Author"}</p>
              </div>
            </div>
            <p>{post.author.bio}</p>

            {post.author.social && Object.values(post.author.social).some(Boolean) && (
              <div className="mt-4 flex gap-4">
                {post.author.social.twitter && (
                  <a
                    href={post.author.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal hover:underline"
                  >
                    Twitter
                  </a>
                )}
                {post.author.social.instagram && (
                  <a
                    href={post.author.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal hover:underline"
                  >
                    Instagram
                  </a>
                )}
                {post.author.social.linkedin && (
                  <a
                    href={post.author.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal hover:underline"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {post.relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {post.relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id}>
                  <div className="aspect-video relative">
                    {relatedPost.featuredImage ? (
                      <Image
                        src={relatedPost.featuredImage || "/placeholder.svg"}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{relatedPost.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">{relatedPost.excerpt}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/blog/${relatedPost.slug}`}>Read More</Link>
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

