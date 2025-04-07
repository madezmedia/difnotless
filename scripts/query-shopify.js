// Simple script to query Shopify products
// Run with: node scripts/query-shopify.js

const fs = require('fs');
const https = require('https');

// Read environment variables from .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};

envFile.split('\n').forEach(line => {
  // Skip comments and empty lines
  if (line.trim().startsWith('#') || !line.trim()) return;
  
  // Extract key and value
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

// Get Shopify credentials
const SHOPIFY_DOMAIN = envVars.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = envVars.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Check if we have the required credentials
if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
  console.error('Error: Missing Shopify credentials in .env.local file');
  process.exit(1);
}

// GraphQL query to get collections
const collectionsQuery = `
  query {
    collections(first: 10) {
      edges {
        node {
          id
          title
          handle
          description
          products(first: 1) {
            edges {
              cursor
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      }
    }
  }
`;

// GraphQL query to get products
const productsQuery = `
  query {
    products(first: 10) {
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
          vendor
          productType
          tags
          variants(first: 5) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

// Function to make a GraphQL request
function makeGraphQLRequest(query) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SHOPIFY_DOMAIN,
      path: '/api/2023-07/graphql.json', // Try an older API version
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(JSON.stringify({ query }));
    req.end();
  });
}

// Main function
async function main() {
  try {
    console.log('Fetching collections from Shopify...');
    const collectionsResponse = await makeGraphQLRequest(collectionsQuery);
    
    console.log('\n=== COLLECTIONS ===\n');
    if (collectionsResponse.data && collectionsResponse.data.collections) {
      const collections = collectionsResponse.data.collections.edges;
      
      if (collections.length === 0) {
        console.log('No collections found');
      } else {
        collections.forEach(({ node }) => {
          console.log(`- ${node.title} (${node.handle})`);
          console.log(`  ID: ${node.id}`);
          console.log(`  Has products: ${node.products.edges.length > 0 || node.products.pageInfo.hasNextPage}`);
          if (node.description) console.log(`  Description: ${node.description}`);
          console.log();
        });
      }
    } else if (collectionsResponse.errors) {
      console.error('Error fetching collections:', collectionsResponse.errors);
    }
    
    console.log('\nFetching products from Shopify...');
    const productsResponse = await makeGraphQLRequest(productsQuery);
    
    console.log('\n=== PRODUCTS ===\n');
    if (productsResponse.data && productsResponse.data.products) {
      const products = productsResponse.data.products.edges;
      
      if (products.length === 0) {
        console.log('No products found');
      } else {
        products.forEach(({ node }) => {
          console.log(`- ${node.title} (${node.handle})`);
          console.log(`  ID: ${node.id}`);
          console.log(`  Price: ${node.priceRange.minVariantPrice.amount} ${node.priceRange.minVariantPrice.currencyCode}`);
          console.log(`  Vendor: ${node.vendor || 'N/A'}`);
          console.log(`  Type: ${node.productType || 'N/A'}`);
          console.log(`  Tags: ${node.tags && node.tags.length ? node.tags.join(', ') : 'None'}`);
          console.log(`  Variants: ${node.variants.edges.length}`);
          console.log();
        });
      }
    } else if (productsResponse.errors) {
      console.error('Error fetching products:', productsResponse.errors);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the main function
main();