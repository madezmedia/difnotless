### Shopify Integration Developer Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Setup](#setup)
3. [API Reference](#api-reference)
4. [Error Handling](#error-handling)
5. [Troubleshooting](#troubleshooting)
6. [Performance Considerations](#performance-considerations)
7. [Testing](#testing)


## Introduction

This documentation covers the integration between our headless e-commerce application and Shopify. The integration uses Shopify's Storefront API to fetch products, manage carts, and handle checkout processes.

### Key Features

- Product and collection retrieval
- Cart management
- Checkout process
- Error handling and recovery
- Offline support


## Setup

### Prerequisites

- Shopify store with Storefront API access
- Storefront API access token
- Node.js 16.x or higher
- Next.js 13.x or higher


### Environment Variables

Create a `.env.local` file in your project root with the following variables:

```plaintext
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
```

> **Important**: The `NEXT_PUBLIC_` prefix is required for the domain as it's used in client-side code. The access token should NOT have this prefix as it should only be used in server-side operations.



### Installation

1. Install required dependencies:


```shellscript
npm install graphql-request
```

2. Import the Shopify client in your application:


```typescript
import { getProduct, getCollection, createCart } from '@/lib/shopify';
```

## API Reference

### Products

#### Get All Products

```typescript
import { getAllProducts } from '@/lib/shopify';

// Get first 50 products
const { products, pageInfo } = await getAllProducts(50);

// Pagination
if (pageInfo.hasNextPage) {
  const nextPage = await getAllProducts(50, pageInfo.endCursor);
}
```

#### Get Product by Handle

```typescript
import { getProduct } from '@/lib/shopify';

const product = await getProduct('product-handle');

if (product) {
  // Product found
  console.log(product.title);
  console.log(product.price);
} else {
  // Product not found
}
```

#### Get Product Recommendations

```typescript
import { getProductRecommendations } from '@/lib/shopify';

const recommendations = await getProductRecommendations('gid://shopify/Product/123456789');
```

### Collections

#### Get All Collections

```typescript
import { getCollections } from '@/lib/shopify';

const collections = await getCollections();
```

#### Get Collection by Handle

```typescript
import { getCollection } from '@/lib/shopify';

const collection = await getCollection('collection-handle');

if (collection) {
  // Collection found
  console.log(collection.title);
  console.log(collection.products.length);
} else {
  // Collection not found
}
```

### Cart Operations

#### Create Cart

```typescript
import { createCart } from '@/lib/shopify';

const cart = await createCart();
console.log(cart.id); // Store this ID for future operations
console.log(cart.checkoutUrl); // URL to Shopify's checkout
```

#### Add Item to Cart

```typescript
import { addToCart } from '@/lib/shopify';

const updatedCart = await addToCart(cartId, variantId, quantity);
```

#### Update Cart Item

```typescript
import { updateCartItem } from '@/lib/shopify';

const updatedCart = await updateCartItem(cartId, lineId, newQuantity);
```

#### Remove Cart Item

```typescript
import { removeCartItem } from '@/lib/shopify';

const updatedCart = await removeCartItem(cartId, lineId);
```

#### Get Cart

```typescript
import { getCart } from '@/lib/shopify';

const cart = await getCart(cartId);

if (cart) {
  // Cart found
  console.log(cart.lines.length); // Number of items
  console.log(cart.cost.total); // Total cost
} else {
  // Cart not found or expired
}
```

#### Apply Discount Code

```typescript
import { applyDiscountCode } from '@/lib/shopify';

try {
  const updatedCart = await applyDiscountCode(cartId, 'DISCOUNT10');
  // Check if discount was applied
  const discountApplied = updatedCart.discountCodes.some(code => code.applicable);
} catch (error) {
  // Handle invalid discount code
}
```

### Search

```typescript
import { searchProducts } from '@/lib/shopify';

const searchResults = await searchProducts('t-shirt', 20);
```

## Error Handling

The Shopify integration includes robust error handling to ensure a smooth user experience even when issues occur.

### Retry Mechanism

API calls automatically retry on network failures:

```typescript
// This is handled internally by the shopify.ts module
const result = await executeQuery(query, variables);
```

The retry mechanism uses exponential backoff to avoid overwhelming the server.

### Offline Support

The integration detects when the user is offline and provides appropriate feedback:

```typescript
// Check if the device is online
const isOnline = () => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

// In cart operations
if (!isOnline()) {
  // Create offline cart or show appropriate message
}
```

### Error Types

The integration handles various error types:

1. **Network Errors**: Connectivity issues, timeouts
2. **API Errors**: Invalid requests, rate limiting
3. **Authentication Errors**: Invalid credentials
4. **Resource Errors**: Products or collections not found


### Error Logging

Errors are logged with detailed information to aid debugging:

```typescript
try {
  // API operation
} catch (error) {
  console.error('Operation failed:', error);
  
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
}
```

## Troubleshooting

### Common Issues

#### "Failed to fetch" Error

**Symptoms**: API calls fail with "Failed to fetch" error, especially during cart creation.

**Solutions**:

1. Check network connectivity
2. Verify Shopify store is operational
3. Ensure API credentials are correct
4. Check for CORS issues if testing locally


**Diagnostic Tool**:

```typescript
import { diagnoseShopifyConnection } from '@/lib/shopify-diagnostics';

const diagnostics = await diagnoseShopifyConnection();
console.log(diagnostics);
```

#### Cart Creation Failures

**Symptoms**: Unable to create a cart, receiving errors from Shopify API.

**Solutions**:

1. Verify Storefront API access token has correct permissions
2. Check if you're hitting API rate limits
3. Ensure your Shopify store is on a plan that supports the Storefront API
4. Try the alternative cart creation method:


```typescript
// Direct fetch instead of GraphQL client
const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
  method: "POST",
  headers: {
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `mutation { cartCreate { cart { id checkoutUrl } userErrors { field message } } }`,
  }),
});
```

#### Product Images Not Loading

**Symptoms**: Product images fail to load or show placeholder images.

**Solutions**:

1. Verify image URLs are correct
2. Check if images are published in Shopify
3. Ensure your domain is allowed in Shopify's CORS settings
4. Implement proper error handling for images:


```javascriptreact
<Image
  src={product.image || "/placeholder.svg"}
  alt={product.imageAlt || product.title}
  width={500}
  height={500}
  onError={(e) => {
    e.currentTarget.src = "/placeholder.svg";
  }}
/>
```

### Diagnostic Endpoint

The application includes a diagnostic endpoint to check Shopify connectivity:

```plaintext
GET /api/shopify-diagnostics
```

This endpoint returns:

- Environment variable status
- Connectivity test results
- Cart creation test results


## Performance Considerations

### Caching

Implement caching for product and collection data to reduce API calls:

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

### Pagination

Use pagination when fetching large collections:

```typescript
const { products, pageInfo } = await getAllProducts(20);

// Load more as needed
if (pageInfo.hasNextPage) {
  const nextPage = await getAllProducts(20, pageInfo.endCursor);
}
```

### Image Optimization

Use Next.js Image component for automatic optimization:

```javascriptreact
import Image from 'next/image';

<Image
  src={product.image || "/placeholder.svg"}
  alt={product.title}
  width={800}
  height={800}
  placeholder="blur"
  blurDataURL="/placeholder.svg"
/>
```

## Testing

### Unit Tests

Run unit tests for the Shopify integration:

```shellscript
npm run test:shopify:unit
```

### Integration Tests

Test actual connectivity with Shopify:

```shellscript
npm run test:shopify:integration
```

### End-to-End Tests

Test complete user flows:

```shellscript
npm run test:shopify:e2e
```

### Performance Tests

Measure response times:

```shellscript
npm run test:shopify:performance
```

### Error Handling Tests

Verify graceful error handling:

```shellscript
npm run test:shopify:error-handling
```

### Run All Tests

```shellscript
npm run test:shopify
```

---

# Project Memory Bank

## projectbrief.md

# Project Brief: Shopify Integration for Headless E-commerce

## Project Overview

This project involves integrating Shopify as the backend for our headless e-commerce application. We're building a custom frontend using Next.js while leveraging Shopify's robust e-commerce capabilities for product management, inventory, cart functionality, and checkout.

## Core Requirements

1. **Product Display**

1. Fetch and display products from Shopify
2. Support for collections, tags, and filtering
3. Product search functionality
4. Product recommendations



2. **Cart Management**

1. Add, update, and remove items
2. Apply discount codes
3. Calculate taxes and shipping
4. Persist cart between sessions



3. **Checkout Process**

1. Seamless handoff to Shopify checkout
2. Custom checkout UI with Shopify backend
3. Order confirmation and status tracking



4. **Performance & Reliability**

1. Fast page loads and API responses
2. Offline support where possible
3. Graceful error handling
4. Retry mechanisms for API failures



5. **User Experience**

1. Responsive design for all devices
2. Accessibility compliance
3. Intuitive shopping experience





## Technical Constraints

- Next.js App Router for frontend
- Shopify Storefront API for e-commerce functionality
- GraphQL for API communication
- TypeScript for type safety
- Tailwind CSS for styling


## Success Criteria

1. Successful product retrieval and display
2. Functional cart with real-time updates
3. Completed checkout process
4. Response times under 1 second for critical operations
5. 99.9% uptime for API connections
6. Comprehensive error handling and recovery


## Timeline

- Phase 1: Product display and basic navigation (2 weeks)
- Phase 2: Cart functionality and persistence (2 weeks)
- Phase 3: Checkout integration and order management (2 weeks)
- Phase 4: Performance optimization and testing (1 week)
- Phase 5: Launch preparation and final QA (1 week)


## productContext.md

# Product Context: Shopify Integration

## Business Problem

Our client, Different Not Less Apparel, sells sensory-friendly apparel celebrating AAC (Augmentative and Alternative Communication) and autism acceptance. They need a custom e-commerce experience that aligns with their brand values while maintaining the robust backend capabilities of Shopify.

Traditional Shopify themes don't provide the level of customization and performance they need, particularly for:

- Highlighting the sensory-friendly aspects of products
- Creating an accessible shopping experience
- Providing detailed product information specific to their niche
- Offering a seamless mobile experience for their predominantly mobile user base


## User Experience Goals

1. **Intuitive Product Discovery**

1. Clear categorization by collection (Your Words Matter, Different Not Less, SLP Professional, BCBA/RBT)
2. Filtering by sensory features (tagless, material type, etc.)
3. Detailed product information focused on sensory aspects



2. **Seamless Shopping Experience**

1. Fast page loads (<1 second perceived load time)
2. Persistent cart across devices
3. Clear visibility of cart contents and total
4. Simple checkout process



3. **Accessibility First**

1. WCAG 2.1 AA compliance
2. Screen reader friendly
3. Keyboard navigation support
4. Color contrast considerations
5. Reduced motion options



4. **Trust Building**

1. Clear product information
2. Transparent pricing
3. Visible shipping policies
4. Easy returns process





## Key User Flows

1. **Product Discovery**

1. Browse collections
2. Filter by product features
3. Search for specific items
4. View recommended products



2. **Product Evaluation**

1. View detailed product information
2. See sensory specifications
3. Read customer reviews
4. View product images from multiple angles



3. **Purchase Process**

1. Add items to cart
2. Modify cart (change quantity, remove items)
3. Apply discount codes
4. Complete checkout



4. **Post-Purchase**

1. Receive order confirmation
2. Track order status
3. Initiate returns if needed





## Target Audience

1. **Parents and Caregivers of Neurodivergent Individuals**

1. Need detailed sensory information
2. Value accessibility and ease of use
3. Often shopping on mobile while multitasking



2. **Speech-Language Pathologists (SLPs)**

1. Looking for professional apparel
2. Value quality and durability
3. Appreciate educational resources



3. **Behavior Analysts (BCBAs/RBTs)**

1. Need professional yet comfortable attire
2. Value ethical production methods
3. Appreciate neurodiversity-affirming messaging



4. **Neurodivergent Individuals**

1. Need accessible shopping experience
2. Value sensory-friendly products
3. Appreciate inclusive design and messaging





## Success Metrics

1. **Conversion Rate**: Target 3% (industry average is 1.5-2%)
2. **Cart Abandonment Rate**: Target <65% (industry average is 70-75%)
3. **Page Load Time**: Target <1 second
4. **Mobile Conversion Rate**: Target within 0.5% of desktop
5. **Customer Satisfaction**: Target 4.5/5 stars


## activeContext.md

# Active Context: Shopify Integration

## Current Focus

We're currently focused on improving the reliability of the Shopify integration, particularly around cart creation and management. Recent testing revealed intermittent "Failed to fetch" errors during cart creation, which we've addressed through enhanced error handling and retry mechanisms.

## Recent Changes

1. **Enhanced Error Handling**

1. Implemented retry logic with exponential backoff
2. Added detailed error logging
3. Created fallback mechanisms for offline scenarios
4. Improved error messages for better debugging



2. **Cart Reliability Improvements**

1. Added alternative cart creation method as fallback
2. Implemented offline cart support
3. Enhanced timeout handling
4. Added keepalive for network connections



3. **Diagnostic Tools**

1. Created diagnostic utility for Shopify connectivity
2. Added API endpoint for running diagnostics
3. Implemented comprehensive testing strategy





## Next Steps

1. **Testing Implementation**

1. Implement unit tests for all Shopify API functions
2. Create integration tests for actual Shopify connectivity
3. Develop end-to-end tests for user flows
4. Add performance tests for response times
5. Implement error handling tests



2. **Documentation**

1. Create comprehensive developer documentation
2. Document error handling strategies
3. Create troubleshooting guide
4. Document testing procedures



3. **Performance Optimization**

1. Implement caching for product and collection data
2. Optimize image loading and processing
3. Reduce unnecessary API calls
4. Implement pagination for large collections





## Active Decisions

1. **Error Handling Strategy**

1. Decision: Implement automatic retries with exponential backoff
2. Rationale: Provides resilience against temporary network issues
3. Trade-offs: Slightly increased complexity, potential for delayed error reporting



2. **Cart Persistence**

1. Decision: Store cart ID in localStorage with fallback to cookies
2. Rationale: Provides cross-session persistence with good browser support
3. Trade-offs: Limited to single device, potential privacy implications



3. **API Client Implementation**

1. Decision: Use GraphQL client with custom fetch options
2. Rationale: Provides type safety and efficient data fetching
3. Trade-offs: Additional dependency, learning curve for developers





## Recent Learnings

1. **Shopify API Reliability**

1. The Storefront API can experience intermittent issues
2. Implementing robust error handling is critical
3. Having fallback mechanisms improves user experience



2. **Cart Creation Challenges**

1. Cart creation is particularly sensitive to network conditions
2. Alternative creation methods can improve reliability
3. Offline support is essential for mobile users



3. **Testing Importance**

1. Comprehensive testing is crucial for e-commerce reliability
2. Different test types catch different issues
3. Automated testing in CI/CD prevents regressions





## systemPatterns.md

# System Patterns: Shopify Integration

## Architecture Overview

Our headless e-commerce application follows a client-server architecture with Next.js App Router, leveraging both server and client components for optimal performance.

```mermaid
Diagram.download-icon {
            cursor: pointer;
            transform-origin: center;
        }
        .download-icon .arrow-part {
            transition: transform 0.35s cubic-bezier(0.35, 0.2, 0.14, 0.95);
             transform-origin: center;
        }
        button:has(.download-icon):hover .download-icon .arrow-part, button:has(.download-icon):focus-visible .download-icon .arrow-part {
          transform: translateY(-1.5px);
        }
        #mermaid-diagram-rn19{font-family:var(--font-geist-sans);font-size:12px;fill:#000000;}#mermaid-diagram-rn19 .error-icon{fill:#552222;}#mermaid-diagram-rn19 .error-text{fill:#552222;stroke:#552222;}#mermaid-diagram-rn19 .edge-thickness-normal{stroke-width:1px;}#mermaid-diagram-rn19 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-diagram-rn19 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-diagram-rn19 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-diagram-rn19 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-diagram-rn19 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-diagram-rn19 .marker{fill:#666;stroke:#666;}#mermaid-diagram-rn19 .marker.cross{stroke:#666;}#mermaid-diagram-rn19 svg{font-family:var(--font-geist-sans);font-size:12px;}#mermaid-diagram-rn19 p{margin:0;}#mermaid-diagram-rn19 .label{font-family:var(--font-geist-sans);color:#000000;}#mermaid-diagram-rn19 .cluster-label text{fill:#333;}#mermaid-diagram-rn19 .cluster-label span{color:#333;}#mermaid-diagram-rn19 .cluster-label span p{background-color:transparent;}#mermaid-diagram-rn19 .label text,#mermaid-diagram-rn19 span{fill:#000000;color:#000000;}#mermaid-diagram-rn19 .node rect,#mermaid-diagram-rn19 .node circle,#mermaid-diagram-rn19 .node ellipse,#mermaid-diagram-rn19 .node polygon,#mermaid-diagram-rn19 .node path{fill:#eee;stroke:#999;stroke-width:1px;}#mermaid-diagram-rn19 .rough-node .label text,#mermaid-diagram-rn19 .node .label text{text-anchor:middle;}#mermaid-diagram-rn19 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-diagram-rn19 .node .label{text-align:center;}#mermaid-diagram-rn19 .node.clickable{cursor:pointer;}#mermaid-diagram-rn19 .arrowheadPath{fill:#333333;}#mermaid-diagram-rn19 .edgePath .path{stroke:#666;stroke-width:2.0px;}#mermaid-diagram-rn19 .flowchart-link{stroke:#666;fill:none;}#mermaid-diagram-rn19 .edgeLabel{background-color:white;text-align:center;}#mermaid-diagram-rn19 .edgeLabel p{background-color:white;}#mermaid-diagram-rn19 .edgeLabel rect{opacity:0.5;background-color:white;fill:white;}#mermaid-diagram-rn19 .labelBkg{background-color:rgba(255, 255, 255, 0.5);}#mermaid-diagram-rn19 .cluster rect{fill:hsl(0, 0%, 98.9215686275%);stroke:#707070;stroke-width:1px;}#mermaid-diagram-rn19 .cluster text{fill:#333;}#mermaid-diagram-rn19 .cluster span{color:#333;}#mermaid-diagram-rn19 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:var(--font-geist-sans);font-size:12px;background:hsl(-160, 0%, 93.3333333333%);border:1px solid #707070;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-diagram-rn19 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#000000;}#mermaid-diagram-rn19 .flowchart-link{stroke:hsl(var(--gray-400));stroke-width:1px;}#mermaid-diagram-rn19 .marker,#mermaid-diagram-rn19 marker,#mermaid-diagram-rn19 marker *{fill:hsl(var(--gray-400))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rn19 .label,#mermaid-diagram-rn19 text,#mermaid-diagram-rn19 text>tspan{fill:hsl(var(--black))!important;color:hsl(var(--black))!important;}#mermaid-diagram-rn19 .background,#mermaid-diagram-rn19 rect.relationshipLabelBox{fill:hsl(var(--white))!important;}#mermaid-diagram-rn19 .entityBox,#mermaid-diagram-rn19 .attributeBoxEven{fill:hsl(var(--gray-150))!important;}#mermaid-diagram-rn19 .attributeBoxOdd{fill:hsl(var(--white))!important;}#mermaid-diagram-rn19 .label-container,#mermaid-diagram-rn19 rect.actor{fill:hsl(var(--white))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rn19 line{stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rn19 :root{--mermaid-font-family:var(--font-geist-sans);}Client BrowserNext.js AppServer ComponentsClient ComponentsShopify Storefront APICart Context Provider
```

## Key Components

### 1. Shopify API Client (`lib/shopify.ts`)

Central module for all Shopify API interactions, implementing:

- GraphQL client configuration
- Query and mutation functions
- Error handling and retries
- Response transformation


```typescript
// Core pattern for API requests
async function executeQuery(query: string, variables?: any, retries = 3) {
  // Retry logic with exponential backoff
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await shopifyClient.request(query, variables);
      return result;
    } catch (error) {
      // Handle network errors differently
      if (isNetworkError(error)) {
        await exponentialBackoff(attempt);
        continue;
      }
      throw error;
    }
  }
}
```

### 2. Cart Management System

Implements the cart functionality using React Context for state management:

```mermaid
Diagram.download-icon {
            cursor: pointer;
            transform-origin: center;
        }
        .download-icon .arrow-part {
            transition: transform 0.35s cubic-bezier(0.35, 0.2, 0.14, 0.95);
             transform-origin: center;
        }
        button:has(.download-icon):hover .download-icon .arrow-part, button:has(.download-icon):focus-visible .download-icon .arrow-part {
          transform: translateY(-1.5px);
        }
        #mermaid-diagram-rnh0{font-family:var(--font-geist-sans);font-size:12px;fill:#000000;}#mermaid-diagram-rnh0 .error-icon{fill:#552222;}#mermaid-diagram-rnh0 .error-text{fill:#552222;stroke:#552222;}#mermaid-diagram-rnh0 .edge-thickness-normal{stroke-width:1px;}#mermaid-diagram-rnh0 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-diagram-rnh0 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-diagram-rnh0 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-diagram-rnh0 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-diagram-rnh0 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-diagram-rnh0 .marker{fill:#666;stroke:#666;}#mermaid-diagram-rnh0 .marker.cross{stroke:#666;}#mermaid-diagram-rnh0 svg{font-family:var(--font-geist-sans);font-size:12px;}#mermaid-diagram-rnh0 p{margin:0;}#mermaid-diagram-rnh0 .label{font-family:var(--font-geist-sans);color:#000000;}#mermaid-diagram-rnh0 .cluster-label text{fill:#333;}#mermaid-diagram-rnh0 .cluster-label span{color:#333;}#mermaid-diagram-rnh0 .cluster-label span p{background-color:transparent;}#mermaid-diagram-rnh0 .label text,#mermaid-diagram-rnh0 span{fill:#000000;color:#000000;}#mermaid-diagram-rnh0 .node rect,#mermaid-diagram-rnh0 .node circle,#mermaid-diagram-rnh0 .node ellipse,#mermaid-diagram-rnh0 .node polygon,#mermaid-diagram-rnh0 .node path{fill:#eee;stroke:#999;stroke-width:1px;}#mermaid-diagram-rnh0 .rough-node .label text,#mermaid-diagram-rnh0 .node .label text{text-anchor:middle;}#mermaid-diagram-rnh0 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-diagram-rnh0 .node .label{text-align:center;}#mermaid-diagram-rnh0 .node.clickable{cursor:pointer;}#mermaid-diagram-rnh0 .arrowheadPath{fill:#333333;}#mermaid-diagram-rnh0 .edgePath .path{stroke:#666;stroke-width:2.0px;}#mermaid-diagram-rnh0 .flowchart-link{stroke:#666;fill:none;}#mermaid-diagram-rnh0 .edgeLabel{background-color:white;text-align:center;}#mermaid-diagram-rnh0 .edgeLabel p{background-color:white;}#mermaid-diagram-rnh0 .edgeLabel rect{opacity:0.5;background-color:white;fill:white;}#mermaid-diagram-rnh0 .labelBkg{background-color:rgba(255, 255, 255, 0.5);}#mermaid-diagram-rnh0 .cluster rect{fill:hsl(0, 0%, 98.9215686275%);stroke:#707070;stroke-width:1px;}#mermaid-diagram-rnh0 .cluster text{fill:#333;}#mermaid-diagram-rnh0 .cluster span{color:#333;}#mermaid-diagram-rnh0 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:var(--font-geist-sans);font-size:12px;background:hsl(-160, 0%, 93.3333333333%);border:1px solid #707070;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-diagram-rnh0 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#000000;}#mermaid-diagram-rnh0 .flowchart-link{stroke:hsl(var(--gray-400));stroke-width:1px;}#mermaid-diagram-rnh0 .marker,#mermaid-diagram-rnh0 marker,#mermaid-diagram-rnh0 marker *{fill:hsl(var(--gray-400))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rnh0 .label,#mermaid-diagram-rnh0 text,#mermaid-diagram-rnh0 text>tspan{fill:hsl(var(--black))!important;color:hsl(var(--black))!important;}#mermaid-diagram-rnh0 .background,#mermaid-diagram-rnh0 rect.relationshipLabelBox{fill:hsl(var(--white))!important;}#mermaid-diagram-rnh0 .entityBox,#mermaid-diagram-rnh0 .attributeBoxEven{fill:hsl(var(--gray-150))!important;}#mermaid-diagram-rnh0 .attributeBoxOdd{fill:hsl(var(--white))!important;}#mermaid-diagram-rnh0 .label-container,#mermaid-diagram-rnh0 rect.actor{fill:hsl(var(--white))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rnh0 line{stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rnh0 :root{--mermaid-font-family:var(--font-geist-sans);}CartProviderCartContextuseCart HookUI ComponentslocalStorageShopify API
```

Key patterns:

- Context provider for global cart state
- Hooks for component access
- Local storage for persistence
- Error boundary for resilience


### 3. Product Retrieval System

Server components fetch product data directly from Shopify:

```typescript
// Server Component Pattern
export async function ProductDetails({ handle }) {
  const product = await getProduct(handle);
  
  if (!product) {
    notFound();
  }
  
  return <ProductDisplay product={product} />;
}
```

### 4. Error Handling Pattern

Comprehensive error handling strategy:

```mermaid
Diagram.download-icon {
            cursor: pointer;
            transform-origin: center;
        }
        .download-icon .arrow-part {
            transition: transform 0.35s cubic-bezier(0.35, 0.2, 0.14, 0.95);
             transform-origin: center;
        }
        button:has(.download-icon):hover .download-icon .arrow-part, button:has(.download-icon):focus-visible .download-icon .arrow-part {
          transform: translateY(-1.5px);
        }
        #mermaid-diagram-rni1{font-family:var(--font-geist-sans);font-size:12px;fill:#000000;}#mermaid-diagram-rni1 .error-icon{fill:#552222;}#mermaid-diagram-rni1 .error-text{fill:#552222;stroke:#552222;}#mermaid-diagram-rni1 .edge-thickness-normal{stroke-width:1px;}#mermaid-diagram-rni1 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-diagram-rni1 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-diagram-rni1 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-diagram-rni1 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-diagram-rni1 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-diagram-rni1 .marker{fill:#666;stroke:#666;}#mermaid-diagram-rni1 .marker.cross{stroke:#666;}#mermaid-diagram-rni1 svg{font-family:var(--font-geist-sans);font-size:12px;}#mermaid-diagram-rni1 p{margin:0;}#mermaid-diagram-rni1 .label{font-family:var(--font-geist-sans);color:#000000;}#mermaid-diagram-rni1 .cluster-label text{fill:#333;}#mermaid-diagram-rni1 .cluster-label span{color:#333;}#mermaid-diagram-rni1 .cluster-label span p{background-color:transparent;}#mermaid-diagram-rni1 .label text,#mermaid-diagram-rni1 span{fill:#000000;color:#000000;}#mermaid-diagram-rni1 .node rect,#mermaid-diagram-rni1 .node circle,#mermaid-diagram-rni1 .node ellipse,#mermaid-diagram-rni1 .node polygon,#mermaid-diagram-rni1 .node path{fill:#eee;stroke:#999;stroke-width:1px;}#mermaid-diagram-rni1 .rough-node .label text,#mermaid-diagram-rni1 .node .label text{text-anchor:middle;}#mermaid-diagram-rni1 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-diagram-rni1 .node .label{text-align:center;}#mermaid-diagram-rni1 .node.clickable{cursor:pointer;}#mermaid-diagram-rni1 .arrowheadPath{fill:#333333;}#mermaid-diagram-rni1 .edgePath .path{stroke:#666;stroke-width:2.0px;}#mermaid-diagram-rni1 .flowchart-link{stroke:#666;fill:none;}#mermaid-diagram-rni1 .edgeLabel{background-color:white;text-align:center;}#mermaid-diagram-rni1 .edgeLabel p{background-color:white;}#mermaid-diagram-rni1 .edgeLabel rect{opacity:0.5;background-color:white;fill:white;}#mermaid-diagram-rni1 .labelBkg{background-color:rgba(255, 255, 255, 0.5);}#mermaid-diagram-rni1 .cluster rect{fill:hsl(0, 0%, 98.9215686275%);stroke:#707070;stroke-width:1px;}#mermaid-diagram-rni1 .cluster text{fill:#333;}#mermaid-diagram-rni1 .cluster span{color:#333;}#mermaid-diagram-rni1 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:var(--font-geist-sans);font-size:12px;background:hsl(-160, 0%, 93.3333333333%);border:1px solid #707070;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-diagram-rni1 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#000000;}#mermaid-diagram-rni1 .flowchart-link{stroke:hsl(var(--gray-400));stroke-width:1px;}#mermaid-diagram-rni1 .marker,#mermaid-diagram-rni1 marker,#mermaid-diagram-rni1 marker *{fill:hsl(var(--gray-400))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rni1 .label,#mermaid-diagram-rni1 text,#mermaid-diagram-rni1 text>tspan{fill:hsl(var(--black))!important;color:hsl(var(--black))!important;}#mermaid-diagram-rni1 .background,#mermaid-diagram-rni1 rect.relationshipLabelBox{fill:hsl(var(--white))!important;}#mermaid-diagram-rni1 .entityBox,#mermaid-diagram-rni1 .attributeBoxEven{fill:hsl(var(--gray-150))!important;}#mermaid-diagram-rni1 .attributeBoxOdd{fill:hsl(var(--white))!important;}#mermaid-diagram-rni1 .label-container,#mermaid-diagram-rni1 rect.actor{fill:hsl(var(--white))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rni1 line{stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rni1 :root{--mermaid-font-family:var(--font-geist-sans);}YesYesNoNoYesNoAPI CallTry/CatchNetwork Error?Retry with BackoffMax Retries?Use FallbackOther Error?Log ErrorShow User MessageReturn Result
```

## Data Flow

### Product Data Flow

```mermaid
Diagram.download-icon {
            cursor: pointer;
            transform-origin: center;
        }
        .download-icon .arrow-part {
            transition: transform 0.35s cubic-bezier(0.35, 0.2, 0.14, 0.95);
             transform-origin: center;
        }
        button:has(.download-icon):hover .download-icon .arrow-part, button:has(.download-icon):focus-visible .download-icon .arrow-part {
          transform: translateY(-1.5px);
        }
        #mermaid-diagram-rni9{font-family:var(--font-geist-sans);font-size:12px;fill:#000000;}#mermaid-diagram-rni9 .error-icon{fill:#552222;}#mermaid-diagram-rni9 .error-text{fill:#552222;stroke:#552222;}#mermaid-diagram-rni9 .edge-thickness-normal{stroke-width:1px;}#mermaid-diagram-rni9 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-diagram-rni9 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-diagram-rni9 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-diagram-rni9 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-diagram-rni9 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-diagram-rni9 .marker{fill:#666;stroke:#666;}#mermaid-diagram-rni9 .marker.cross{stroke:#666;}#mermaid-diagram-rni9 svg{font-family:var(--font-geist-sans);font-size:12px;}#mermaid-diagram-rni9 p{margin:0;}#mermaid-diagram-rni9 .label{font-family:var(--font-geist-sans);color:#000000;}#mermaid-diagram-rni9 .cluster-label text{fill:#333;}#mermaid-diagram-rni9 .cluster-label span{color:#333;}#mermaid-diagram-rni9 .cluster-label span p{background-color:transparent;}#mermaid-diagram-rni9 .label text,#mermaid-diagram-rni9 span{fill:#000000;color:#000000;}#mermaid-diagram-rni9 .node rect,#mermaid-diagram-rni9 .node circle,#mermaid-diagram-rni9 .node ellipse,#mermaid-diagram-rni9 .node polygon,#mermaid-diagram-rni9 .node path{fill:#eee;stroke:#999;stroke-width:1px;}#mermaid-diagram-rni9 .rough-node .label text,#mermaid-diagram-rni9 .node .label text{text-anchor:middle;}#mermaid-diagram-rni9 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-diagram-rni9 .node .label{text-align:center;}#mermaid-diagram-rni9 .node.clickable{cursor:pointer;}#mermaid-diagram-rni9 .arrowheadPath{fill:#333333;}#mermaid-diagram-rni9 .edgePath .path{stroke:#666;stroke-width:2.0px;}#mermaid-diagram-rni9 .flowchart-link{stroke:#666;fill:none;}#mermaid-diagram-rni9 .edgeLabel{background-color:white;text-align:center;}#mermaid-diagram-rni9 .edgeLabel p{background-color:white;}#mermaid-diagram-rni9 .edgeLabel rect{opacity:0.5;background-color:white;fill:white;}#mermaid-diagram-rni9 .labelBkg{background-color:rgba(255, 255, 255, 0.5);}#mermaid-diagram-rni9 .cluster rect{fill:hsl(0, 0%, 98.9215686275%);stroke:#707070;stroke-width:1px;}#mermaid-diagram-rni9 .cluster text{fill:#333;}#mermaid-diagram-rni9 .cluster span{color:#333;}#mermaid-diagram-rni9 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:var(--font-geist-sans);font-size:12px;background:hsl(-160, 0%, 93.3333333333%);border:1px solid #707070;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-diagram-rni9 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#000000;}#mermaid-diagram-rni9 .flowchart-link{stroke:hsl(var(--gray-400));stroke-width:1px;}#mermaid-diagram-rni9 .marker,#mermaid-diagram-rni9 marker,#mermaid-diagram-rni9 marker *{fill:hsl(var(--gray-400))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rni9 .label,#mermaid-diagram-rni9 text,#mermaid-diagram-rni9 text>tspan{fill:hsl(var(--black))!important;color:hsl(var(--black))!important;}#mermaid-diagram-rni9 .background,#mermaid-diagram-rni9 rect.relationshipLabelBox{fill:hsl(var(--white))!important;}#mermaid-diagram-rni9 .entityBox,#mermaid-diagram-rni9 .attributeBoxEven{fill:hsl(var(--gray-150))!important;}#mermaid-diagram-rni9 .attributeBoxOdd{fill:hsl(var(--white))!important;}#mermaid-diagram-rni9 .label-container,#mermaid-diagram-rni9 rect.actor{fill:hsl(var(--white))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rni9 line{stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rni9 :root{--mermaid-font-family:var(--font-geist-sans);}ShopifyServer ComponentPropsClient ComponentUser Interface
```

### Cart Data Flow

```mermaid
Diagram.download-icon {
            cursor: pointer;
            transform-origin: center;
        }
        .download-icon .arrow-part {
            transition: transform 0.35s cubic-bezier(0.35, 0.2, 0.14, 0.95);
             transform-origin: center;
        }
        button:has(.download-icon):hover .download-icon .arrow-part, button:has(.download-icon):focus-visible .download-icon .arrow-part {
          transform: translateY(-1.5px);
        }
        #mermaid-diagram-ro10{font-family:var(--font-geist-sans);font-size:12px;fill:#000000;}#mermaid-diagram-ro10 .error-icon{fill:#552222;}#mermaid-diagram-ro10 .error-text{fill:#552222;stroke:#552222;}#mermaid-diagram-ro10 .edge-thickness-normal{stroke-width:1px;}#mermaid-diagram-ro10 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-diagram-ro10 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-diagram-ro10 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-diagram-ro10 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-diagram-ro10 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-diagram-ro10 .marker{fill:#666;stroke:#666;}#mermaid-diagram-ro10 .marker.cross{stroke:#666;}#mermaid-diagram-ro10 svg{font-family:var(--font-geist-sans);font-size:12px;}#mermaid-diagram-ro10 p{margin:0;}#mermaid-diagram-ro10 .label{font-family:var(--font-geist-sans);color:#000000;}#mermaid-diagram-ro10 .cluster-label text{fill:#333;}#mermaid-diagram-ro10 .cluster-label span{color:#333;}#mermaid-diagram-ro10 .cluster-label span p{background-color:transparent;}#mermaid-diagram-ro10 .label text,#mermaid-diagram-ro10 span{fill:#000000;color:#000000;}#mermaid-diagram-ro10 .node rect,#mermaid-diagram-ro10 .node circle,#mermaid-diagram-ro10 .node ellipse,#mermaid-diagram-ro10 .node polygon,#mermaid-diagram-ro10 .node path{fill:#eee;stroke:#999;stroke-width:1px;}#mermaid-diagram-ro10 .rough-node .label text,#mermaid-diagram-ro10 .node .label text{text-anchor:middle;}#mermaid-diagram-ro10 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-diagram-ro10 .node .label{text-align:center;}#mermaid-diagram-ro10 .node.clickable{cursor:pointer;}#mermaid-diagram-ro10 .arrowheadPath{fill:#333333;}#mermaid-diagram-ro10 .edgePath .path{stroke:#666;stroke-width:2.0px;}#mermaid-diagram-ro10 .flowchart-link{stroke:#666;fill:none;}#mermaid-diagram-ro10 .edgeLabel{background-color:white;text-align:center;}#mermaid-diagram-ro10 .edgeLabel p{background-color:white;}#mermaid-diagram-ro10 .edgeLabel rect{opacity:0.5;background-color:white;fill:white;}#mermaid-diagram-ro10 .labelBkg{background-color:rgba(255, 255, 255, 0.5);}#mermaid-diagram-ro10 .cluster rect{fill:hsl(0, 0%, 98.9215686275%);stroke:#707070;stroke-width:1px;}#mermaid-diagram-ro10 .cluster text{fill:#333;}#mermaid-diagram-ro10 .cluster span{color:#333;}#mermaid-diagram-ro10 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:var(--font-geist-sans);font-size:12px;background:hsl(-160, 0%, 93.3333333333%);border:1px solid #707070;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-diagram-ro10 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#000000;}#mermaid-diagram-ro10 .flowchart-link{stroke:hsl(var(--gray-400));stroke-width:1px;}#mermaid-diagram-ro10 .marker,#mermaid-diagram-ro10 marker,#mermaid-diagram-ro10 marker *{fill:hsl(var(--gray-400))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-ro10 .label,#mermaid-diagram-ro10 text,#mermaid-diagram-ro10 text>tspan{fill:hsl(var(--black))!important;color:hsl(var(--black))!important;}#mermaid-diagram-ro10 .background,#mermaid-diagram-ro10 rect.relationshipLabelBox{fill:hsl(var(--white))!important;}#mermaid-diagram-ro10 .entityBox,#mermaid-diagram-ro10 .attributeBoxEven{fill:hsl(var(--gray-150))!important;}#mermaid-diagram-ro10 .attributeBoxOdd{fill:hsl(var(--white))!important;}#mermaid-diagram-ro10 .label-container,#mermaid-diagram-ro10 rect.actor{fill:hsl(var(--white))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-ro10 line{stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-ro10 :root{--mermaid-font-family:var(--font-geist-sans);}User ActionClient ComponentCart ContextShopify APIUI Update
```

## Critical Implementation Paths

### 1. Cart Creation

```plaintext
User visits site → Check for existing cart ID → 
If exists: Fetch cart → If valid: Use cart → If invalid: Create new cart →
If doesn't exist: Create new cart →
Store cart ID in localStorage
```

### 2. Add to Cart Flow

```plaintext
User clicks "Add to Cart" → Get cart ID → 
If no cart: Create cart → 
Add item to cart → Update cart state → Show confirmation →
Handle errors with retry → Fallback to offline cart if needed
```

### 3. Checkout Flow

```plaintext
User clicks "Checkout" → Validate cart → 
Update buyer identity if needed → 
Redirect to Shopify checkout URL →
Handle checkout completion via webhook
```

## Design Patterns

1. **Repository Pattern**: Encapsulates Shopify API logic
2. **Provider Pattern**: Manages cart state globally
3. **Adapter Pattern**: Transforms Shopify data to application models
4. **Strategy Pattern**: Implements different error handling strategies
5. **Factory Pattern**: Creates appropriate cart implementations


## techContext.md

# Technical Context: Shopify Integration

## Technologies Used

### Frontend

- **Next.js 14**: React framework with App Router
- **React 18**: UI library with server components
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI


### Backend & API

- **Shopify Storefront API**: E-commerce functionality
- **GraphQL**: API query language
- **graphql-request**: Lightweight GraphQL client


### State Management

- **React Context**: For cart state
- **localStorage**: For cart persistence


### Testing

- **Vitest**: Unit and integration testing
- **Playwright**: End-to-end testing
- **MSW**: API mocking


### DevOps

- **GitHub Actions**: CI/CD
- **Vercel**: Hosting and deployment


## Development Setup

### Environment Variables

```plaintext
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
```

### Local Development

```shellscript
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test:shopify
```

## Technical Constraints

### Shopify API Limitations

- **Rate Limits**: 1000 requests per minute per IP
- **Query Complexity**: Maximum of 1000 points per query
- **Connection Timeout**: 10 seconds
- **API Versions**: Updated quarterly, support for 1 year


### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 not supported
- Mobile browsers (iOS Safari, Android Chrome)


### Performance Targets

- **Time to First Byte (TTFB)**: < 200ms
- **First Contentful Paint (FCP)**: < 1s
- **Time to Interactive (TTI)**: < 2s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1


## Dependencies

### Core Dependencies

- **next**: ^14.0.0
- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **graphql**: ^16.8.0
- **graphql-request**: ^6.1.0
- **tailwindcss**: ^3.3.0


### Development Dependencies

- **typescript**: ^5.0.0
- **@types/react**: ^18.2.0
- **@types/node**: ^20.0.0
- **vitest**: ^0.34.0
- **@playwright/test**: ^1.38.0


## Tool Usage Patterns

### GraphQL Client

```typescript
// Initialize client
const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
  },
});

// Execute query
const data = await shopifyClient.request(query, variables);
```

### Error Handling

```typescript
try {
  const result = await executeQuery(query, variables);
  return result;
} catch (error) {
  console.error("API Error:", error);
  // Handle specific error types
  if (isNetworkError(error)) {
    // Handle network errors
  } else if (isGraphQLError(error)) {
    // Handle GraphQL errors
  }
  throw error;
}
```

### Testing Pattern

```typescript
// Unit test
test('should retrieve product by handle', async () => {
  // Arrange
  mockShopifyClient.request.mockResolvedValue({ product: mockProduct });
  
  // Act
  const result = await getProduct('test-product');
  
  // Assert
  expect(result).toEqual(expect.objectContaining({
    id: mockProduct.id,
    title: mockProduct.title,
  }));
});
```

## progress.md

# Progress: Shopify Integration

## Completed Features

### Product Display

- ✅ Product listing page
- ✅ Product detail page
- ✅ Collection pages
- ✅ Product search
- ✅ Product filtering
- ✅ Product recommendations


### Cart Functionality

- ✅ Cart creation
- ✅ Add to cart
- ✅ Update cart items
- ✅ Remove cart items
- ✅ Cart persistence
- ✅ Cart drawer UI


### Error Handling

- ✅ Retry mechanism for API calls
- ✅ Fallback for offline scenarios
- ✅ Detailed error logging
- ✅ User-friendly error messages
- ✅ Diagnostic tools


## In Progress

### Testing Implementation

- 🔄 Unit tests for API functions
- 🔄 Integration tests for Shopify connectivity
- 🔄 End-to-end tests for user flows
- 🔄 Performance tests
- 🔄 Error handling tests


### Documentation

- 🔄 Developer documentation
- 🔄 Testing documentation
- 🔄 Project memory bank


## Upcoming Work

### Performance Optimization

- ⏳ Implement caching for product data
- ⏳ Optimize image loading
- ⏳ Reduce unnecessary API calls
- ⏳ Implement pagination for large collections


### Checkout Enhancement

- ⏳ Custom checkout UI
- ⏳ Address validation
- ⏳ Shipping method selection
- ⏳ Payment method integration


## Known Issues

1. **Intermittent Cart Creation Failures**

1. Issue: "Failed to fetch" errors during cart creation
2. Status: Partially resolved with retry mechanism
3. Next steps: Implement comprehensive testing



2. **Mobile Performance**

1. Issue: Slower load times on mobile devices
2. Status: Identified, not yet addressed
3. Next steps: Optimize image loading, implement code splitting



3. **Offline Support Limitations**

1. Issue: Limited functionality when offline
2. Status: Basic offline cart implemented
3. Next steps: Enhance offline experience with service workers





## Recent Milestones

1. **Cart Reliability Improvements** (April 1, 2025)

1. Enhanced error handling
2. Implemented retry mechanism
3. Added fallback methods



2. **Diagnostic Tools Implementation** (April 2, 2025)

1. Created diagnostic utility
2. Added API endpoint for diagnostics
3. Implemented logging improvements



3. **Testing Strategy Development** (April 3, 2025)

1. Designed comprehensive testing approach
2. Created test utilities
3. Implemented initial test cases





## Decision Log

| Date | Decision | Rationale | Status
|-----|-----|-----|-----
| Mar 15, 2025 | Use GraphQL client | Type safety, efficient data fetching | Implemented
| Mar 20, 2025 | Store cart in localStorage | Cross-session persistence | Implemented
| Mar 25, 2025 | Implement retry mechanism | Resilience against network issues | Implemented
| Apr 1, 2025 | Add alternative cart creation | Fallback for API issues | Implemented
| Apr 3, 2025 | Develop comprehensive testing | Ensure reliability | In progress


## shopify-integration.md

# Shopify Integration Details

## API Structure

The Shopify integration is built around the Storefront API, which provides access to products, collections, cart functionality, and checkout.

### Core API Functions

```mermaid
Diagram.download-icon {
            cursor: pointer;
            transform-origin: center;
        }
        .download-icon .arrow-part {
            transition: transform 0.35s cubic-bezier(0.35, 0.2, 0.14, 0.95);
             transform-origin: center;
        }
        button:has(.download-icon):hover .download-icon .arrow-part, button:has(.download-icon):focus-visible .download-icon .arrow-part {
          transform: translateY(-1.5px);
        }
        #mermaid-diagram-rp6v{font-family:var(--font-geist-sans);font-size:12px;fill:#000000;}#mermaid-diagram-rp6v .error-icon{fill:#552222;}#mermaid-diagram-rp6v .error-text{fill:#552222;stroke:#552222;}#mermaid-diagram-rp6v .edge-thickness-normal{stroke-width:1px;}#mermaid-diagram-rp6v .edge-thickness-thick{stroke-width:3.5px;}#mermaid-diagram-rp6v .edge-pattern-solid{stroke-dasharray:0;}#mermaid-diagram-rp6v .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-diagram-rp6v .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-diagram-rp6v .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-diagram-rp6v .marker{fill:#666;stroke:#666;}#mermaid-diagram-rp6v .marker.cross{stroke:#666;}#mermaid-diagram-rp6v svg{font-family:var(--font-geist-sans);font-size:12px;}#mermaid-diagram-rp6v p{margin:0;}#mermaid-diagram-rp6v .label{font-family:var(--font-geist-sans);color:#000000;}#mermaid-diagram-rp6v .cluster-label text{fill:#333;}#mermaid-diagram-rp6v .cluster-label span{color:#333;}#mermaid-diagram-rp6v .cluster-label span p{background-color:transparent;}#mermaid-diagram-rp6v .label text,#mermaid-diagram-rp6v span{fill:#000000;color:#000000;}#mermaid-diagram-rp6v .node rect,#mermaid-diagram-rp6v .node circle,#mermaid-diagram-rp6v .node ellipse,#mermaid-diagram-rp6v .node polygon,#mermaid-diagram-rp6v .node path{fill:#eee;stroke:#999;stroke-width:1px;}#mermaid-diagram-rp6v .rough-node .label text,#mermaid-diagram-rp6v .node .label text{text-anchor:middle;}#mermaid-diagram-rp6v .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-diagram-rp6v .node .label{text-align:center;}#mermaid-diagram-rp6v .node.clickable{cursor:pointer;}#mermaid-diagram-rp6v .arrowheadPath{fill:#333333;}#mermaid-diagram-rp6v .edgePath .path{stroke:#666;stroke-width:2.0px;}#mermaid-diagram-rp6v .flowchart-link{stroke:#666;fill:none;}#mermaid-diagram-rp6v .edgeLabel{background-color:white;text-align:center;}#mermaid-diagram-rp6v .edgeLabel p{background-color:white;}#mermaid-diagram-rp6v .edgeLabel rect{opacity:0.5;background-color:white;fill:white;}#mermaid-diagram-rp6v .labelBkg{background-color:rgba(255, 255, 255, 0.5);}#mermaid-diagram-rp6v .cluster rect{fill:hsl(0, 0%, 98.9215686275%);stroke:#707070;stroke-width:1px;}#mermaid-diagram-rp6v .cluster text{fill:#333;}#mermaid-diagram-rp6v .cluster span{color:#333;}#mermaid-diagram-rp6v div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:var(--font-geist-sans);font-size:12px;background:hsl(-160, 0%, 93.3333333333%);border:1px solid #707070;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-diagram-rp6v .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#000000;}#mermaid-diagram-rp6v .flowchart-link{stroke:hsl(var(--gray-400));stroke-width:1px;}#mermaid-diagram-rp6v .marker,#mermaid-diagram-rp6v marker,#mermaid-diagram-rp6v marker *{fill:hsl(var(--gray-400))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rp6v .label,#mermaid-diagram-rp6v text,#mermaid-diagram-rp6v text>tspan{fill:hsl(var(--black))!important;color:hsl(var(--black))!important;}#mermaid-diagram-rp6v .background,#mermaid-diagram-rp6v rect.relationshipLabelBox{fill:hsl(var(--white))!important;}#mermaid-diagram-rp6v .entityBox,#mermaid-diagram-rp6v .attributeBoxEven{fill:hsl(var(--gray-150))!important;}#mermaid-diagram-rp6v .attributeBoxOdd{fill:hsl(var(--white))!important;}#mermaid-diagram-rp6v .label-container,#mermaid-diagram-rp6v rect.actor{fill:hsl(var(--white))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rp6v line{stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rp6v :root{--mermaid-font-family:var(--font-geist-sans);}Shopify ClientProduct FunctionsCollection FunctionsCart FunctionsSearch FunctionsgetProductgetAllProductsgetProductRecommendationsgetCollectiongetCollectionscreateCartgetCartaddToCartupdateCartItemremoveCartItemapplyDiscountCodesearchProducts
```

## GraphQL Queries

### Product Query

```plaintext
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
```

### Cart Creation Mutation

```plaintext
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
```

## Data Transformation

The integration transforms Shopify's GraphQL responses into a more usable format for the application:

```typescript
// Transform product data
return {
  id: product.id,
  title: product.title,
  handle: product.handle,
  description: product.description,
  price: product.priceRange.minVariantPrice.amount,
  currencyCode: product.priceRange.minVariantPrice.currencyCode,
  images: product.images.edges.map(({ node }) => ({
    url: node.url,
    altText: node.altText,
    width: node.node}) => ({
    url: node.url,
    altText: node.altText,
    width: node.width,
    height: node.height,
  })),
  variants: product.variants.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    availableForSale: node.availableForSale,
    price: node.price.amount,
    currencyCode: node.price.currencyCode,
    selectedOptions: node.selectedOptions,
    quantityAvailable: node.quantityAvailable,
  })),
};
```

## Error Handling Strategy

The integration implements a multi-layered error handling approach:

1. **Prevention**: Input validation, proper headers, keepalive connections
2. **Detection**: Specific error types, detailed logging
3. **Recovery**: Retries with exponential backoff, fallback mechanisms
4. **Feedback**: User-friendly error messages, diagnostic tools


### Error Recovery Flow

```mermaid
Diagram.download-icon {
            cursor: pointer;
            transform-origin: center;
        }
        .download-icon .arrow-part {
            transition: transform 0.35s cubic-bezier(0.35, 0.2, 0.14, 0.95);
             transform-origin: center;
        }
        button:has(.download-icon):hover .download-icon .arrow-part, button:has(.download-icon):focus-visible .download-icon .arrow-part {
          transform: translateY(-1.5px);
        }
        #mermaid-diagram-rpne{font-family:var(--font-geist-sans);font-size:12px;fill:#000000;}#mermaid-diagram-rpne .error-icon{fill:#552222;}#mermaid-diagram-rpne .error-text{fill:#552222;stroke:#552222;}#mermaid-diagram-rpne .edge-thickness-normal{stroke-width:1px;}#mermaid-diagram-rpne .edge-thickness-thick{stroke-width:3.5px;}#mermaid-diagram-rpne .edge-pattern-solid{stroke-dasharray:0;}#mermaid-diagram-rpne .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-diagram-rpne .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-diagram-rpne .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-diagram-rpne .marker{fill:#666;stroke:#666;}#mermaid-diagram-rpne .marker.cross{stroke:#666;}#mermaid-diagram-rpne svg{font-family:var(--font-geist-sans);font-size:12px;}#mermaid-diagram-rpne p{margin:0;}#mermaid-diagram-rpne .label{font-family:var(--font-geist-sans);color:#000000;}#mermaid-diagram-rpne .cluster-label text{fill:#333;}#mermaid-diagram-rpne .cluster-label span{color:#333;}#mermaid-diagram-rpne .cluster-label span p{background-color:transparent;}#mermaid-diagram-rpne .label text,#mermaid-diagram-rpne span{fill:#000000;color:#000000;}#mermaid-diagram-rpne .node rect,#mermaid-diagram-rpne .node circle,#mermaid-diagram-rpne .node ellipse,#mermaid-diagram-rpne .node polygon,#mermaid-diagram-rpne .node path{fill:#eee;stroke:#999;stroke-width:1px;}#mermaid-diagram-rpne .rough-node .label text,#mermaid-diagram-rpne .node .label text{text-anchor:middle;}#mermaid-diagram-rpne .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-diagram-rpne .node .label{text-align:center;}#mermaid-diagram-rpne .node.clickable{cursor:pointer;}#mermaid-diagram-rpne .arrowheadPath{fill:#333333;}#mermaid-diagram-rpne .edgePath .path{stroke:#666;stroke-width:2.0px;}#mermaid-diagram-rpne .flowchart-link{stroke:#666;fill:none;}#mermaid-diagram-rpne .edgeLabel{background-color:white;text-align:center;}#mermaid-diagram-rpne .edgeLabel p{background-color:white;}#mermaid-diagram-rpne .edgeLabel rect{opacity:0.5;background-color:white;fill:white;}#mermaid-diagram-rpne .labelBkg{background-color:rgba(255, 255, 255, 0.5);}#mermaid-diagram-rpne .cluster rect{fill:hsl(0, 0%, 98.9215686275%);stroke:#707070;stroke-width:1px;}#mermaid-diagram-rpne .cluster text{fill:#333;}#mermaid-diagram-rpne .cluster span{color:#333;}#mermaid-diagram-rpne div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:var(--font-geist-sans);font-size:12px;background:hsl(-160, 0%, 93.3333333333%);border:1px solid #707070;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-diagram-rpne .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#000000;}#mermaid-diagram-rpne .flowchart-link{stroke:hsl(var(--gray-400));stroke-width:1px;}#mermaid-diagram-rpne .marker,#mermaid-diagram-rpne marker,#mermaid-diagram-rpne marker *{fill:hsl(var(--gray-400))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rpne .label,#mermaid-diagram-rpne text,#mermaid-diagram-rpne text>tspan{fill:hsl(var(--black))!important;color:hsl(var(--black))!important;}#mermaid-diagram-rpne .background,#mermaid-diagram-rpne rect.relationshipLabelBox{fill:hsl(var(--white))!important;}#mermaid-diagram-rpne .entityBox,#mermaid-diagram-rpne .attributeBoxEven{fill:hsl(var(--gray-150))!important;}#mermaid-diagram-rpne .attributeBoxOdd{fill:hsl(var(--white))!important;}#mermaid-diagram-rpne .label-container,#mermaid-diagram-rpne rect.actor{fill:hsl(var(--white))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rpne line{stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rpne :root{--mermaid-font-family:var(--font-geist-sans);}NoYesNetworkYesNoAPIAuthenticationYesNoAPI CallError?Return ResultError TypeRetry Count &lt; Max?Exponential BackoffUse FallbackLog Error DetailsShow User MessageLog Auth ErrorRefresh Token if PossibleRetry Possible?Show Auth ErrorEnd
```

## Testing Strategy

The integration includes a comprehensive testing strategy:

1. **Unit Tests**: Test individual API functions
2. **Integration Tests**: Test actual Shopify connectivity
3. **End-to-End Tests**: Test complete user flows
4. **Performance Tests**: Measure response times
5. **Error Handling Tests**: Verify graceful error handling


## Deployment Considerations

1. **Environment Variables**: Secure storage of API credentials
2. **CORS Configuration**: Allow frontend domain in Shopify settings
3. **API Version Management**: Update API version quarterly
4. **Rate Limiting**: Implement caching to reduce API calls
5. **Monitoring**: Track API errors and performance metrics


## testing-strategy.md

# Shopify Integration Testing Strategy

## Testing Levels

Our testing strategy covers multiple levels to ensure comprehensive validation of the Shopify integration:

```mermaid
Diagram.download-icon {
            cursor: pointer;
            transform-origin: center;
        }
        .download-icon .arrow-part {
            transition: transform 0.35s cubic-bezier(0.35, 0.2, 0.14, 0.95);
             transform-origin: center;
        }
        button:has(.download-icon):hover .download-icon .arrow-part, button:has(.download-icon):focus-visible .download-icon .arrow-part {
          transform: translateY(-1.5px);
        }
        #mermaid-diagram-rpq9{font-family:var(--font-geist-sans);font-size:12px;fill:#000000;}#mermaid-diagram-rpq9 .error-icon{fill:#552222;}#mermaid-diagram-rpq9 .error-text{fill:#552222;stroke:#552222;}#mermaid-diagram-rpq9 .edge-thickness-normal{stroke-width:1px;}#mermaid-diagram-rpq9 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-diagram-rpq9 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-diagram-rpq9 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-diagram-rpq9 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-diagram-rpq9 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-diagram-rpq9 .marker{fill:#666;stroke:#666;}#mermaid-diagram-rpq9 .marker.cross{stroke:#666;}#mermaid-diagram-rpq9 svg{font-family:var(--font-geist-sans);font-size:12px;}#mermaid-diagram-rpq9 p{margin:0;}#mermaid-diagram-rpq9 .label{font-family:var(--font-geist-sans);color:#000000;}#mermaid-diagram-rpq9 .cluster-label text{fill:#333;}#mermaid-diagram-rpq9 .cluster-label span{color:#333;}#mermaid-diagram-rpq9 .cluster-label span p{background-color:transparent;}#mermaid-diagram-rpq9 .label text,#mermaid-diagram-rpq9 span{fill:#000000;color:#000000;}#mermaid-diagram-rpq9 .node rect,#mermaid-diagram-rpq9 .node circle,#mermaid-diagram-rpq9 .node ellipse,#mermaid-diagram-rpq9 .node polygon,#mermaid-diagram-rpq9 .node path{fill:#eee;stroke:#999;stroke-width:1px;}#mermaid-diagram-rpq9 .rough-node .label text,#mermaid-diagram-rpq9 .node .label text{text-anchor:middle;}#mermaid-diagram-rpq9 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-diagram-rpq9 .node .label{text-align:center;}#mermaid-diagram-rpq9 .node.clickable{cursor:pointer;}#mermaid-diagram-rpq9 .arrowheadPath{fill:#333333;}#mermaid-diagram-rpq9 .edgePath .path{stroke:#666;stroke-width:2.0px;}#mermaid-diagram-rpq9 .flowchart-link{stroke:#666;fill:none;}#mermaid-diagram-rpq9 .edgeLabel{background-color:white;text-align:center;}#mermaid-diagram-rpq9 .edgeLabel p{background-color:white;}#mermaid-diagram-rpq9 .edgeLabel rect{opacity:0.5;background-color:white;fill:white;}#mermaid-diagram-rpq9 .labelBkg{background-color:rgba(255, 255, 255, 0.5);}#mermaid-diagram-rpq9 .cluster rect{fill:hsl(0, 0%, 98.9215686275%);stroke:#707070;stroke-width:1px;}#mermaid-diagram-rpq9 .cluster text{fill:#333;}#mermaid-diagram-rpq9 .cluster span{color:#333;}#mermaid-diagram-rpq9 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:var(--font-geist-sans);font-size:12px;background:hsl(-160, 0%, 93.3333333333%);border:1px solid #707070;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-diagram-rpq9 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#000000;}#mermaid-diagram-rpq9 .flowchart-link{stroke:hsl(var(--gray-400));stroke-width:1px;}#mermaid-diagram-rpq9 .marker,#mermaid-diagram-rpq9 marker,#mermaid-diagram-rpq9 marker *{fill:hsl(var(--gray-400))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rpq9 .label,#mermaid-diagram-rpq9 text,#mermaid-diagram-rpq9 text>tspan{fill:hsl(var(--black))!important;color:hsl(var(--black))!important;}#mermaid-diagram-rpq9 .background,#mermaid-diagram-rpq9 rect.relationshipLabelBox{fill:hsl(var(--white))!important;}#mermaid-diagram-rpq9 .entityBox,#mermaid-diagram-rpq9 .attributeBoxEven{fill:hsl(var(--gray-150))!important;}#mermaid-diagram-rpq9 .attributeBoxOdd{fill:hsl(var(--white))!important;}#mermaid-diagram-rpq9 .label-container,#mermaid-diagram-rpq9 rect.actor{fill:hsl(var(--white))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rpq9 line{stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rpq9 :root{--mermaid-font-family:var(--font-geist-sans);}Unit TestsIntegration TestsEnd-to-End TestsPerformance TestsError Handling Tests
```

## 1. Unit Tests

**Purpose**: Verify individual functions in isolation

**Coverage**:

- All Shopify API functions
- Data transformation logic
- Error handling utilities


**Tools**:

- Vitest
- Mock data
- Test utilities


**Example**:

```typescript
describe('Product Retrieval', () => {
  it('should retrieve a specific product by handle', async () => {
    // Setup mock response
    setupFetchMock({
      json: () => Promise.resolve({ data: { product: mockProducts[0] } }),
      ok: true,
    });

    const product = await getProduct('test-product-1');
    
    expect(product).not.toBeNull();
    expect(product).toHaveProperty('id', mockProducts[0].id);
    expect(product).toHaveProperty('title', mockProducts[0].title);
    validateProductStructure(product);
  });
});
```

## 2. Integration Tests

**Purpose**: Verify actual connectivity with Shopify

**Coverage**:

- API authentication
- Shop information retrieval
- Cart creation
- Basic product retrieval


**Tools**:

- Vitest
- Real API credentials
- Diagnostic utilities


**Example**:

```typescript
describe('Shopify Integration Tests', () => {
  it('should successfully connect to Shopify API', async () => {
    const result = await testShopifyConnection();
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.shop).toBeDefined();
    expect(result.data.shop.name).toBeTruthy();
  });
});
```

## 3. End-to-End Tests

**Purpose**: Simulate user journeys through the application

**Coverage**:

- Browsing products
- Product details
- Cart operations
- Checkout flow


**Tools**:

- Playwright
- Browser automation
- Test assertions


**Example**:

```typescript
test('should add product to cart', async ({ page }) => {
  // Navigate to a product page
  await page.goto('/products/test-product-1');
  
  // Wait for product details to load
  await page.waitForSelector('[data-testid="product-details"]');
  
  // Click add to cart button
  await page.click('[data-testid="add-to-cart-button"]');
  
  // Wait for cart notification
  await page.waitForSelector('[data-testid="cart-notification"]');
  
  // Open cart
  await page.click('[data-testid="cart-icon"]');
  
  // Check if product is in cart
  const cartItems = await page.$$('[data-testid="cart-item"]');
  expect(cartItems.length).toBeGreaterThan(0);
});
```

## 4. Performance Tests

**Purpose**: Ensure acceptable response times

**Coverage**:

- Page load times
- API response times
- Cart operations
- Checkout redirection


**Tools**:

- Playwright
- Timing measurements
- Performance assertions


**Example**:

```typescript
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

## 5. Error Handling Tests

**Purpose**: Verify graceful handling of failures

**Coverage**:

- Network errors
- API errors
- Offline scenarios
- Recovery mechanisms


**Tools**:

- Playwright
- Network condition simulation
- Error injection


**Example**:

```typescript
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

## Test Data Management

1. **Mock Data**: Predefined product and cart data for unit tests
2. **Test Environment**: Separate Shopify store for integration tests
3. **Test Products**: Specific products for E2E tests
4. **Test Accounts**: Dedicated accounts for checkout testing


## Test Execution

### Local Development

```shellscript
# Run all tests
npm run test:shopify

# Run specific test types
npm run test:shopify:unit
npm run test:shopify:integration
npm run test:shopify:e2e
npm run test:shopify:performance
npm run test:shopify:error-handling
```

### CI/CD Pipeline

Tests run automatically on:

- Pull requests
- Merges to main branch
- Daily scheduled runs


## Test Reporting

The testing framework generates comprehensive reports:

1. **JSON Report**: Machine-readable test results
2. **HTML Report**: Visual representation of test results
3. **Summary Report**: High-level overview of test status


## Test Maintenance

1. **Regular Updates**: Update tests when Shopify API changes
2. **Data Refresh**: Refresh test data periodically
3. **Performance Baselines**: Update performance expectations as needed
4. **Coverage Analysis**: Identify and fill testing gaps