# DifNotLess Scripts

This directory contains utility scripts for the DifNotLess project.

## Seed Sanity Data

The `seed-sanity-data.js` script populates your Sanity CMS with sample content, including:
- Blog posts
- Authors
- Categories

### Requirements

Before running the script, ensure you have the following:

1. A Sanity project set up
2. The appropriate environment variables in your `.env.local` file:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your-sanity-api-token
   ```

3. Install required dependencies if not already installed:
   ```bash
   npm install dotenv @sanity/client
   ```

### Running the Script

Run the script using npm:

```bash
npm run seed-sanity
```

Or directly with Node:

```bash
node --experimental-json-modules scripts/seed-sanity-data.js
```

### What Gets Created

The script creates:
- 3 author profiles
- 4 blog categories
- 5 blog posts with content
- Proper references between posts, authors, and categories

### Customizing the Data

You can modify the seed data by editing the arrays in `seed-sanity-data.js`:
- `categories` - Edit or add new categories
- `authors` - Modify author profiles or add new ones
- `blogPosts` - Change content or add more blog posts

## Shopify Test Runner

The `run-shopify-tests.ts` script handles running tests against the Shopify integration.

To run:

```bash
ts-node scripts/run-shopify-tests.ts
```

## Product Sync

The `sync-products.ts` script synchronizes product data from Shopify to your application.

To run:

```bash
ts-node scripts/sync-products.ts
```