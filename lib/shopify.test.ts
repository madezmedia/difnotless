import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import {
  getCollections,
  getCollection,
  getProduct,
  getProductRecommendations,
  createCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart,
} from "./shopify"
import {
  mockProducts,
  mockCollections,
  mockCart,
  setupFetchMock,
  resetFetchMock,
  validateProductStructure,
  validateCartStructure,
} from "./test-utils/shopify-test-utils"

// Mock environment variables
vi.mock("process", () => ({
  env: {
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: "test-store.myshopify.com",
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: "test-token",
  },
}))

describe("Shopify API Functions", () => {
  beforeEach(() => {
    // Setup fetch mock before each test
    vi.resetModules()
  })

  afterEach(() => {
    // Reset fetch mock after each test
    resetFetchMock()
    vi.clearAllMocks()
  })

  describe("Product Retrieval", () => {
    it("should retrieve all collections", async () => {
      // Setup mock response
      setupFetchMock({
        json: () => Promise.resolve({ data: { collections: { edges: mockCollections.map((c) => ({ node: c })) } } }),
        ok: true,
      })

      const collections = await getCollections()

      expect(collections).toHaveLength(mockCollections.length)
      expect(collections[0]).toHaveProperty("id", mockCollections[0].id)
      expect(collections[0]).toHaveProperty("title", mockCollections[0].title)
      expect(collections[0]).toHaveProperty("handle", mockCollections[0].handle)
    })

    it("should retrieve a specific collection by handle", async () => {
      const testHandle = "test-collection-1"

      // Setup mock response
      setupFetchMock({
        json: () => Promise.resolve({ data: { collection: mockCollections[0] } }),
        ok: true,
      })

      const collection = await getCollection(testHandle)

      expect(collection).not.toBeNull()
      expect(collection).toHaveProperty("id", mockCollections[0].id)
      expect(collection).toHaveProperty("title", mockCollections[0].title)
      expect(collection).toHaveProperty("handle", mockCollections[0].handle)
      expect(collection).toHaveProperty("products")
      expect(collection.products).toHaveLength(1)
    })

    it("should return null for non-existent collection", async () => {
      const testHandle = "non-existent-collection"

      // Setup mock response
      setupFetchMock({
        json: () => Promise.resolve({ data: { collection: null } }),
        ok: true,
      })

      const collection = await getCollection(testHandle)

      expect(collection).toBeNull()
    })

    it("should retrieve a specific product by handle", async () => {
      const testHandle = "test-product-1"

      // Setup mock response
      setupFetchMock({
        json: () => Promise.resolve({ data: { product: mockProducts[0] } }),
        ok: true,
      })

      const product = await getProduct(testHandle)

      expect(product).not.toBeNull()
      expect(product).toHaveProperty("id", mockProducts[0].id)
      expect(product).toHaveProperty("title", mockProducts[0].title)
      expect(product).toHaveProperty("handle", mockProducts[0].handle)
      validateProductStructure(product)
    })

    it("should return null for non-existent product", async () => {
      const testHandle = "non-existent-product"

      // Setup mock response
      setupFetchMock({
        json: () => Promise.resolve({ data: { product: null } }),
        ok: true,
      })

      const product = await getProduct(testHandle)

      expect(product).toBeNull()
    })

    it("should retrieve product recommendations", async () => {
      const testProductId = "gid://shopify/Product/1"

      // Setup mock response
      setupFetchMock({
        json: () =>
          Promise.resolve({
            data: {
              productRecommendations: mockProducts.slice(1),
              products: { edges: mockProducts.map((p) => ({ node: p })) },
            },
          }),
        ok: true,
      })

      const recommendations = await getProductRecommendations(testProductId)

      expect(recommendations).toHaveLength(mockProducts.length - 1)
      validateProductStructure(recommendations[0])
    })

    it("should handle errors when retrieving products", async () => {
      // Setup mock response
      setupFetchMock({
        json: () => Promise.reject(new Error("API Error")),
        ok: false,
      })

      await expect(getCollections()).rejects.toThrow()
    })
  })

  describe("Cart Operations", () => {
    it("should create a new cart", async () => {
      // Setup mock response
      setupFetchMock({
        json: () =>
          Promise.resolve({
            data: {
              cartCreate: {
                cart: {
                  id: mockCart.id,
                  checkoutUrl: mockCart.checkoutUrl,
                },
                userErrors: [],
              },
            },
          }),
        ok: true,
      })

      const cart = await createCart()

      expect(cart).toHaveProperty("id", mockCart.id)
      expect(cart).toHaveProperty("checkoutUrl", mockCart.checkoutUrl)
    })

    it("should add an item to the cart", async () => {
      const cartId = mockCart.id
      const variantId = "gid://shopify/ProductVariant/1"
      const quantity = 1

      // Setup mock response
      setupFetchMock({
        json: () =>
          Promise.resolve({
            data: {
              cartLinesAdd: {
                cart: mockCart,
                userErrors: [],
              },
            },
          }),
        ok: true,
      })

      const updatedCart = await addToCart(cartId, variantId, quantity)

      validateCartStructure(updatedCart)
      expect(updatedCart).toHaveProperty("id", mockCart.id)
    })

    it("should update an item in the cart", async () => {
      const cartId = mockCart.id
      const lineId = "gid://shopify/CartLine/1"
      const quantity = 2

      // Setup mock response
      setupFetchMock({
        json: () =>
          Promise.resolve({
            data: {
              cartLinesUpdate: {
                cart: {
                  ...mockCart,
                  lines: {
                    edges: [
                      {
                        node: {
                          ...mockCart.lines.edges[0].node,
                          quantity: 2,
                        },
                      },
                    ],
                  },
                },
                userErrors: [],
              },
            },
          }),
        ok: true,
      })

      const updatedCart = await updateCartItem(cartId, lineId, quantity)

      validateCartStructure(updatedCart)
      expect(updatedCart.lines[0].quantity).toBe(2)
    })

    it("should remove an item from the cart", async () => {
      const cartId = mockCart.id
      const lineId = "gid://shopify/CartLine/1"

      // Setup mock response
      setupFetchMock({
        json: () =>
          Promise.resolve({
            data: {
              cartLinesRemove: {
                cart: {
                  ...mockCart,
                  lines: { edges: [] },
                },
                userErrors: [],
              },
            },
          }),
        ok: true,
      })

      const updatedCart = await removeCartItem(cartId, lineId)

      validateCartStructure(updatedCart)
      expect(updatedCart.lines).toHaveLength(0)
    })

    it("should retrieve a cart by ID", async () => {
      const cartId = mockCart.id

      // Setup mock response
      setupFetchMock({
        json: () => Promise.resolve({ data: { cart: mockCart } }),
        ok: true,
      })

      const cart = await getCart(cartId)

      validateCartStructure(cart)
      expect(cart).toHaveProperty("id", mockCart.id)
    })

    it("should handle cart creation errors", async () => {
      // Setup mock response to simulate network error
      setupFetchMock({
        json: () => Promise.reject(new Error("Failed to fetch")),
        ok: false,
      })

      // The createCart function should return a fallback cart when it fails
      const cart = await createCart()

      expect(cart).toHaveProperty("id")
      expect(cart.id).toMatch(/^offline-/)
    })
  })
})

