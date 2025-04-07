import { GraphQLClient } from "graphql-request"

// Add validation for Shopify credentials at the top of the file
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN

// Client-side only has access to NEXT_PUBLIC_* variables
// Server-side can access both NEXT_PUBLIC_* and regular env variables
const storefrontAccessToken = typeof window !== "undefined" 
  ? process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN 
  : (process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN)

// Validate required environment variables
if (!domain) {
  console.error("Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN environment variable")
}

if (!storefrontAccessToken) {
  console.error("Missing Shopify Storefront Access Token. Ensure NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN is set in .env.local")
}

// Ensure we have a valid endpoint URL even if domain is undefined
const endpoint = domain 
  ? `https://${domain}/api/2024-01/graphql.json`
  : "https://api.shopify.com/api/2024-01/graphql.json" // Fallback URL

// Add additional headers and options to improve reliability
export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken || "",
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "Different-Not-Less-Headless/1.0",
  },
  // Custom fetch implementation with timeout and better error handling
  fetch: (url, options) => {
    // Add custom fetch with keep-alive and better error handling
    const timeoutMs = 30000; // 30 seconds timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    return fetch(url, {
      ...options,
      signal: controller.signal,
      keepalive: true,
      cache: "no-store",
      next: { revalidate: 0 },
    }).finally(() => clearTimeout(timeoutId));
  },
})

// Fetch options with cache tags for revalidation
const fetchOptions = {
  next: {
    tags: ["products", "collections"],
  },
}

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Check if the device is online
const isOnline = () => {
  return isBrowser ? navigator.onLine : true
}

// Improved executeQuery function with better error handling and retry logic
async function executeQuery(query: string, variables?: any, retries = 3) {
  // If we're offline, fail fast with a specific error
  if (isBrowser && !isOnline()) {
    throw new Error("You appear to be offline. Please check your internet connection.")
  }

  let lastError

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Add timeout to the request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // Increase to 20 second timeout

      console.log(`Attempt ${attempt + 1}/${retries}: Executing GraphQL query...`)

      // Use request with proper parameter types
      const result = await shopifyClient.request(query, variables)
      clearTimeout(timeoutId)

      console.log(`Attempt ${attempt + 1}/${retries}: Query successful`)
      return result
    } catch (error: any) {
      lastError = error
      console.error(`Shopify GraphQL Error (Attempt ${attempt + 1}/${retries}):`, error.message || "Unknown error")

      // Enhanced error logging
      if (error.response?.errors) {
        console.error("GraphQL Errors:", JSON.stringify(error.response.errors, null, 2))
      }

      if (error.request) {
        console.error("Request details:", {
          url: typeof error.request.url === "string" ? error.request.url : "unknown",
          method: error.request.method || "unknown",
        })
      }

      // Check if it's a network error, timeout, or CORS issue
      const isNetworkError =
        error.name === "AbortError" ||
        error.message?.includes("network") ||
        error.message?.includes("failed to fetch") ||
        error.message?.includes("CORS") ||
        error.message?.includes("Failed to fetch") ||
        error.code === "ECONNREFUSED" ||
        error.code === "ENOTFOUND" ||
        error.code === "ETIMEDOUT"

      if (isNetworkError) {
        // Wait before retrying (exponential backoff)
        const backoffTime = Math.pow(2, attempt) * 1000 // Increase backoff time
        console.log(`Network error detected, retrying in ${backoffTime}ms...`)
        await new Promise((resolve) => setTimeout(resolve, backoffTime))
        continue
      }

      // For other errors, log details and break the retry loop
      if (error.response?.errors) {
        console.error("GraphQL Errors:", error.response.errors)
      }
      break
    }
  }

  // If we've exhausted retries or hit a non-retryable error
  throw new Error(`Shopify API request failed after ${retries} attempts: ${lastError?.message || "Unknown error"}`)
}

// Add this function after the executeQuery function
export async function testShopifyConnection() {
  console.log("Testing Shopify connection...")

  try {
    const query = /* GraphQL */ `
      query {
        shop {
          name
          primaryDomain {
            url
          }
        }
      }
    `

    const result = await executeQuery(query)
    console.log("Shopify connection successful:", result)
    return { success: true, data: result }
  } catch (error) {
    console.error("Shopify connection failed:", error)
    return { success: false, error }
  }
}

export async function getCollections() {
  const query = /* GraphQL */ `
    query GetCollections {
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `

  const result = await executeQuery(query)
  const { collections } = result as { collections: { edges: Array<{ node: any }> } }

  return collections.edges.map(({ node }) => node)
}

export async function getCollection(handle: string) {
  const query = /* GraphQL */ `
    query GetCollection($handle: String!) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        image {
          url
          altText
        }
        products(first: 24) {
          edges {
            node {
              id
              title
              handle
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const variables = { handle }
  const result = await executeQuery(query, variables)
  const { collection } = result as { collection: any }

  if (!collection) return null

  return {
    ...collection,
    products: collection.products.edges.map(({ node }: any) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description,
      price: node.priceRange.minVariantPrice.amount,
      currencyCode: node.priceRange.minVariantPrice.currencyCode,
      image: node.images.edges[0]?.node.url,
      imageAlt: node.images.edges[0]?.node.altText,
      variantId: node.variants.edges[0]?.node.id,
      availableForSale: node.variants.edges[0]?.node.availableForSale,
    })),
  }
}

export async function getProduct(handle: string) {
  const query = /* GraphQL */ `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        tags
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              quantityAvailable
              sku
              barcode
            }
          }
        }
        collections(first: 5) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
        metafields(first: 10) {
          edges {
            node {
              namespace
              key
              value
            }
          }
        }
      }
    }
  `

  const variables = { handle }
  const result = await executeQuery(query, variables)
  const { product } = result as { product: any }

  if (!product) return null

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    tags: product.tags,
    price: product.priceRange.minVariantPrice.amount,
    currencyCode: product.priceRange.minVariantPrice.currencyCode,
    images: product.images.edges.map(({ node }: any) => ({
      url: node.url,
      altText: node.altText,
      width: node.width,
      height: node.height,
    })),
    variants: product.variants.edges.map(({ node }: any) => ({
      id: node.id,
      title: node.title,
      availableForSale: node.availableForSale,
      price: node.price.amount,
      currencyCode: node.price.currencyCode,
      selectedOptions: node.selectedOptions,
      quantityAvailable: node.quantityAvailable,
      sku: node.sku,
      barcode: node.barcode,
    })),
    collections: product.collections.edges.map(({ node }: any) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
    })),
    metafields: product.metafields.edges.map(({ node }: any) => ({
      namespace: node.namespace,
      key: node.key,
      value: node.value,
    })),
  }
}

// Enhanced product recommendations with filtering options
export async function getProductRecommendations(productId: string, limit = 4) {
  const query = /* GraphQL */ `
    query GetProductRecommendations($productId: ID!, $first: Int!) {
      productRecommendations(productId: $productId) {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              availableForSale
            }
          }
        }
      }
      
      # Fallback recommendations if the above returns fewer than requested
      products(first: $first, sortKey: BEST_SELLING) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `

  const variables = { productId, first: limit }
  const result = await executeQuery(query, variables)
  const { productRecommendations, products } = result as { 
    productRecommendations: any[], 
    products: { edges: Array<{ node: any }> } 
  }

  // Map recommendations to our format
  const mappedRecommendations = productRecommendations.map((product: any) => ({
    id: product.id,
    title: product.title,
    handle: product.handle,
    price: product.priceRange.minVariantPrice.amount,
    currencyCode: product.priceRange.minVariantPrice.currencyCode,
    image: product.images.edges[0]?.node.url,
    imageAlt: product.images.edges[0]?.node.altText,
    variantId: product.variants.edges[0]?.node.id,
    availableForSale: product.variants.edges[0]?.node.availableForSale,
  }))

  // If we don't have enough recommendations, add some best sellers
  // but filter out the current product and any duplicates
  if (mappedRecommendations.length < limit) {
    const bestSellers = products.edges
      .map(({ node }: any) => ({
        id: node.id,
        title: node.title,
        handle: node.handle,
        price: node.priceRange.minVariantPrice.amount,
        currencyCode: node.priceRange.minVariantPrice.currencyCode,
        image: node.images.edges[0]?.node.url,
        imageAlt: node.images.edges[0]?.node.altText,
        variantId: node.variants.edges[0]?.node.id,
        availableForSale: node.variants.edges[0]?.node.availableForSale,
      }))
      .filter(
        (product: any) => product.id !== productId && !mappedRecommendations.some((rec: any) => rec.id === product.id),
      )

    // Combine and limit to requested amount
    return [...mappedRecommendations, ...bestSellers].slice(0, limit)
  }

  return mappedRecommendations
}

export async function createCart() {
  console.log("Creating cart...")

  // Check if we're offline first
  if (isBrowser && !isOnline()) {
    console.warn("Creating offline cart - device is offline")
    return {
      id: `offline-${Date.now()}`,
      checkoutUrl: "#",
    }
  }

  const mutation = /* GraphQL */ `
    mutation CreateCart {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  try {
    console.log("Executing cartCreate mutation...")
    const result = await executeQuery(mutation)
    const { cartCreate } = result as { cartCreate: any }

    // Check for user errors
    if (cartCreate.userErrors && cartCreate.userErrors.length > 0) {
      console.error("Cart creation returned user errors:", cartCreate.userErrors)
      throw new Error(`Cart creation failed: ${cartCreate.userErrors[0].message}`)
    }

    if (!cartCreate.cart) {
      console.error("Cart creation returned no cart object")
      throw new Error("Cart creation failed: No cart returned")
    }

    console.log("Cart created successfully:", cartCreate.cart.id)
    return cartCreate.cart
  } catch (error) {
    console.error("Failed to create cart:", error)

    // Try an alternative approach - direct fetch instead of GraphQL client
    try {
      console.log("Attempting alternative cart creation method...")
      const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token": storefrontAccessToken || "",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: mutation,
        }),
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.data?.cartCreate?.cart) {
        console.log("Alternative cart creation successful:", data.data.cartCreate.cart.id)
        return data.data.cartCreate.cart
      }

      throw new Error("Alternative cart creation failed")
    } catch (altError) {
      console.error("Alternative cart creation also failed:", altError)

      // Return a fallback offline cart as last resort
      console.warn("Using fallback offline cart due to API issues")
      return {
        id: `offline-${Date.now()}`,
        checkoutUrl: "#",
      }
    }
  }
}

export async function addToCart(cartId: string, variantId: string, quantity: number) {
  const mutation = /* GraphQL */ `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          estimatedCost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `

  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity,
      },
    ],
  }

  const result = await executeQuery(mutation, variables)
  const { cartLinesAdd } = result as { cartLinesAdd: any }
  return cartLinesAdd.cart
}

export async function updateCartItem(cartId: string, lineId: string, quantity: number) {
  const mutation = /* GraphQL */ `
    mutation UpdateCartItem($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          estimatedCost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `

  const variables = {
    cartId,
    lines: [
      {
        id: lineId,
        quantity,
      },
    ],
  }

  const result = await executeQuery(mutation, variables)
  const { cartLinesUpdate } = result as { cartLinesUpdate: any }
  return cartLinesUpdate.cart
}

export async function removeCartItem(cartId: string, lineId: string) {
  const mutation = /* GraphQL */ `
    mutation RemoveCartItem($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          estimatedCost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `

  const variables = {
    cartId,
    lineIds: [lineId],
  }

  const result = await executeQuery(mutation, variables)
  const { cartLinesRemove } = result as { cartLinesRemove: any }
  return cartLinesRemove.cart
}

export async function getCart(cartId: string) {
  const query = /* GraphQL */ `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        estimatedCost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
        buyerIdentity {
          email
          phone
          customer {
            id
            email
            firstName
            lastName
          }
        }
        discountCodes {
          code
          applicable
        }
      }
    }
  `

  const variables = { cartId }
  const result = await executeQuery(query, variables)
  const { cart } = result as { cart: any }

  if (!cart) return null

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    lines: cart.lines.edges.map(({ node }: any) => ({
      id: node.id,
      quantity: node.quantity,
      merchandise: {
        id: node.merchandise.id,
        title: node.merchandise.title,
        product: {
          title: node.merchandise.product.title,
          handle: node.merchandise.product.handle,
          image: node.merchandise.product.images.edges[0]?.node.url,
          imageAlt: node.merchandise.product.images.edges[0]?.node.altText,
        },
        price: node.merchandise.price.amount,
        currencyCode: node.merchandise.price.currencyCode,
      },
    })),
    cost: {
      subtotal: cart.estimatedCost.subtotalAmount.amount,
      subtotalCurrencyCode: cart.estimatedCost.subtotalAmount.currencyCode,
      total: cart.estimatedCost.totalAmount.amount,
      totalCurrencyCode: cart.estimatedCost.totalAmount.currencyCode,
      tax: cart.estimatedCost.totalTaxAmount?.amount,
      taxCurrencyCode: cart.estimatedCost.totalTaxAmount?.currencyCode,
    },
    buyerIdentity: cart.buyerIdentity,
    discountCodes: cart.discountCodes,
  }
}

// New function to get featured products
export async function getFeaturedProducts(limit = 4) {
  const query = /* GraphQL */ `
    query GetFeaturedProducts($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const variables = { first: limit }
  const result = await executeQuery(query, variables)
  const { products } = result as { products: any }

  return products.edges.map(({ node }: any) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    price: node.priceRange.minVariantPrice.amount,
    currencyCode: node.priceRange.minVariantPrice.currencyCode,
    image: node.images.edges[0]?.node.url,
    imageAlt: node.images.edges[0]?.node.altText,
    variantId: node.variants.edges[0]?.node.id,
    availableForSale: node.variants.edges[0]?.node.availableForSale,
  }))
}

// New function to search products with filtering
export async function searchProducts(query: string, first = 20, filters?: any) {
  const gqlQuery = /* GraphQL */ `
    query SearchProducts($query: String!, $first: Int!, $filters: [ProductFilter!]) {
      products(query: $query, first: $first, filters: $filters) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
            tags
          }
        }
      }
    }
  `

  const variables = { query, first, filters }
  const result = await executeQuery(gqlQuery, variables)
  const { products } = result as { products: any }

  return products.edges.map(({ node }: any) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    price: node.priceRange.minVariantPrice.amount,
    currencyCode: node.priceRange.minVariantPrice.currencyCode,
    image: node.images.edges[0]?.node.url,
    imageAlt: node.images.edges[0]?.node.altText,
    variantId: node.variants.edges[0]?.node.id,
    availableForSale: node.variants.edges[0]?.node.availableForSale,
    tags: node.tags,
  }))
}

export async function getAllProducts(first: number, after?: string) {
  const query = /* GraphQL */ `
    query GetAllProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  quantityAvailable
                }
              }
            }
            tags
            collections(first: 5) {
              edges {
                node {
                  id
                  title
                  handle
                }
              }
            }
            metafields(first: 10) {
              edges {
                node {
                  namespace
                  key
                  value
                }
              }
            }
            createdAt
            updatedAt
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `

  const variables = { first, after }
  const result = await executeQuery(query, variables)
  const { products } = result as { products: any }

  return {
    products: products.edges.map(({ node }: any) => node),
    pageInfo: products.pageInfo,
  }
}

export async function updateCartBuyerIdentity(
  cartId: string,
  buyerIdentity: {
    email?: string | null
    phone?: string | null
    customer?: {
      id: string
    } | null
    marketingConsent?: {
      consentCollectedFrom: string
      marketingOptInLevel: string
    } | null
  },
) {
  const mutation = /* GraphQL */ `
    mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = { cartId, buyerIdentity }
  const result = await executeQuery(mutation, variables)
  const { cartBuyerIdentityUpdate } = result as { cartBuyerIdentityUpdate: any }

  if (cartBuyerIdentityUpdate.userErrors.length) {
    throw new Error(cartBuyerIdentityUpdate.userErrors[0].message)
  }

  return cartBuyerIdentityUpdate.cart
}

export async function applyDiscountCode(cartId: string, discountCode: string) {
  const mutation = /* GraphQL */ `
    mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart {
          id
          discountCodes {
            code
            applicable
          }
          estimatedCost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = { cartId, discountCodes: [discountCode] }
  const result = await executeQuery(mutation, variables)
  const { cartDiscountCodesUpdate } = result as { cartDiscountCodesUpdate: any }

  if (cartDiscountCodesUpdate.userErrors.length) {
    throw new Error(cartDiscountCodesUpdate.userErrors[0].message)
  }

  return cartDiscountCodesUpdate.cart
}
