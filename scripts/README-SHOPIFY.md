# Shopify Integration Scripts

This directory contains scripts for interacting with the Shopify store for DifNotLess.

## Available Scripts

### Query Scripts (Read-only)

These scripts only require the Storefront API token and can be run without admin access:

#### 1. `query-shopify.js`
- Lists all collections and basic product information
- Run with: `node scripts/query-shopify.js`
- Required env: `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

#### 2. `query-products.js`
- Provides detailed information about all products in the store
- Run with: `node scripts/query-products.js`
- Required env: `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

#### 3. `organize-collections.js`
- Analyzes existing collections and provides recommendations for organizing products
- Suggests collection structure for a neurodiversity-focused store
- Run with: `node scripts/organize-collections.js`
- Required env: `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

### Admin Scripts (Read-write)

These scripts require the Admin API token and can create/modify store content:

#### 4. `create-collections.js`
- Creates recommended collections for a neurodiversity store
- Run with: `node scripts/create-collections.js`
- Required env: `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_ACCESS_TOKEN`

#### 5. `setup-shopify-store.js`
- Comprehensive script that:
  - Creates collections for different product categories
  - Creates sample products relevant to neurodiversity
  - Adds products to appropriate collections
- Run with: `node scripts/setup-shopify-store.js`
- Required env: `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_ACCESS_TOKEN`

## Environment Setup

These scripts require environment variables to be set in `.env.local`:

```
# Shopify API
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-token  # For admin scripts only
```

## Using these Scripts

1. First run the query scripts to understand your current store setup
2. If needed, run the admin scripts to set up collections and products
3. For a complete store setup from scratch, use `setup-shopify-store.js`

## Recommended Store Structure

For a neurodiversity-focused store like DifNotLess, we recommend these collections:

1. **Sensory Tools**
   - Weighted Blankets
   - Fidget Toys
   - Noise-Cancelling Headphones
   - Sensory-Friendly Clothing

2. **ADHD Support**
   - Time Management Tools
   - Organizational Systems
   - Focus Aids
   - Productivity Planners

3. **Autism Essentials**
   - Visual Schedules
   - Communication Tools
   - Sensory Regulation Products
   - Social Stories

4. **Anxiety Relief**
   - Grounding Tools
   - Aromatherapy Products
   - Weighted Items
   - Deep Pressure Products

This structure aligns with the DifNotLess mission to provide specialized products for different neurodivergent needs.