// Script to analyze Shopify collections and suggest organization
// Run with: node scripts/organize-collections.js

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

// GraphQL query to get all collections
const collectionsQuery = `
  query {
    collections(first: 20) {
      edges {
        node {
          id
          title
          handle
          description
          products(first: 10) {
            edges {
              node {
                id
                title
                handle
              }
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

// Recommended collections for a neurodiversity e-commerce store
const recommendedCollections = [
  {
    title: 'Sensory Tools',
    description: 'Tools and products designed to help with sensory processing needs, providing comfort and support for various sensory experiences.',
    productExamples: [
      'Weighted Blankets',
      'Fidget Toys',
      'Noise-Cancelling Headphones',
      'Sensory-Friendly Clothing',
      'Chewable Jewelry'
    ]
  },
  {
    title: 'ADHD Support',
    description: 'Products designed to assist with focus, organization, and daily functioning for individuals with ADHD.',
    productExamples: [
      'Time Management Tools',
      'Organizational Systems',
      'Focus Aids',
      'Fidget Tools',
      'Productivity Planners'
    ]
  },
  {
    title: 'Autism Essentials',
    description: 'Essential products for autistic individuals focusing on communication, sensory needs, and daily living support.',
    productExamples: [
      'Visual Schedules',
      'Communication Tools',
      'Sensory Regulation Products',
      'Social Stories',
      'Transition Supports'
    ]
  },
  {
    title: 'Anxiety Relief',
    description: 'Products designed to help manage and reduce anxiety through various therapeutic approaches.',
    productExamples: [
      'Grounding Tools',
      'Aromatherapy Products',
      'Weighted Items',
      'Meditation Aids',
      'Deep Pressure Products'
    ]
  }
];

// Main function
async function main() {
  try {
    console.log('Analyzing Shopify collections...');
    const collectionsResponse = await makeGraphQLRequest(collectionsQuery);
    
    console.log('\n=== CURRENT COLLECTIONS ===\n');
    
    let existingCollections = [];
    
    if (collectionsResponse.data && collectionsResponse.data.collections) {
      existingCollections = collectionsResponse.data.collections.edges.map(edge => edge.node);
      
      if (existingCollections.length === 0) {
        console.log('No collections found in the Shopify store.\n');
      } else {
        console.log(`Found ${existingCollections.length} collections:\n`);
        
        existingCollections.forEach(collection => {
          console.log(`- ${collection.title} (${collection.handle})`);
          console.log(`  ID: ${collection.id}`);
          
          if (collection.description) {
            console.log(`  Description: ${collection.description}`);
          }
          
          const productCount = collection.products.edges.length;
          const hasMoreProducts = collection.products.pageInfo.hasNextPage;
          
          console.log(`  Products: ${productCount}${hasMoreProducts ? '+' : ''}`);
          
          if (productCount > 0) {
            console.log('  Product examples:');
            collection.products.edges.slice(0, 3).forEach(edge => {
              console.log(`    - ${edge.node.title} (${edge.node.handle})`);
            });
            
            if (hasMoreProducts || productCount > 3) {
              console.log(`    - ... and ${hasMoreProducts ? 'more' : (productCount - 3) + ' more'}`);
            }
          }
          
          console.log();
        });
      }
    } else if (collectionsResponse.errors) {
      console.error('Error fetching collections:', collectionsResponse.errors);
      return;
    }
    
    // Generate recommendations
    console.log('=== RECOMMENDATIONS ===\n');
    
    if (existingCollections.length === 0) {
      console.log('Since no collections exist, we recommend creating the following collections for your neurodiversity store:\n');
    } else {
      console.log('Based on your existing collections, we recommend the following organization:\n');
    }
    
    // Check which recommended collections don't exist yet
    const existingTitles = existingCollections.map(c => c.title.toLowerCase());
    
    recommendedCollections.forEach(recommendation => {
      const exists = existingTitles.some(title => 
        title === recommendation.title.toLowerCase() || 
        title.includes(recommendation.title.toLowerCase())
      );
      
      if (exists) {
        console.log(`✅ "${recommendation.title}" collection already exists`);
      } else {
        console.log(`➕ Create a "${recommendation.title}" collection`);
        console.log(`   Description: ${recommendation.description}`);
        console.log('   Suggested products:');
        recommendation.productExamples.forEach(product => {
          console.log(`   - ${product}`);
        });
      }
      console.log();
    });
    
    console.log('=== IMPLEMENTATION PLAN ===\n');
    console.log('To implement these recommendations, you would need to:');
    console.log('1. Create the missing collections using the Shopify Admin interface or API');
    console.log('2. Add existing products to appropriate collections');
    console.log('3. Consider creating new products for any gaps in your offerings\n');
    
    console.log('Note: Creating collections and managing products requires Shopify Admin API access.');
    console.log('To set up this access, add SHOPIFY_ADMIN_ACCESS_TOKEN to your .env.local file.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the main function
main();