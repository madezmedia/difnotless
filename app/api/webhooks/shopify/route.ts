import { type NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"

// Verify Shopify webhook signature
function verifyShopifyWebhook(request: NextRequest) {
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256")
  const topic = request.headers.get("x-shopify-topic")
  const shop = request.headers.get("x-shopify-shop-domain")

  // In a production environment, you should verify the HMAC signature
  // This is a simplified version for demonstration
  if (!hmacHeader || !topic || !shop) {
    return false
  }

  // Verify the shop domain matches your Shopify store
  if (shop !== process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
    return false
  }

  return true
}

export async function POST(request: NextRequest) {
  // Verify the webhook is from Shopify
  if (!verifyShopifyWebhook(request)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
  }

  const topic = request.headers.get("x-shopify-topic")
  const body = await request.json()

  try {
    // Handle different webhook topics
    switch (topic) {
      case "products/create":
      case "products/update":
      case "products/delete":
        // Revalidate product and collection cache
        revalidateTag("products")
        revalidateTag("collections")
        break

      case "collections/create":
      case "collections/update":
      case "collections/delete":
        // Revalidate collection cache
        revalidateTag("collections")
        break

      case "inventory_levels/update":
        // Revalidate product cache for inventory updates
        revalidateTag("products")
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

