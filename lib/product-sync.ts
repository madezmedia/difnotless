import { getAllProducts } from "@/lib/shopify"

// Interface for mapped product data
export interface MappedProduct {
  id: string
  shopifyId: string
  title: string
  handle: string
  description: string
  price: string
  currencyCode: string
  images: {
    url: string
    altText?: string
  }[]
  variants: {
    id: string
    title: string
    price: string
    availableForSale: boolean
    inventoryQuantity: number
    selectedOptions: {
      name: string
      value: string
    }[]
  }[]
  tags: string[]
  collections: {
    id: string
    title: string
    handle: string
  }[]
  metafields: {
    namespace: string
    key: string
    value: string
  }[]
  createdAt: string
  updatedAt: string
}

// Function to map Shopify product data to our application structure
export function mapShopifyProduct(shopifyProduct: any): MappedProduct {
  return {
    id: shopifyProduct.id.replace("gid://shopify/Product/", ""),
    shopifyId: shopifyProduct.id,
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.description,
    price: shopifyProduct.price,
    currencyCode: shopifyProduct.currencyCode,
    images: shopifyProduct.images.map((image: any) => ({
      url: image.url,
      altText: image.altText,
    })),
    variants: shopifyProduct.variants.map((variant: any) => ({
      id: variant.id,
      title: variant.title,
      price: variant.price,
      availableForSale: variant.availableForSale,
      inventoryQuantity: variant.quantityAvailable || 0,
      selectedOptions: variant.selectedOptions,
    })),
    tags: shopifyProduct.tags || [],
    collections: shopifyProduct.collections || [],
    metafields: shopifyProduct.metafields || [],
    createdAt: shopifyProduct.createdAt || new Date().toISOString(),
    updatedAt: shopifyProduct.updatedAt || new Date().toISOString(),
  }
}

// Function to synchronize all products from Shopify
export async function syncAllProducts() {
  let hasNextPage = true
  let cursor: string | undefined = undefined
  const allProducts: MappedProduct[] = []

  try {
    while (hasNextPage) {
      const { products, pageInfo } = await getAllProducts(50, cursor)

      // Map products to our application structure
      const mappedProducts = products.map(mapShopifyProduct)
      allProducts.push(...mappedProducts)

      // Update pagination info
      hasNextPage = pageInfo.hasNextPage
      cursor = pageInfo.endCursor
    }

    console.log(`Successfully synchronized ${allProducts.length} products`)
    return allProducts
  } catch (error) {
    console.error("Error synchronizing products:", error)
    throw error
  }
}

// Function to get product availability status
export function getProductAvailability(product: MappedProduct) {
  // Check if any variant is available for sale
  const isAvailable = product.variants.some((variant) => variant.availableForSale)

  // Calculate total inventory across all variants
  const totalInventory = product.variants.reduce((sum, variant) => sum + variant.inventoryQuantity, 0)

  // Determine inventory status
  let inventoryStatus = "Out of Stock"
  if (isAvailable) {
    if (totalInventory > 10) {
      inventoryStatus = "In Stock"
    } else if (totalInventory > 0) {
      inventoryStatus = "Low Stock"
    } else {
      inventoryStatus = "Available for Backorder"
    }
  }

  return {
    isAvailable,
    totalInventory,
    inventoryStatus,
  }
}

