import type { GraphQLClient } from "graphql-request"
import { vi, expect } from "vitest"

/**
 * Creates a mock GraphQL client for testing Shopify API calls
 */
export function createMockShopifyClient() {
  return {
    request: vi.fn(),
  } as unknown as GraphQLClient
}

/**
 * Mock product data for testing
 */
export const mockProducts = [
  {
    id: "gid://shopify/Product/1",
    title: "Test Product 1",
    handle: "test-product-1",
    description: "This is a test product",
    descriptionHtml: "<p>This is a test product</p>",
    tags: ["test", "sample"],
    priceRange: {
      minVariantPrice: {
        amount: "19.99",
        currencyCode: "USD",
      },
    },
    images: {
      edges: [
        {
          node: {
            url: "https://cdn.shopify.com/test-image-1.jpg",
            altText: "Test Image 1",
            width: 800,
            height: 800,
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/1",
            title: "Default",
            availableForSale: true,
            price: {
              amount: "19.99",
              currencyCode: "USD",
            },
            selectedOptions: [
              {
                name: "Size",
                value: "Medium",
              },
              {
                name: "Color",
                value: "Blue",
              },
            ],
            quantityAvailable: 10,
            sku: "TEST-SKU-1",
            barcode: "123456789",
          },
        },
      ],
    },
    collections: {
      edges: [
        {
          node: {
            id: "gid://shopify/Collection/1",
            title: "Test Collection",
            handle: "test-collection",
          },
        },
      ],
    },
    metafields: {
      edges: [],
    },
  },
  {
    id: "gid://shopify/Product/2",
    title: "Test Product 2",
    handle: "test-product-2",
    description: "This is another test product",
    descriptionHtml: "<p>This is another test product</p>",
    tags: ["test", "premium"],
    priceRange: {
      minVariantPrice: {
        amount: "29.99",
        currencyCode: "USD",
      },
    },
    images: {
      edges: [
        {
          node: {
            url: "https://cdn.shopify.com/test-image-2.jpg",
            altText: "Test Image 2",
            width: 800,
            height: 800,
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/2",
            title: "Default",
            availableForSale: true,
            price: {
              amount: "29.99",
              currencyCode: "USD",
            },
            selectedOptions: [
              {
                name: "Size",
                value: "Large",
              },
              {
                name: "Color",
                value: "Red",
              },
            ],
            quantityAvailable: 5,
            sku: "TEST-SKU-2",
            barcode: "987654321",
          },
        },
      ],
    },
    collections: {
      edges: [
        {
          node: {
            id: "gid://shopify/Collection/1",
            title: "Test Collection",
            handle: "test-collection",
          },
        },
      ],
    },
    metafields: {
      edges: [],
    },
  },
]

/**
 * Mock collection data for testing
 */
export const mockCollections = [
  {
    id: "gid://shopify/Collection/1",
    title: "Test Collection 1",
    handle: "test-collection-1",
    description: "This is a test collection",
    image: {
      url: "https://cdn.shopify.com/test-collection-1.jpg",
      altText: "Test Collection 1",
    },
    products: {
      edges: mockProducts.slice(0, 1).map((product) => ({ node: product })),
    },
  },
  {
    id: "gid://shopify/Collection/2",
    title: "Test Collection 2",
    handle: "test-collection-2",
    description: "This is another test collection",
    image: {
      url: "https://cdn.shopify.com/test-collection-2.jpg",
      altText: "Test Collection 2",
    },
    products: {
      edges: mockProducts.slice(1, 2).map((product) => ({ node: product })),
    },
  },
]

/**
 * Mock cart data for testing
 */
export const mockCart = {
  id: "gid://shopify/Cart/test-cart-id",
  checkoutUrl: "https://test-store.myshopify.com/cart/test-checkout-id",
  lines: {
    edges: [
      {
        node: {
          id: "gid://shopify/CartLine/1",
          quantity: 1,
          merchandise: {
            id: "gid://shopify/ProductVariant/1",
            title: "Default",
            product: {
              title: "Test Product 1",
              handle: "test-product-1",
              images: {
                edges: [
                  {
                    node: {
                      url: "https://cdn.shopify.com/test-image-1.jpg",
                      altText: "Test Image 1",
                    },
                  },
                ],
              },
            },
            price: {
              amount: "19.99",
              currencyCode: "USD",
            },
          },
        },
      },
    ],
  },
  estimatedCost: {
    subtotalAmount: {
      amount: "19.99",
      currencyCode: "USD",
    },
    totalAmount: {
      amount: "21.99",
      currencyCode: "USD",
    },
    totalTaxAmount: {
      amount: "2.00",
      currencyCode: "USD",
    },
  },
  buyerIdentity: {
    email: null,
    phone: null,
    customer: null,
  },
  discountCodes: [],
}

/**
 * Helper function to simulate API responses
 */
export function mockShopifyResponse(data: any) {
  return {
    json: () => Promise.resolve(data),
    ok: true,
    status: 200,
    statusText: "OK",
  }
}

/**
 * Helper function to simulate API errors
 */
export function mockShopifyError(status = 500, message = "Internal Server Error") {
  return {
    json: () => Promise.resolve({ errors: [{ message }] }),
    ok: false,
    status,
    statusText: message,
    text: () => Promise.resolve(JSON.stringify({ errors: [{ message }] })),
  }
}

/**
 * Setup global fetch mock for testing
 */
export function setupFetchMock(mockResponse: any) {
  global.fetch = vi.fn().mockResolvedValue(mockResponse)
  return global.fetch
}

/**
 * Reset fetch mock after tests
 */
export function resetFetchMock() {
  if (global.fetch && typeof global.fetch === "function" && vi.isMockFunction(global.fetch)) {
    global.fetch.mockReset()
  }
}

/**
 * Helper to validate product structure
 */
export function validateProductStructure(product: any) {
  expect(product).toHaveProperty("id")
  expect(product).toHaveProperty("title")
  expect(product).toHaveProperty("handle")
  expect(product).toHaveProperty("description")
  expect(product).toHaveProperty("price")
  expect(product).toHaveProperty("currencyCode")
  expect(product).toHaveProperty("images")
  expect(product).toHaveProperty("variants")
}

/**
 * Helper to validate cart structure
 */
export function validateCartStructure(cart: any) {
  expect(cart).toHaveProperty("id")
  expect(cart).toHaveProperty("checkoutUrl")
  expect(cart).toHaveProperty("lines")
  expect(cart).toHaveProperty("cost")
  expect(cart.cost).toHaveProperty("subtotal")
  expect(cart.cost).toHaveProperty("total")
}

