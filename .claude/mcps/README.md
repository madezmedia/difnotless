# DifNotLess MCP Configurations

This directory contains Model Control Protocol (MCP) configurations for integrating Claude with external services used by DifNotLess.

## Available MCPs

### 1. Shopify Storefront API
- **Config file**: `shopify.mcp.yaml`
- **Purpose**: Access to product data, collections, and inventory information (READ-ONLY)
- **Endpoints**:
  - `products`: Fetch multiple products
  - `product`: Fetch a specific product by handle
  - `collections`: Fetch collection data
  - `collection`: Fetch products in a specific collection by handle

### 2. Shopify Admin API
- **Config file**: `shopify-admin.mcp.yaml`
- **Purpose**: Manage Shopify store content including creating and managing collections (READ-WRITE)
- **Endpoints**:
  - `create_collection`: Create a new collection
  - `update_collection`: Update an existing collection
  - `delete_collection`: Delete a collection
  - `add_products_to_collection`: Add products to a collection
  - `remove_products_from_collection`: Remove products from a collection
  - `list_collections`: List all collections in the store
  - `get_collection`: Get detailed information about a specific collection

### 3. Sanity CMS API
- **Config file**: `sanity.mcp.yaml`
- **Purpose**: Retrieve blog and educational content from Sanity CMS
- **Endpoints**:
  - `blog_posts`: Retrieve all blog posts
  - `blog_post`: Fetch a specific blog post by slug
  - `resources`: Fetch educational resources
  - `resource`: Fetch a specific educational resource by slug

## Environment Setup

Before using these MCPs, you need to set up the required environment variables:

### For Shopify Storefront API:
```
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_access_token
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
```

### For Shopify Admin API:
```
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_access_token
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
```

### For Sanity:
```
SANITY_API_TOKEN=your_api_token
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

## Usage Examples

### Storefront API (Read-only):
```
# Fetch products
claude mcp shopify products

# Fetch a specific product by handle
claude mcp shopify product --handle=weighted-blanket-comfort

# Fetch collections
claude mcp shopify collections

# Fetch products in a collection
claude mcp shopify collection --handle=sensory-tools
```

### Admin API (Read-write):
```
# Create a new collection
claude mcp shopify-admin create_collection --title="ADHD Gadgets" --description="<p>Tools to help with focus and attention</p>" --product_type="ADHD"

# Add products to a collection
claude mcp shopify-admin add_products_to_collection --collection_id="gid://shopify/Collection/12345" --product_ids=["gid://shopify/Product/12345", "gid://shopify/Product/67890"]

# Update a collection
claude mcp shopify-admin update_collection --collection_id="gid://shopify/Collection/12345" --title="Updated Title" --description="<p>Updated description</p>"

# List all collections
claude mcp shopify-admin list_collections
```

### Sanity CMS:
```
# Fetch blog posts
claude mcp sanity blog_posts

# Fetch a specific blog post
claude mcp sanity blog_post --slug=understanding-sensory-processing
```

## Troubleshooting

If you encounter authentication errors:
1. Verify your environment variables are correctly set
2. Check that your access tokens haven't expired
3. Ensure your Shopify store domain is correctly formatted

For Shopify Admin API access:
1. Make sure your Admin API token has the necessary scopes (write_products, write_publications)
2. Verify the collection ID format is correct (should start with "gid://shopify/Collection/")

For Sanity API issues:
1. Verify your project ID and dataset name
2. Check that your API token has the correct permissions