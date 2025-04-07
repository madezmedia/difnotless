# Shopify Product Synchronization Guide

## Overview
This guide focuses on synchronizing products from our Shopify store to DifNotLess using the Storefront API. This is the immediate priority for the April 2025 launch.

## Environment Setup

```plaintext
# Required in .env.local
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
```

> **Important**: The `NEXT_PUBLIC_` prefix is required for the domain as it's used in client-side code. The access token should NOT have this prefix as it should only be used in server-side operations.

## API Client Setup

```typescript
// lib/shopify/client.ts
import { GraphQLClient } from 'graphql-request';

// Create GraphQL client with auth
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token!,
    "Content-Type": "application/json",
  },
});

// Network error detection
export function isNetworkError(error: any): boolean {
  return (
    error.message?.includes('Failed to fetch') ||
    error.message?.includes('Network error') ||
    error.message?.includes('ECONNREFUSED') ||
    error.message?.includes('ETIMEDOUT')
  );
}

// Query execution with retry
export async function executeQuery<T>(
  query: string, 
  variables?: any, 
  retries = 3
): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await shopifyClient.request<T>(query, variables);
      return result;
    } catch (error: any) {
      if (isNetworkError(error) && attempt < retries - 1) {
        // If network error and retries left, try again
        await sleep(exponentialBackoff(attempt));
        continue;
      }
      
      // Log detailed error info
      console.error(`GraphQL Error (Attempt ${attempt + 1}/${retries}):`, error);
      
      // Enhanced error logging
      if (error.response?.errors) {
        console.error('GraphQL Errors:', JSON.stringify(error.response.errors, null, 2));
      }
      
      if (error.request) {
        console.error('Request details:', {
          url: typeof error.request.url === 'string' ? error.request.url : 'unknown',
          method: error.request.method || 'unknown',
        });
      }
      
      throw error;
    }
  }
  throw new Error('Failed to execute GraphQL query');
}

// Backoff helpers
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const exponentialBackoff = (attempt: number, base = 300): number => {
  return Math.min(base * Math.pow(2, attempt), 10000);
};

// Offline detection
export const isOnline = () => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};
```

## Product Queries

```typescript
// lib/shopify/queries/product.ts

// Get single product by handle
export const PRODUCT_QUERY = `
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
          }
        }
      }
    }
  }
`;

// Get multiple products with pagination
export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String) {
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
                width
                height
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Get collection by handle
export const COLLECTION_QUERY = `
  query GetCollection($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      id
      title
      description
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
                  width
                  height
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

// Get product recommendations
export const PRODUCT_RECOMMENDATIONS_QUERY = `
  query GetProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
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
            width
            height
          }
        }
      }
    }
  }
`;
```

## API Functions

```typescript
// lib/shopify/products.ts
import { executeQuery, isOnline } from './client';
import { 
  PRODUCT_QUERY, 
  PRODUCTS_QUERY, 
  COLLECTION_QUERY,
  PRODUCT_RECOMMENDATIONS_QUERY
} from './queries';
import { transformProductData, transformCollectionData } from './transforms';

// Get single product
export async function getProduct(handle: string) {
  // Check if online
  if (!isOnline()) {
    console.warn('Offline: Unable to fetch product data');
    return null;
  }

  try {
    const data = await executeQuery(PRODUCT_QUERY, { handle });
    return data.product ? transformProductData(data.product) : null;
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    return null;
  }
}

// Get multiple products
export async function getProducts(first = 20, after = null) {
  // Check if online
  if (!isOnline()) {
    console.warn('Offline: Unable to fetch products');
    return { products: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }

  try {
    const data = await executeQuery(PRODUCTS_QUERY, { first, after });
    return {
      products: data.products.edges.map(({ node }) => transformProductData(node)),
      pageInfo: data.products.pageInfo,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { 
      products: [], 
      pageInfo: { hasNextPage: false, endCursor: null } 
    };
  }
}

// Get collection with products
export async function getCollection(handle: string, first = 20, after = null) {
  // Check if online
  if (!isOnline()) {
    console.warn('Offline: Unable to fetch collection');
    return null;
  }

  try {
    const data = await executeQuery(COLLECTION_QUERY, { handle, first, after });
    return data.collection ? transformCollectionData(data.collection) : null;
  } catch (error) {
    console.error(`Error fetching collection ${handle}:`, error);
    return null;
  }
}

// Get product recommendations
export async function getProductRecommendations(productId: string) {
  // Check if online
  if (!isOnline()) {
    console.warn('Offline: Unable to fetch product recommendations');
    return [];
  }

  try {
    const data = await executeQuery(PRODUCT_RECOMMENDATIONS_QUERY, { productId });
    return data.productRecommendations 
      ? data.productRecommendations.map(product => transformProductData(product))
      : [];
  } catch (error) {
    console.error(`Error fetching recommendations for product ${productId}:`, error);
    return [];
  }
}

// Search products
export async function searchProducts(query: string, first = 20) {
  // Check if online
  if (!isOnline()) {
    console.warn('Offline: Unable to search products');
    return { products: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }

  try {
    const data = await executeQuery(PRODUCTS_QUERY, { 
      first, 
      query: `title:*${query}* OR tag:*${query}*` 
    });
    return {
      products: data.products.edges.map(({ node }) => transformProductData(node)),
      pageInfo: data.products.pageInfo,
    };
  } catch (error) {
    console.error(`Error searching products for "${query}":`, error);
    return { 
      products: [], 
      pageInfo: { hasNextPage: false, endCursor: null } 
    };
  }
}
```

## Data Transformation

```typescript
// lib/shopify/transforms.ts

// Transform product from Shopify format to app format
export function transformProductData(product) {
  if (!product) return null;
  
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    tags: product.tags || [],
    price: product.priceRange?.minVariantPrice?.amount,
    currencyCode: product.priceRange?.minVariantPrice?.currencyCode,
    images: product.images?.edges?.map(({ node }) => ({
      url: node.url,
      altText: node.altText || product.title,
      width: node.width,
      height: node.height,
    })) || [],
    variants: product.variants?.edges?.map(({ node }) => ({
      id: node.id,
      title: node.title,
      availableForSale: node.availableForSale,
      price: node.price?.amount,
      currencyCode: node.price?.currencyCode,
      selectedOptions: node.selectedOptions,
      quantityAvailable: node.quantityAvailable,
    })) || [],
  };
}

// Transform collection from Shopify format to app format
export function transformCollectionData(collection) {
  if (!collection) return null;
  
  return {
    id: collection.id,
    title: collection.title,
    description: collection.description,
    products: collection.products?.edges?.map(({ node }) => 
      transformProductData(node)
    ) || [],
    pageInfo: collection.products?.pageInfo,
  };
}
```

## Using in Server Components

```typescript
// app/(shop)/products/[handle]/page.tsx
import { getProduct } from '@/lib/shopify/products';
import ProductDisplay from '@/components/product/ProductDisplay';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);
  
  if (!product) {
    return notFound();
  }
  
  return <ProductDisplay product={product} />;
}

// app/(shop)/collections/[handle]/page.tsx
import { getCollection } from '@/lib/shopify/products';
import CollectionDisplay from '@/components/collection/CollectionDisplay';
import { notFound } from 'next/navigation';

export default async function CollectionPage({ params }) {
  const collection = await getCollection(params.handle);
  
  if (!collection) {
    return notFound();
  }
  
  return <CollectionDisplay collection={collection} />;
}
```

## API Routes

```typescript
// app/api/products/recommendations/route.ts
import { NextResponse } from 'next/server';
import { getProductRecommendations } from '@/lib/shopify/products';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'Product ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const recommendations = await getProductRecommendations(id);
    
    // Cache for 1 hour, stale for 1 day
    return NextResponse.json(
      { products: recommendations },
      { 
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        }
      }
    );
  } catch (error) {
    console.error('Error getting product recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

// app/api/shopify-diagnostics/route.ts
import { NextResponse } from 'next/server';
import { diagnoseShopifyConnection } from '@/lib/shopify/diagnostics';

export async function GET() {
  try {
    const diagnostics = await diagnoseShopifyConnection();
    return NextResponse.json(diagnostics);
  } catch (error) {
    console.error('Error running Shopify diagnostics:', error);
    return NextResponse.json(
      { error: 'Failed to run diagnostics' },
      { status: 500 }
    );
  }
}
```

## Diagnostic Tools

```typescript
// lib/shopify/diagnostics.ts
import { shopifyClient, executeQuery } from './client';
import { createCart } from './cart';

export async function diagnoseShopifyConnection() {
  const results = {
    environment: {
      domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ? 'Set' : 'Missing',
      token: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? 'Set' : 'Missing',
    },
    connection: {
      success: false,
      data: null,
      error: null,
    },
    cartCreation: {
      success: false,
      data: null,
      error: null,
    },
  };

  // Test API connection
  try {
    const data = await executeQuery(`
      query {
        shop {
          name
          primaryDomain {
            url
          }
        }
      }
    `);
    
    results.connection.success = true;
    results.connection.data = data;
  } catch (error) {
    results.connection.success = false;
    results.connection.error = error.message;
  }

  // Test cart creation
  if (results.connection.success) {
    try {
      const cart = await createCart();
      results.cartCreation.success = true;
      results.cartCreation.data = { id: cart.id };
    } catch (error) {
      results.cartCreation.success = false;
      results.cartCreation.error = error.message;
    }
  }

  return results;
}
```

## Performance Optimization

### Caching

```typescript
// lib/shopify/cache.ts
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

export function getCachedData(key: string) {
  const cachedItem = cache.get(key);
  
  if (!cachedItem) return null;
  
  const { timestamp, data } = cachedItem;
  const isExpired = Date.now() - timestamp > CACHE_TIME;
  
  return isExpired ? null : data;
}

export function setCachedData(key: string, data: any) {
  cache.set(key, {
    timestamp: Date.now(),
    data,
  });
}

// Usage in product functions
export async function getProduct(handle: string) {
  const cacheKey = `product:${handle}`;
  const cachedProduct = getCachedData(cacheKey);
  
  if (cachedProduct) return cachedProduct;
  
  try {
    const data = await executeQuery(PRODUCT_QUERY, { handle });
    const product = data.product ? transformProductData(data.product) : null;
    
    if (product) {
      setCachedData(cacheKey, product);
    }
    
    return product;
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    return null;
  }
}
```

### Route Caching

```typescript
// In Next.js route handlers
export async function GET() {
  const products = await getProducts();
  
  // Cache for 5 minutes
  return Response.json(products, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
```

### Image Optimization

```tsx
import Image from 'next/image';

// In ProductCard component
<div className="product-card">
  <Image
    src={product.images[0]?.url || "/placeholder.svg"}
    alt={product.images[0]?.altText || product.title}
    width={500}
    height={500}
    priority={isPriority}
    quality={85}
    placeholder="blur"
    blurDataURL="/placeholder.svg"
    className="product-image"
    onError={(e) => {
      e.currentTarget.src = "/placeholder.svg";
    }}
  />
  <h3>{product.title}</h3>
  <p>{formatPrice(product.price, product.currencyCode)}</p>
</div>
```

### Pagination

```typescript
// For large collections
const { products, pageInfo } = await getAllProducts(20);

// Load more as needed
if (pageInfo.hasNextPage) {
  const nextPage = await getAllProducts(20, pageInfo.endCursor);
}
```

## Cart Integration

While our immediate focus is on product synchronization, the cart functionality is also critical. Here's the implementation:

```typescript
// lib/shopify/cart.ts
import { executeQuery } from './client';

const CREATE_CART_MUTATION = `
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
`;

const ADD_TO_CART_MUTATION = `
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
                  }
                  image {
                    url
                    altText
                    width
                    height
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
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function createCart() {
  try {
    const { cartCreate } = await executeQuery(CREATE_CART_MUTATION);
    
    if (cartCreate.userErrors.length > 0) {
      throw new Error(cartCreate.userErrors[0].message);
    }
    
    return cartCreate.cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    
    // Alternative cart creation method for fallback
    try {
      console.log('Trying alternative cart creation method...');
      const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
      const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
      
      const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Storefront-Access-Token': token!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation { cartCreate { cart { id checkoutUrl } userErrors { field message } } }`,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data.cartCreate.userErrors.length > 0) {
        throw new Error(data.data.cartCreate.userErrors[0].message);
      }
      
      return data.data.cartCreate.cart;
    } catch (fallbackError) {
      console.error('Alternative cart creation also failed:', fallbackError);
      throw error; // Throw the original error
    }
  }
}

export async function addToCart(cartId, variantId, quantity = 1) {
  try {
    const { cartLinesAdd } = await executeQuery(ADD_TO_CART_MUTATION, {
      cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity
        }
      ]
    });
    
    if (cartLinesAdd.userErrors.length > 0) {
      throw new Error(cartLinesAdd.userErrors[0].message);
    }
    
    return cartLinesAdd.cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}
```

## Testing Strategy

Our comprehensive testing strategy ensures reliable product synchronization:

### 1. Unit Tests

```typescript
// tests/unit/shopify.test.ts
import { getProduct, getProducts } from '@/lib/shopify/products';
import { executeQuery } from '@/lib/shopify/client';

// Mock the executeQuery function
jest.mock('@/lib/shopify/client', () => ({
  executeQuery: jest.fn(),
  isNetworkError: jest.fn(error => error.message?.includes('Failed to fetch')),
  isOnline: jest.fn(() => true),
}));

describe('Shopify Product API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should retrieve a product by handle', async () => {
    // Arrange
    const mockProduct = {
      id: 'gid://shopify/Product/123',
      title: 'Test Product',
      handle: 'test-product',
      // Add other required fields
    };
    
    (executeQuery as jest.Mock).mockResolvedValueOnce({ product: mockProduct });
    
    // Act
    const product = await getProduct('test-product');
    
    // Assert
    expect(executeQuery).toHaveBeenCalledWith(expect.any(String), { handle: 'test-product' });
    expect(product).toHaveProperty('id', mockProduct.id);
    expect(product).toHaveProperty('title', mockProduct.title);
  });
  
  it('should handle product not found', async () => {
    // Arrange
    (executeQuery as jest.Mock).mockResolvedValueOnce({ product: null });
    
    // Act
    const product = await getProduct('non-existent');
    
    // Assert
    expect(product).toBeNull();
  });
  
  it('should handle API errors gracefully', async () => {
    // Arrange
    (executeQuery as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    // Act
    const product = await getProduct('test-product');
    
    // Assert
    expect(product).toBeNull();
  });
});
```

### 2. Integration Tests

```typescript
// tests/integration/shopify.test.ts
import { testShopifyConnection } from '@/lib/shopify/diagnostics';

// These tests require actual Shopify credentials
describe('Shopify Integration Tests', () => {
  it('should successfully connect to Shopify API', async () => {
    // Act
    const result = await testShopifyConnection();
    
    // Assert
    expect(result.connection.success).toBe(true);
    expect(result.connection.data).toBeDefined();
    expect(result.connection.data.shop).toBeDefined();
    expect(result.connection.data.shop.name).toBeTruthy();
  });
  
  it('should be able to create a cart', async () => {
    // Act
    const result = await testShopifyConnection();
    
    // Assert
    expect(result.cartCreation.success).toBe(true);
    expect(result.cartCreation.data).toBeDefined();
    expect(result.cartCreation.data.id).toBeTruthy();
  });
});
```

### 3. End-to-End Tests

```typescript
// tests/e2e/product.test.ts
import { test, expect } from '@playwright/test';

test('should display product details', async ({ page }) => {
  // Arrange
  await page.goto('/products/test-product');
  
  // Act
  await page.waitForSelector('[data-testid="product-details"]');
  
  // Assert
  expect(await page.textContent('h1')).toContain('Test Product');
  expect(await page.isVisible('[data-testid="product-image"]')).toBeTruthy();
  expect(await page.isVisible('[data-testid="product-price"]')).toBeTruthy();
  expect(await page.isVisible('[data-testid="add-to-cart-button"]')).toBeTruthy();
});

test('should navigate through product collection', async ({ page }) => {
  // Arrange
  await page.goto('/collections/all');
  
  // Act
  await page.waitForSelector('[data-testid="product-grid"]');
  
  // Assert
  const productCards = await page.$$('[data-testid="product-card"]');
  expect(productCards.length).toBeGreaterThan(0);
  
  // Navigate to a product
  await productCards[0].click();
  await page.waitForSelector('[data-testid="product-details"]');
  expect(page.url()).toContain('/products/');
});
```

### 4. Performance Tests

```typescript
// tests/performance/product-loading.test.ts
import { test, expect } from '@playwright/test';

test('should load products within acceptable time', async ({ page }) => {
  // Start performance measurement
  const startTime = Date.now();
  
  // Navigate to the products page
  await page.goto('/collections/all');
  
  // Wait for products to load
  await page.waitForSelector('[data-testid="product-grid"]');
  
  // Calculate load time
  const loadTime = Date.now() - startTime;
  
  // Check if load time is within acceptable range
  expect(loadTime).toBeLessThan(3000);
});
```

### 5. Error Handling Tests

```typescript
// tests/error-handling/product-errors.test.ts
import { test, expect } from '@playwright/test';

test('should handle product loading errors gracefully', async ({ page }) => {
  // Mock a network error for product loading
  await page.route('**/api/2024-01/graphql.json', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({
        errors: [{ message: 'Internal Server Error' }]
      })
    });
  });
  
  // Navigate to the products page
  await page.goto('/collections/all');
  
  // Check if error message is displayed
  await page.waitForSelector('[data-testid="error-message"]');
  
  // Check if retry button is available
  expect(await page.$('[data-testid="retry-button"]')).toBeTruthy();
});
```

## Next Steps for Product Sync

1. Set up webhook handlers for inventory updates
2. Implement product filtering by tags/collections
3. Add search functionality with proper indexing
4. Set up image optimization pipeline
5. Create diagnostics tools for API connectivity
6. Implement comprehensive error handling
7. Set up performance monitoring for API calls
