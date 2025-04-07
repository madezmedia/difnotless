import { Suspense } from "react"
import Link from "next/link"
import { getCollections, getCollection } from "@/lib/shopify"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductGrid } from "@/components/product/product-grid"
import { FeaturedProducts } from "@/components/product/featured-products"
import { AnimatedHero } from "@/components/home/animated-hero"
import { FeatureCard } from "@/components/home/feature-card"
import { TaglessIcon, PremiumIcon, MinimalIcon } from "@/components/icons/feature-icons"
import { FeaturedBlogPosts } from "@/components/home/featured-blog-posts"
import { FeaturedResources } from "@/components/home/featured-resources"
import { Container } from "@/components/ui/container"

export default async function Home() {
  return (
    <div className="bg-gradient-soft-vertical">
      {/* Hero Section - Now using the animated hero */}
      <AnimatedHero />

      {/* Sensory Features Section - Now with smoother transition */}
      <section className="py-16 bg-soft-cream bg-opacity-70 backdrop-blur-sm section-overlap-sm">
        <Container className="content-container">
          <div className="text-center mb-12 staggered-children">
            <h2 className="text-3xl font-bold mb-4 text-glow">Sensory-Friendly Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our apparel is designed with sensory needs in mind, featuring premium materials and thoughtful
              construction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<TaglessIcon className="w-6 h-6 text-gold" />}
              title="Tagless Design"
              description="All our products feature heat-transfer labels or tear-away tags that can be completely removed for maximum comfort."
            />

            <FeatureCard
              icon={<PremiumIcon className="w-6 h-6 text-teal" />}
              title="Premium Materials"
              description="Soft, breathable fabrics with high-quality ring-spun and organic cotton blends for exceptional comfort."
              className="md:translate-y-4"
            />

            <FeatureCard
              icon={<MinimalIcon className="w-6 h-6 text-purple" />}
              title="Minimal Seams"
              description="Side-seamed construction with flat or covered seams to reduce irritation and provide a better fit."
            />
          </div>
        </Container>

        <hr className="subtle-divider mt-16" />
      </section>

      {/* Featured Products Section - Seamless transition */}
      <section className="py-16 bg-gradient-soft-vertical-reverse">
        <Container>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold gradient-text-animated">Featured Products</h2>
            <Button asChild variant="outline" className="btn-animated">
              <Link href="/collections">View All</Link>
            </Button>
          </div>

          <Suspense fallback={<div>Loading products...</div>}>
            <FeaturedProducts />
          </Suspense>
        </Container>

        <hr className="subtle-divider mt-16" />
      </section>

      {/* Collection Tabs - Integrated with previous section */}
      <section className="py-16 bg-gradient-soft-vertical">
        <Container>
          <div className="text-center mb-10 staggered-children">
            <h2 className="text-3xl font-bold mb-4">Shop By Collection</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our thoughtfully crafted collections designed for different audiences and needs.
            </p>
          </div>

          <Suspense fallback={<div>Loading collections...</div>}>
            <CollectionTabs />
          </Suspense>
        </Container>

        <hr className="subtle-divider mt-16" />
      </section>

      {/* Featured Blog Posts Section */}
      <section className="py-16 bg-gradient-soft-vertical-reverse">
        <Container>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold gradient-text-animated">Latest from Our Blog</h2>
            <Button asChild variant="outline" className="btn-animated">
              <Link href="/blog">View All Posts</Link>
            </Button>
          </div>

          <FeaturedBlogPosts />
        </Container>

        <hr className="subtle-divider mt-16" />
      </section>

      {/* Educational Resources - Seamless gradient transition */}
      <section className="py-16 bg-gradient-soft section-transition">
        <Container className="content-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-glow">Featured Resources</h2>
            <Button asChild variant="outline" className="btn-animated">
              <Link href="/resources">View All Resources</Link>
            </Button>
          </div>

          <FeaturedResources />
        </Container>
      </section>

      {/* Newsletter Section - Smoother transition */}
      <section className="py-16 bg-gradient-to-b from-soft-lavender via-gray-700 to-gray-800 text-white relative overflow-hidden section-overlap-sm">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise-pattern.png')] opacity-[0.03] mix-blend-overlay"></div>
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gold/10 blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal/10 blur-3xl"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-2xl mx-auto text-center glass-effect p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-4 text-glow">Join Our Community</h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter for educational resources, new product releases, and exclusive discounts.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white flex-1 focus:ring-2 focus:ring-teal focus:outline-none"
              />
              <Button className="bg-gradient-to-r from-gold to-teal text-black hover:from-gold/90 hover:to-teal/90 btn-animated">
                Subscribe
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

async function CollectionTabs() {
  const collections = await getCollections()

  return (
    <Tabs defaultValue={collections[0]?.handle || ""} className="w-full">
      <TabsList className="mb-8 flex justify-center bg-white/50 backdrop-blur-sm p-1 rounded-full border border-gray-100/50 dark:border-gray-800/50 dark:bg-gray-800/50">
        {collections.map((collection) => (
          <TabsTrigger key={collection.id} value={collection.handle} className="rounded-full">
            {collection.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {collections.map((collection) => (
        <TabsContent key={collection.id} value={collection.handle}>
          <Suspense fallback={<div>Loading products...</div>}>
            <CollectionProducts handle={collection.handle} />
          </Suspense>

          <div className="mt-8 text-center">
            <Button asChild className="btn-animated">
              <Link href={`/collections/${collection.handle}`}>View All {collection.title} Products</Link>
            </Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

async function CollectionProducts({ handle }: { handle: string }) {
  const collection = await getCollection(handle)

  if (!collection) {
    return <div>Collection not found</div>
  }

  return <ProductGrid products={collection.products.slice(0, 4)} />
}

