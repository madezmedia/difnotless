/**
 * Utility function to diagnose Shopify API connectivity issues
 */
export async function diagnoseShopifyConnection() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  const results = {
    environment: {
      domain: domain ? "✅ Set" : "❌ Missing",
      token: storefrontAccessToken ? "✅ Set" : "❌ Missing",
    },
    connectivity: {
      status: "Pending",
      error: null as string | null,
    },
    shop: {
      name: null as string | null,
      url: null as string | null,
    },
  }

  // Skip tests if environment variables are missing
  if (!domain || !storefrontAccessToken) {
    results.connectivity.status = "❌ Failed - Missing credentials"
    return results
  }

  const endpoint = `https://${domain}/api/2024-01/graphql.json`

  try {
    // Test basic connectivity with a simple fetch
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            shop {
              name
              primaryDomain {
                url
              }
            }
          }
        `,
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      results.connectivity.status = `❌ Failed - HTTP ${response.status}`
      results.connectivity.error = await response.text()
      return results
    }

    const data = await response.json()

    if (data.errors) {
      results.connectivity.status = "❌ Failed - GraphQL errors"
      results.connectivity.error = JSON.stringify(data.errors)
      return results
    }

    if (data.data?.shop) {
      results.connectivity.status = "✅ Success"
      results.shop.name = data.data.shop.name
      results.shop.url = data.data.shop.primaryDomain.url
    } else {
      results.connectivity.status = "❌ Failed - No shop data"
    }
  } catch (error) {
    results.connectivity.status = "❌ Failed - Exception"
    results.connectivity.error = error instanceof Error ? error.message : String(error)
  }

  return results
}

/**
 * Test cart creation specifically
 */
export async function testCartCreation() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  if (!domain || !storefrontAccessToken) {
    return {
      success: false,
      error: "Missing environment variables",
    }
  }

  try {
    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation {
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
        `,
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error ${response.status}`,
        details: await response.text(),
      }
    }

    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: "GraphQL errors",
        details: data.errors,
      }
    }

    if (data.data?.cartCreate?.userErrors?.length > 0) {
      return {
        success: false,
        error: "User errors",
        details: data.data.cartCreate.userErrors,
      }
    }

    if (data.data?.cartCreate?.cart) {
      return {
        success: true,
        cart: data.data.cartCreate.cart,
      }
    }

    return {
      success: false,
      error: "Unknown error",
      details: data,
    }
  } catch (error) {
    return {
      success: false,
      error: "Exception",
      details: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function testShopifyConnection() {
  try {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
    const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

    if (!domain || !storefrontAccessToken) {
      throw new Error("Shopify environment variables are not set")
    }

    const endpoint = `https://${domain}/api/2024-01/graphql.json`

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            shop {
              name
              primaryDomain {
                url
              }
            }
          }
        `,
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}

