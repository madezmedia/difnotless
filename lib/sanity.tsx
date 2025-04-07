import { createClient } from "next-sanity"
import imageUrlBuilder from "@sanity/image-url"
import { PortableText as PortableTextComponent } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"

// Ensure the dataset name follows Sanity's requirements
const sanitizeDatasetName = (dataset: string | undefined): string => {
  // Default to 'production' if no dataset is provided
  if (!dataset) return "production"

  // Remove any characters that aren't allowed
  // Only lowercase letters, numbers, underscores, and dashes are allowed
  const sanitized = dataset.toLowerCase().replace(/[^a-z0-9_-]/g, "")

  // Ensure it doesn't start with a tilde (as per error message)
  return sanitized.startsWith("~") ? sanitized.substring(1) : sanitized
}

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: sanitizeDatasetName(process.env.NEXT_PUBLIC_SANITY_DATASET),
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
})

const builder = imageUrlBuilder(client)

export function urlForImage(source: any) {
  return builder.image(source)
}

// Portable Text components for rendering rich content
export const PortableText = (props: { value: PortableTextBlock[] }) => {
  return (
    <PortableTextComponent
      value={props.value}
      components={{
        types: {
          image: ({ value }) => {
            if (!value?.asset?._ref) {
              return null
            }
            return (
              <div className="my-6 space-y-2">
                <img
                  className="mx-auto rounded-lg"
                  alt={value.alt || " "}
                  src={urlForImage(value).width(800).height(450).fit("max").auto("format").url() || "/placeholder.svg"}
                />
                {value.caption && <div className="text-center text-sm text-gray-500">{value.caption}</div>}
              </div>
            )
          },
        },
        marks: {
          link: ({ children, value }) => {
            const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined
            return (
              <a href={value.href} rel={rel} className="text-teal hover:underline">
                {children}
              </a>
            )
          },
        },
      }}
    />
  )
}

export async function getEducationalResources(category?: string, limit = 9) {
  try {
    const query = category
      ? `*[_type == "educationalResource" && category == $category][0...$limit] | order(publishedAt desc)`
      : `*[_type == "educationalResource"][0...$limit] | order(publishedAt desc)`

    const params = { category, limit }

    const resources = await client.fetch(query, params)

    // Handle case where resources is undefined or null
    if (!resources) {
      console.warn("No resources returned from Sanity query")
      return []
    }

    return resources.map((resource: any) => ({
      id: resource._id,
      title: resource.title,
      slug: resource.slug.current,
      excerpt: resource.excerpt,
      category: resource.category,
      featuredImage: resource.featuredImage ? urlForImage(resource.featuredImage).url() : null,
      publishedAt: resource.publishedAt,
      featured: resource.featured || false,
      type: resource.resourceType,
    }))
  } catch (error) {
    console.error("Error fetching educational resources:", error)
    return [] // Return empty array in case of error
  }
}

export async function getEducationalResource(slug: string) {
  try {
    const query = `*[_type == "educationalResource" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      excerpt,
      content,
      category,
      resourceType,
      featuredImage,
      publishedAt,
      featured,
      "relatedResources": relatedResources[]-> {
        _id,
        title,
        slug,
        excerpt,
        category,
        featuredImage,
        resourceType
      },
      downloadableFiles,
      externalLinks
    }`

    const params = { slug }

    const resource = await client.fetch(query, params)

    if (!resource) return null

    return {
      id: resource._id,
      title: resource.title,
      slug: resource.slug.current,
      excerpt: resource.excerpt,
      content: resource.content,
      category: resource.category,
      featuredImage: resource.featuredImage ? urlForImage(resource.featuredImage).url() : null,
      publishedAt: resource.publishedAt,
      featured: resource.featured || false,
      type: resource.resourceType,
      relatedResources: resource.relatedResources
        ? resource.relatedResources.map((related: any) => ({
            id: related._id,
            title: related.title,
            slug: related.slug.current,
            excerpt: related.excerpt,
            category: related.category,
            featuredImage: related.featuredImage ? urlForImage(related.featuredImage).url() : null,
            type: related.resourceType,
          }))
        : [],
      downloadableFiles: resource.downloadableFiles,
      externalLinks: resource.externalLinks,
    }
  } catch (error) {
    console.error("Error fetching educational resource:", error)
    return null
  }
}

export async function getBlogPosts(limit = 9, category?: string) {
  try {
    const query = category
      ? `*[_type == "post" && $category in categories[]->slug.current][0...$limit] | order(publishedAt desc)`
      : `*[_type == "post"][0...$limit] | order(publishedAt desc)`

    const params = { limit, category }

    const posts = await client.fetch(query, params)

    // Handle case where posts is undefined or null
    if (!posts) {
      console.warn("No blog posts returned from Sanity query")
      return []
    }

    return posts.map((post: any) => ({
      id: post._id,
      title: post.title,
      slug: post.slug.current,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage ? urlForImage(post.featuredImage).url() : null,
      publishedAt: post.publishedAt,
      categories: post.categories,
      author: {
        name: post.author?.name || "Unknown",
        image: post.author?.image ? urlForImage(post.author.image).url() : null,
      },
      tags: post.tags || [],
    }))
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return [] // Return empty array in case of error
  }
}

export async function getBlogPost(slug: string) {
  try {
    const query = `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      publishedAt,
      "categories": categories[]-> {
        _id,
        title,
        slug,
        description,
        color
      },
      "author": author-> {
        _id,
        name,
        bio,
        image,
        role,
        social
      },
      tags,
      "relatedPosts": *[_type == "post" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc)[0...3]{
        _id,
        title,
        slug,
        excerpt,
        featuredImage,
        publishedAt,
        "categories": categories[]-> {
          title,
          slug
        }
      }
    }`

    const params = { slug }

    const post = await client.fetch(query, params)

    if (!post) return null

    return {
      id: post._id,
      title: post.title,
      slug: post.slug.current,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage ? urlForImage(post.featuredImage).url() : null,
      publishedAt: post.publishedAt,
      categories: post.categories || [],
      author: {
        id: post.author?._id,
        name: post.author?.name || "Unknown",
        bio: post.author?.bio,
        image: post.author?.image ? urlForImage(post.author.image).url() : null,
        role: post.author?.role,
        social: post.author?.social,
      },
      tags: post.tags || [],
      relatedPosts:
        post.relatedPosts?.map((relatedPost: any) => ({
          id: relatedPost._id,
          title: relatedPost.title,
          slug: relatedPost.slug.current,
          excerpt: relatedPost.excerpt,
          featuredImage: relatedPost.featuredImage ? urlForImage(relatedPost.featuredImage).url() : null,
          publishedAt: relatedPost.publishedAt,
          categories: relatedPost.categories || [],
        })) || [],
    }
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export async function getCategories() {
  try {
    const query = `*[_type == "category"] | order(title asc)`
    const categories = await client.fetch(query)

    return categories.map((category: any) => ({
      id: category._id,
      title: category.title,
      slug: category.slug.current,
      description: category.description,
      color: category.color,
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getProductSensoryDetails(productId: string) {
  try {
    const query = `*[_type == "productSensoryDetails" && shopifyProductId == $productId][0]`
    const params = { productId }

    const details = await client.fetch(query, params)

    if (!details) return null

    return {
      material: details.material,
      weight: details.weight,
      tagType: details.tagType,
      printMethod: details.printMethod,
      materialDetails: details.materialDetails,
      careInstructions: details.careInstructions,
      features: details.features,
      sensorySuitability: details.sensorySuitability,
    }
  } catch (error) {
    console.error("Error fetching product sensory details:", error)
    return null
  }
}
