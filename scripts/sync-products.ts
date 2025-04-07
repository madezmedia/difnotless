import { syncAllProducts } from "@/lib/product-sync"

async function main() {
  console.log("Starting product synchronization...")

  try {
    const products = await syncAllProducts()
    console.log(`Successfully synchronized ${products.length} products`)

    // Here you could save the products to a database if needed
    // For now, we're just using Shopify as the source of truth
  } catch (error) {
    console.error("Error synchronizing products:", error)
    process.exit(1)
  }
}

main()

