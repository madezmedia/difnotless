import { NextResponse } from "next/server"
import { getEducationalResources } from "@/lib/sanity"

export async function GET() {
  try {
    // Get all resources and filter for featured ones
    const allResources = await getEducationalResources()
    const featuredResources = allResources.filter((resource) => resource.featured).slice(0, 3)

    return NextResponse.json({ resources: featuredResources })
  } catch (error) {
    console.error("Error fetching featured resources:", error)
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
  }
}

