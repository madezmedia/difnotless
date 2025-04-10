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

### 4. Airtable API
- **Config file**: `airtable.mcp.yaml`
- **Purpose**: Manage product data and inventory in Airtable
- **Endpoints**:
  - `list_bases`: Get a list of all accessible Airtable bases
  - `get_base_tables`: Get tables in a specific base
  - `list_products`: List products from the T-Shirt Designs table
  - `get_product`: Get details for a specific product by ID
  - `create_product`: Create a new product in the T-Shirt Designs table
  - `update_product`: Update an existing product
  - `delete_product`: Delete a product from the T-Shirt Designs table

### 5. Printify API
- **Config file**: `printify.mcp.yaml`
- **Purpose**: Manage print-on-demand products via Printify
- **Endpoints**:
  - `list_shops`: List all shops connected to your Printify account
  - `get_shop`: Get details for a specific shop
  - `list_products`: List all products in a shop
  - `get_product`: Get details for a specific product
  - `create_product`: Create a new product
  - `update_product`: Update an existing product
  - `publish_product`: Publish a product to a sales channel
  - `unpublish_product`: Unpublish a product from a sales channel
  - `delete_product`: Delete a product
  - `list_blueprints`: List all available product blueprints
  - `get_blueprint`: Get details for a specific product blueprint
  - `list_print_providers`: List print providers for a blueprint
  - `get_print_provider`: Get details for a specific print provider

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

### For Airtable:
```
AIRTABLE_API_KEY=your_airtable_api_key
```

### For Printify:
```
PRINTIFY_API_TOKEN=your_printify_api_token
```

## Usage Examples

### Shopify Storefront API (Read-only):
```
# Fetch products
claude mcp shopify products

# Fetch a specific product
claude mcp shopify product --handle=weighted-blanket-comfort
```

### Shopify Admin API (Read-write):
```
# Create a new collection
claude mcp shopify-admin create_collection --title="ADHD Gadgets" --description="<p>Tools to help with focus and attention</p>" --product_type="ADHD"

# Add products to a collection
claude mcp shopify-admin add_products_to_collection --collection_id="gid://shopify/Collection/12345" --product_ids=["gid://shopify/Product/12345", "gid://shopify/Product/67890"]
```

### Sanity CMS:
```
# Fetch blog posts
claude mcp sanity blog_posts

# Fetch a specific blog post
claude mcp sanity blog_post --slug=understanding-sensory-processing
```

### Airtable:
```
# List available bases
claude mcp airtable list_bases

# List products from T-Shirt Designs table
claude mcp airtable list_products --max_records=10 --view=Grid%20view

# Get a specific product
claude mcp airtable get_product --record_id=rec3U0bm77xRn01ta
```

### Printify:
```
# List all shops
claude mcp printify list_shops

# List products in a shop
claude mcp printify list_products --shop_id=12345 --page=1 --limit=20

# Get a specific product
claude mcp printify get_product --shop_id=12345 --product_id=67890
```

## Troubleshooting

If you encounter authentication errors:
1. Verify your environment variables are correctly set
2. Check that your access tokens haven't expired
3. Ensure your API keys have the necessary permissions

For Shopify Admin API access:
1. Make sure your Admin API token has the necessary scopes (write_products, write_publications)
2. Verify the collection ID format is correct (should start with "gid://shopify/Collection/")

For Airtable API issues:
1. Verify your API key has the necessary permissions
2. Check the base and table IDs in your requests

For Printify API issues:
1. Ensure your API token is valid and has the necessary permissions
2. Verify shop IDs and product IDs in your requests