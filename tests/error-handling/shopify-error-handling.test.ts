import { test, expect } from "@playwright/test"

// These tests verify that the application handles errors gracefully
test.describe("Shopify Error Handling", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto("/")
  })

  test("should handle product loading errors gracefully", async ({ page }) => {
    // Mock a network error for product loading
    await page.route("**/api/2024-01/graphql.json", (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({
          errors: [{ message: "Internal Server Error" }],
        }),
      })
    })

    // Navigate to the products page
    await page.goto("/collections/all")

    // Check if error message is displayed
    await page.waitForSelector('[data-testid="error-message"]')
    const errorMessage = await page.$eval('[data-testid="error-message"]', (el) => el.textContent)

    expect(errorMessage).toContain("Error")

    // Check if retry button is available
    expect(await page.$('[data-testid="retry-button"]')).toBeTruthy()

    // Click retry button
    await page.click('[data-testid="retry-button"]')

    // Check if loading state is shown
    await page.waitForSelector('[data-testid="loading-state"]')
  })

  test("should handle cart creation errors gracefully", async ({ page }) => {
    // Mock a network error for cart creation
    await page.route("**/api/2024-01/graphql.json", (route, request) => {
      if (request.postData()?.includes("cartCreate")) {
        route.fulfill({
          status: 500,
          body: JSON.stringify({
            errors: [{ message: "Failed to create cart" }],
          }),
        })
      } else {
        route.continue()
      }
    })

    // Navigate to a product page
    await page.goto("/products/test-product-1")
    await page.waitForSelector('[data-testid="product-details"]')

    // Click add to cart button
    await page.click('[data-testid="add-to-cart-button"]')

    // Check if error message is displayed
    await page.waitForSelector('[data-testid="error-notification"]')
    const errorMessage = await page.$eval('[data-testid="error-notification"]', (el) => el.textContent)

    expect(errorMessage).toContain("Error")

    // Check if offline mode indicator is shown
    await page.waitForSelector('[data-testid="offline-indicator"]')
  })

  test("should recover from temporary network issues", async ({ page }) => {
    // Set up a counter to track request attempts
    let requestCount = 0

    // Mock network failure for the first attempt, then succeed
    await page.route("**/api/2024-01/graphql.json", (route, request) => {
      requestCount++

      if (requestCount <= 1) {
        // Fail the first request
        route.abort("failed")
      } else {
        // Let subsequent requests through
        route.continue()
      }
    })

    // Navigate to the products page
    await page.goto("/collections/all")

    // Wait for retry mechanism to kick in and eventually load products
    await page.waitForSelector('[data-testid="product-grid"]', { timeout: 10000 })

    // Verify products loaded after retry
    const products = await page.$$('[data-testid="product-card"]')
    expect(products.length).toBeGreaterThan(0)

    // Verify request count is greater than 1 (indicating retry happened)
    expect(requestCount).toBeGreaterThan(1)
  })

  test("should handle offline mode gracefully", async ({ page }) => {
    // Simulate going offline
    await page.context().setOffline(true)

    // Navigate to the products page
    await page.goto("/collections/all")

    // Check if offline message is displayed
    await page.waitForSelector('[data-testid="offline-message"]')

    // Check if cached content is displayed if available
    const cachedContent = await page.$('[data-testid="cached-content"]')
    if (cachedContent) {
      expect(await cachedContent.isVisible()).toBe(true)
    }

    // Simulate coming back online
    await page.context().setOffline(false)

    // Check if refresh button is available
    const refreshButton = await page.$('[data-testid="refresh-button"]')
    if (refreshButton) {
      await refreshButton.click()

      // Wait for content to load
      await page.waitForSelector('[data-testid="product-grid"]')
    }
  })
})

