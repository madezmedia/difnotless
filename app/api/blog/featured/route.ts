import { NextResponse } from "next/server"
import { getBlogPosts } from "@/lib/sanity"

export async function GET() {
  try {
    const posts = await getBlogPosts(3)

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching featured blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

