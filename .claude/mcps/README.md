# DifNotLess MCP Configurations

This directory contains Model Control Protocol (MCP) configurations for integrating Claude with external services used by DifNotLess.

## Available MCPs

### 1. Shopify Storefront API
- **Config file**: `shopify.mcp.yaml`
- **Purpose**: Access to product data, collections, and inventory information
- **Endpoints**:
  - `products`: Fetch multiple products
  - `product`: Fetch a specific product by handle
  - `collections`: Fetch collection data
  - `collection`: Fetch products in a specific collection by handle

### 2. Sanity CMS API
- **Config file**: `sanity.mcp.yaml`
- **Purpose**: Retrieve blog and educational content from Sanity CMS
- **Endpoints**:
  - `blog_posts`: Retrieve all blog posts
  - `blog_post`: Fetch a specific blog post by slug
  - `resources`: Fetch educational resources
  - `resource`: Fetch a specific educational resource by slug

## Environment Setup

Before using these MCPs, you need to set up the required environment variables:

### For Shopify:
```
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_access_token
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
```

### For Sanity:
```
SANITY_API_TOKEN=your_api_token
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

## Usage Examples

### Fetch products from Shopify:
```
claude mcp shopify products
```

### Fetch a specific product by handle:
```
claude mcp shopify product --handle=weighted-blanket-comfort
```

### Fetch blog posts from Sanity:
```
claude mcp sanity blog_posts
```

### Fetch a specific blog post by slug:
```
claude mcp sanity blog_post --slug=understanding-sensory-processing
```

## Troubleshooting

If you encounter authentication errors:
1. Verify your environment variables are correctly set
2. Check that your access tokens haven't expired
3. Ensure your Shopify store domain is correctly formatted

For Sanity API issues:
1. Verify your project ID and dataset name
2. Check that your API token has the correct permissions