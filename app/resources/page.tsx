import { Suspense } from "react"
import type { Metadata } from "next"
import { getEducationalResources } from "@/lib/sanity"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResourceGrid } from "@/components/resources/resource-grid"
import { Container } from "@/components/ui/container"

export const metadata: Metadata = {
  title: "Educational Resources",
  description: "Learn more about AAC, autism acceptance, and sensory-friendly approaches.",
}

export default function ResourcesPage() {
  return (
    <div className="py-12">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Educational Resources</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Learn more about AAC, autism acceptance, and sensory-friendly approaches.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12">Loading resources...</div>}>
          <ResourceTabs />
        </Suspense>
      </Container>
    </div>
  )
}

async function ResourceTabs() {
  const resources = await getEducationalResources()

  // Group resources by category
  const aacResources = resources.filter((resource) => resource.category === "aac")
  const autismResources = resources.filter((resource) => resource.category === "autism")
  const sensoryResources = resources.filter((resource) => resource.category === "sensory")

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-8 flex justify-center">
        <TabsTrigger value="all">All Resources</TabsTrigger>
        <TabsTrigger value="aac">AAC</TabsTrigger>
        <TabsTrigger value="autism">Autism Acceptance</TabsTrigger>
        <TabsTrigger value="sensory">Sensory Resources</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <ResourceGrid resources={resources} />
      </TabsContent>

      <TabsContent value="aac">
        <ResourceGrid resources={aacResources} />
      </TabsContent>

      <TabsContent value="autism">
        <ResourceGrid resources={autismResources} />
      </TabsContent>

      <TabsContent value="sensory">
        <ResourceGrid resources={sensoryResources} />
      </TabsContent>
    </Tabs>
  )
}

