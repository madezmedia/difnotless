import { test, expect } from "@playwright/test"

// These tests simulate user interactions with the website
test.describe("Shopify User Flows", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto("/")
  })

  test("should display products on the homepage", async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-grid"]')

    // Check if products are displayed
    const products = await page.$$('[data-testid="product-card"]')
    expect(products.length).toBeGreaterThan(0)

    // Check if product details are displayed
    const firstProduct = products[0]
    expect(await firstProduct.$('[data-testid="product-title"]')).toBeTruthy()
    expect(await firstProduct.$('[data-testid="product-price"]')).toBeTruthy()
    expect(await firstProduct.$('[data-testid="product-image"]')).toBeTruthy()
  })

  test("should navigate to product details page", async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-grid"]')

    // Click on the first product
    await page.click('[data-testid="product-card"]:first-child a')

    // Wait for product details page to load
    await page.waitForSelector('[data-testid="product-details"]')

    // Check if product details are displayed
    expect(await page.$('[data-testid="product-title"]')).toBeTruthy()
    expect(await page.$('[data-testid="product-price"]')).toBeTruthy()
    expect(await page.$('[data-testid="product-description"]')).toBeTruthy()
    expect(await page.$('[data-testid="product-images"]')).toBeTruthy()
    expect(await page.$('[data-testid="add-to-cart-button"]')).toBeTruthy()
  })

  test("should add product to cart", async ({ page }) => {
    // Navigate to a product page
    await page.goto("/products/test-product-1")

    // Wait for product details to load
    await page.waitForSelector('[data-testid="product-details"]')

    // Select product options if available
    const variantSelectors = await page.$$('[data-testid="variant-selector"]')
    if (variantSelectors.length > 0) {
      for (const selector of variantSelectors) {
        await selector.click()
        await page.click('[data-testid="variant-option"]:first-child')
      }
    }

    // Click add to cart button
    await page.click('[data-testid="add-to-cart-button"]')

    // Wait for cart notification
    await page.waitForSelector('[data-testid="cart-notification"]')

    // Open cart
    await page.click('[data-testid="cart-icon"]')

    // Wait for cart drawer to open
    await page.waitForSelector('[data-testid="cart-drawer"]')

    // Check if product is in cart
    const cartItems = await page.$$('[data-testid="cart-item"]')
    expect(cartItems.length).toBeGreaterThan(0)

    // Check if cart total is displayed
    expect(await page.$('[data-testid="cart-subtotal"]')).toBeTruthy()
    expect(await page.$('[data-testid="checkout-button"]')).toBeTruthy()
  })

  test("should update cart quantity", async ({ page }) => {
    // Add product to cart first
    await page.goto("/products/test-product-1")
    await page.waitForSelector('[data-testid="product-details"]')
    await page.click('[data-testid="add-to-cart-button"]')
    await page.waitForSelector('[data-testid="cart-notification"]')

    // Open cart
    await page.click('[data-testid="cart-icon"]')
    await page.waitForSelector('[data-testid="cart-drawer"]')

    // Get initial quantity and subtotal
    const initialQuantity = await page.$eval('[data-testid="item-quantity"]', (el) => el.textContent)
    const initialSubtotal = await page.$eval('[data-testid="cart-subtotal"]', (el) => el.textContent)

    // Increase quantity
    await page.click('[data-testid="increase-quantity"]')

    // Wait for cart to update
    await page.waitForTimeout(1000) // Wait for cart update

    // Get updated quantity and subtotal
    const updatedQuantity = await page.$eval('[data-testid="item-quantity"]', (el) => el.textContent)
    const updatedSubtotal = await page.$eval('[data-testid="cart-subtotal"]', (el) => el.textContent)

    // Check if quantity and subtotal have changed
    expect(updatedQuantity).not.toBe(initialQuantity)
    expect(updatedSubtotal).not.toBe(initialSubtotal)
  })

  test("should remove item from cart", async ({ page }) => {
    // Add product to cart first
    await page.goto("/products/test-product-1")
    await page.waitForSelector('[data-testid="product-details"]')
    await page.click('[data-testid="add-to-cart-button"]')
    await page.waitForSelector('[data-testid="cart-notification"]')

    // Open cart
    await page.click('[data-testid="cart-icon"]')
    await page.waitForSelector('[data-testid="cart-drawer"]')

    // Get initial number of items
    const initialItems = await page.$$('[data-testid="cart-item"]')
    const initialCount = initialItems.length

    // Remove item
    await page.click('[data-testid="remove-item"]')

    // Wait for cart to update
    await page.waitForTimeout(1000) // Wait for cart update

    // Get updated number of items
    const updatedItems = await page.$$('[data-testid="cart-item"]')
    const updatedCount = updatedItems.length

    // Check if item was removed
    expect(updatedCount).toBe(initialCount - 1)
  })

  test("should proceed to checkout", async ({ page }) => {
    // Add product to cart first
    await page.goto("/products/test-product-1")
    await page.waitForSelector('[data-testid="product-details"]')
    await page.click('[data-testid="add-to-cart-button"]')
    await page.waitForSelector('[data-testid="cart-notification"]')

    // Open cart
    await page.click('[data-testid="cart-icon"]')
    await page.waitForSelector('[data-testid="cart-drawer"]')

    // Click checkout button
    const checkoutButton = await page.$('[data-testid="checkout-button"]')

    // Get the href attribute which should be the checkout URL
    const checkoutUrl = await checkoutButton.getAttribute("href")

    // Verify checkout URL format
    expect(checkoutUrl).toContain("checkout")

    // Note: We don't actually navigate to the checkout URL in this test
    // as it would take us to Shopify's checkout page
  })
})

