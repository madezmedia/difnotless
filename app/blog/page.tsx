import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getBlogPosts, getCategories } from "@/lib/sanity"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/ui/container"

export const metadata: Metadata = {
  title: "Blog",
  description: "Read the latest articles about AAC, autism acceptance, and sensory-friendly approaches.",
}

export default function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const categorySlug = typeof searchParams.category === "string" ? searchParams.category : undefined

  return (
    <div className="py-12">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Read the latest articles about AAC, autism acceptance, and sensory-friendly approaches.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12">Loading categories...</div>}>
          <CategoryFilter currentCategory={categorySlug} />
        </Suspense>

        <Suspense fallback={<div className="text-center py-12">Loading blog posts...</div>}>
          <BlogPosts categorySlug={categorySlug} />
        </Suspense>
      </Container>
    </div>
  )
}

async function CategoryFilter({ currentCategory }: { currentCategory?: string }) {
  const categories = await getCategories()

  if (!categories.length) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      <Link href="/blog">
        <Badge variant={!currentCategory ? "default" : "outline"} className="cursor-pointer text-sm py-1.5 px-3">
          All Posts
        </Badge>
      </Link>
      {categories.map((category) => (
        <Link key={category.id} href={`/blog?category=${category.slug}`}>
          <Badge
            variant={currentCategory === category.slug ? "default" : "outline"}
            className="cursor-pointer text-sm py-1.5 px-3"
            style={
              category.color
                ? {
                    backgroundColor: currentCategory === category.slug ? category.color : "transparent",
                    color: currentCategory === category.slug ? "white" : category.color,
                    borderColor: category.color,
                  }
                : {}
            }
          >
            {category.title}
          </Badge>
        </Link>
      ))}
    </div>
  )
}

async function BlogPosts({ categorySlug }: { categorySlug?: string }) {
  const posts = await getBlogPosts(100, categorySlug)

  if (!posts.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No blog posts found</p>
      </div>
    )
  }

  // Feature the first post
  const featuredPost = posts[0]
  const regularPosts = posts.slice(1)

  return (
    <div className="space-y-12">
      {/* Featured Post */}
      <div className="rounded-lg overflow-hidden border">
        <div className="grid md:grid-cols-2">
          <div className="aspect-video relative">
            {featuredPost.featuredImage ? (
              <Image
                src={featuredPost.featuredImage || "/placeholder.svg"}
                alt={featuredPost.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>
          <div className="p-6 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-2">
              {featuredPost.categories?.map((category: any) => (
                <Badge
                  key={category._id}
                  variant="outline"
                  style={{ borderColor: category.color, color: category.color }}
                >
                  {category.title}
                </Badge>
              ))}
            </div>
            <div className="mb-2 text-sm text-muted-foreground">{formatDate(featuredPost.publishedAt)}</div>
            <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
            <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
            <Button asChild>
              <Link href={`/blog/${featuredPost.slug}`}>Read More</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Regular Posts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <div className="aspect-video relative">
              {post.featuredImage ? (
                <Image src={post.featuredImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                {post.categories?.map((category: any) => (
                  <Badge
                    key={category._id}
                    variant="outline"
                    style={{ borderColor: category.color, color: category.color }}
                  >
                    {category.title}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-muted-foreground mb-2">{formatDate(post.publishedAt)}</div>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/blog/${post.slug}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

