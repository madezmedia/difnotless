// Script to query all Shopify products
// Run with: node scripts/query-products.js

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

// GraphQL query to get all products with detailed information
const productsQuery = `
  query {
    products(first: 50) {
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
              }
            }
          }
          vendor
          productType
          tags
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
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

// Function to make a GraphQL request
function makeGraphQLRequest(query) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SHOPIFY_DOMAIN,
      path: '/api/2023-07/graphql.json',
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
    console.log('Fetching all products from Shopify...');
    const productsResponse = await makeGraphQLRequest(productsQuery);
    
    console.log('\n=== PRODUCTS ===\n');
    if (productsResponse.data && productsResponse.data.products) {
      const products = productsResponse.data.products.edges;
      
      if (products.length === 0) {
        console.log('No products found');
      } else {
        console.log(`Found ${products.length} products:\n`);
        
        products.forEach(({ node }) => {
          console.log(`- ${node.title} (${node.handle})`);
          console.log(`  ID: ${node.id}`);
          
          const price = node.priceRange?.minVariantPrice;
          if (price) {
            console.log(`  Price: ${price.amount} ${price.currencyCode}`);
          }
          
          if (node.vendor) console.log(`  Vendor: ${node.vendor}`);
          if (node.productType) console.log(`  Type: ${node.productType}`);
          
          if (node.tags && node.tags.length) {
            console.log(`  Tags: ${node.tags.join(', ')}`);
          }
          
          console.log(`  Variants: ${node.variants.edges.length}`);
          
          // Show the first variant's details
          if (node.variants.edges.length > 0) {
            const firstVariant = node.variants.edges[0].node;
            console.log(`  First variant: ${firstVariant.title}`);
            
            if (firstVariant.selectedOptions && firstVariant.selectedOptions.length) {
              const options = firstVariant.selectedOptions.map(opt => `${opt.name}: ${opt.value}`).join(', ');
              console.log(`  Options: ${options}`);
            }
          }
          
          // Show image if available
          if (node.images && node.images.edges.length > 0) {
            console.log(`  Image: ${node.images.edges[0].node.url}`);
          }
          
          console.log();
        });
        
        // Check if there are more products
        const pageInfo = productsResponse.data.products.pageInfo;
        if (pageInfo.hasNextPage) {
          console.log(`Note: There are more products available. This query only retrieved the first ${products.length}.`);
        }
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