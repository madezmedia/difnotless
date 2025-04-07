import { test, expect } from "@playwright/test"

// These tests measure the performance of the Shopify integration
test.describe("Shopify Performance Tests", () => {
  test("should load products within acceptable time", async ({ page }) => {
    // Start performance measurement
    const startTime = Date.now()

    // Navigate to the products page
    await page.goto("/collections/all")

    // Wait for products to load
    await page.waitForSelector('[data-testid="product-grid"]')

    // Calculate load time
    const loadTime = Date.now() - startTime

    // Log the load time
    console.log(`Products page load time: ${loadTime}ms`)

    // Check if load time is within acceptable range (e.g., under 3 seconds)
    expect(loadTime).toBeLessThan(3000)

    // Check if at least some products were loaded
    const products = await page.$$('[data-testid="product-card"]')
    expect(products.length).toBeGreaterThan(0)
  })

  test("should load product details within acceptable time", async ({ page }) => {
    // Navigate to the products page first
    await page.goto("/collections/all")
    await page.waitForSelector('[data-testid="product-grid"]')

    // Start performance measurement
    const startTime = Date.now()

    // Click on the first product
    await page.click('[data-testid="product-card"]:first-child a')

    // Wait for product details to load
    await page.waitForSelector('[data-testid="product-details"]')

    // Calculate load time
    const loadTime = Date.now() - startTime

    // Log the load time
    console.log(`Product details page load time: ${loadTime}ms`)

    // Check if load time is within acceptable range (e.g., under 2 seconds)
    expect(loadTime).toBeLessThan(2000)
  })

  test("should add to cart within acceptable time", async ({ page }) => {
    // Navigate to a product page
    await page.goto("/products/test-product-1")
    await page.waitForSelector('[data-testid="product-details"]')

    // Start performance measurement
    const startTime = Date.now()

    // Click add to cart button
    await page.click('[data-testid="add-to-cart-button"]')

    // Wait for cart notification
    await page.waitForSelector('[data-testid="cart-notification"]')

    // Calculate response time
    const responseTime = Date.now() - startTime

    // Log the response time
    console.log(`Add to cart response time: ${responseTime}ms`)

    // Check if response time is within acceptable range (e.g., under 1 second)
    expect(responseTime).toBeLessThan(1000)
  })

  test("should measure cart update performance", async ({ page }) => {
    // Add product to cart first
    await page.goto("/products/test-product-1")
    await page.waitForSelector('[data-testid="product-details"]')
    await page.click('[data-testid="add-to-cart-button"]')
    await page.waitForSelector('[data-testid="cart-notification"]')

    // Open cart
    await page.click('[data-testid="cart-icon"]')
    await page.waitForSelector('[data-testid="cart-drawer"]')

    // Start performance measurement
    const startTime = Date.now()

    // Increase quantity
    await page.click('[data-testid="increase-quantity"]')

    // Wait for cart to update
    await page.waitForSelector('[data-testid="cart-updating"]', { state: "hidden" })

    // Calculate response time
    const responseTime = Date.now() - startTime

    // Log the response time
    console.log(`Cart update response time: ${responseTime}ms`)

    // Check if response time is within acceptable range (e.g., under 1 second)
    expect(responseTime).toBeLessThan(1000)
  })

  test("should measure checkout redirect performance", async ({ page }) => {
    // Add product to cart first
    await page.goto("/products/test-product-1")
    await page.waitForSelector('[data-testid="product-details"]')
    await page.click('[data-testid="add-to-cart-button"]')
    await page.waitForSelector('[data-testid="cart-notification"]')

    // Open cart
    await page.click('[data-testid="cart-icon"]')
    await page.waitForSelector('[data-testid="cart-drawer"]')

    // Start performance measurement
    const startTime = Date.now()

    // Get the checkout URL but don't navigate (we'll just measure the time to get the URL)
    const checkoutButton = await page.$('[data-testid="checkout-button"]')
    const checkoutUrl = await checkoutButton.getAttribute("href")

    // Calculate response time
    const responseTime = Date.now() - startTime

    // Log the response time
    console.log(`Checkout URL retrieval time: ${responseTime}ms`)

    // Check if response time is within acceptable range (e.g., under 500ms)
    expect(responseTime).toBeLessThan(500)
    expect(checkoutUrl).toBeTruthy()
  })
})

