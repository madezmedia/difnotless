# Printify Integration for DifNotLess

This document outlines how to set up and use the Printify integration for DifNotLess.

## Overview

DifNotLess uses Printify as a print-on-demand service for creating and fulfilling custom neurodiversity-focused apparel and products. The integration allows you to:

1. Create and manage product designs
2. Sync products with Shopify
3. Handle inventory and fulfillment
4. Track orders and shipping

## Setup Instructions

### 1. Get Printify API Token

1. Log in to your [Printify account](https://printify.com/app/login)
2. Go to Settings → API
3. Generate a new API key with appropriate permissions
4. Run the setup script to add the token to your environment:

```bash
node scripts/setup-printify-token.js YOUR_PRINTIFY_API_TOKEN
```

### 2. Use Claude MCP for Printify

The Printify MCP configuration is already set up in `.claude/mcps/printify.mcp.yaml`. You can interact with the Printify API using Claude:

```bash
# List all shops
claude mcp printify list_shops

# List products in a shop
claude mcp printify list_products --shop_id=YOUR_SHOP_ID --page=1 --limit=20

# Get product details
claude mcp printify get_product --shop_id=YOUR_SHOP_ID --product_id=PRODUCT_ID
```

## Common Operations

### Working with Printify Products

**Creating a new product:**
```bash
claude mcp printify create_product --shop_id=YOUR_SHOP_ID --title="Neurodiversity Acceptance T-Shirt" --description="Comfortable cotton t-shirt celebrating neurodiversity" --blueprint_id=BLUEPRINT_ID --print_provider_id=PROVIDER_ID --variants='[...]' --print_areas='[...]'
```

**Publishing a product to Shopify:**
```bash
claude mcp printify publish_product --shop_id=YOUR_SHOP_ID --product_id=PRODUCT_ID --external_id=SHOPIFY_ID --handle=product-handle
```

### Working with Printify Blueprints

To find available product types (blueprints):
```bash
claude mcp printify list_blueprints --page=1 --limit=50
```

To see print providers for a specific blueprint:
```bash
claude mcp printify list_print_providers --blueprint_id=BLUEPRINT_ID
```

## Printify-Shopify Synchronization

Printify automatically syncs with Shopify when products are published. The synchronization includes:

1. Product details and images
2. Variants and pricing
3. Inventory levels
4. Order information

## Troubleshooting

If you encounter issues with the Printify integration:

1. Verify your API token is valid and has the necessary permissions
2. Check that the shop ID and product IDs are correct
3. Ensure you have the right blueprint ID and print provider ID for new products
4. Verify your Shopify store is properly connected to Printify

## Resources

- [Printify API Documentation](https://developers.printify.com/#overview)
- [Printify Help Center](https://help.printify.com/hc/en-us)
- [Shopify-Printify Integration Guide](https://help.printify.com/hc/en-us/articles/360014136680-Shopify-Integration-Guide)