import { describe, it, expect, beforeAll } from "vitest"
import { testShopifyConnection, diagnoseShopifyConnection, testCartCreation } from "@/lib/shopify-diagnostics"

// These tests will actually connect to Shopify, so they should be run
// only in a controlled environment with proper credentials
describe("Shopify Integration Tests", () => {
  // Set a longer timeout for these tests since they make real API calls
  const TEST_TIMEOUT = 30000

  beforeAll(() => {
    // Ensure environment variables are set
    if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      throw new Error("Shopify environment variables are not set")
    }
  })

  it(
    "should successfully connect to Shopify API",
    async () => {
      const result = await testShopifyConnection()

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data.shop).toBeDefined()
      expect(result.data.shop.name).toBeTruthy()
    },
    TEST_TIMEOUT,
  )

  it(
    "should run diagnostics and return valid results",
    async () => {
      const diagnostics = await diagnoseShopifyConnection()

      expect(diagnostics.environment.domain).toBe("✅ Set")
      expect(diagnostics.environment.token).toBe("✅ Set")
      expect(diagnostics.connectivity.status).toBe("✅ Success")
      expect(diagnostics.shop.name).toBeTruthy()
      expect(diagnostics.shop.url).toBeTruthy()
    },
    TEST_TIMEOUT,
  )

  it(
    "should successfully create a cart",
    async () => {
      const result = await testCartCreation()

      expect(result.success).toBe(true)
      expect(result.cart).toBeDefined()
      expect(result.cart.id).toBeTruthy()
      expect(result.cart.checkoutUrl).toBeTruthy()
    },
    TEST_TIMEOUT,
  )
})

