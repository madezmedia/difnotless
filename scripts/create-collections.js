// Script to create collections in Shopify via Admin API
// Run with: node scripts/create-collections.js

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
const SHOPIFY_ADMIN_TOKEN = envVars.SHOPIFY_ADMIN_ACCESS_TOKEN;

// Check if we have the required credentials
if (!SHOPIFY_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
  console.error('Error: Missing Shopify Admin credentials in .env.local file');
  console.error('Make sure SHOPIFY_ADMIN_ACCESS_TOKEN is set in .env.local');
  process.exit(1);
}

// Collection data to create
const collections = [
  {
    title: 'Sensory Tools',
    handle: 'sensory-tools',
    description: '<p>Tools and products designed to help with sensory processing needs, providing comfort and support for various sensory experiences.</p>'
  },
  {
    title: 'ADHD Support',
    handle: 'adhd-support',
    description: '<p>Products designed to assist with focus, organization, and daily functioning for individuals with ADHD.</p>'
  },
  {
    title: 'Autism Essentials',
    handle: 'autism-essentials',
    description: '<p>Essential products for autistic individuals focusing on communication, sensory needs, and daily living support.</p>'
  },
  {
    title: 'Anxiety Relief',
    handle: 'anxiety-relief',
    description: '<p>Products designed to help manage and reduce anxiety through various therapeutic approaches.</p>'
  }
];

// GraphQL mutation to create a collection
const createCollectionMutation = `
  mutation collectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
        title
        handle
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Function to make a GraphQL request
function makeGraphQLRequest(query, variables) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SHOPIFY_DOMAIN,
      path: '/admin/api/2023-07/graphql.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN
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
    
    req.write(JSON.stringify({ query, variables }));
    req.end();
  });
}

// Function to create a collection
async function createCollection(collection) {
  console.log(`Creating collection: ${collection.title}...`);
  
  const variables = {
    input: {
      title: collection.title,
      handle: collection.handle,
      descriptionHtml: collection.description,
      published: true
    }
  };
  
  try {
    const result = await makeGraphQLRequest(createCollectionMutation, variables);
    
    if (result.data && result.data.collectionCreate) {
      if (result.data.collectionCreate.userErrors.length > 0) {
        console.error(`  Error creating collection ${collection.title}:`, result.data.collectionCreate.userErrors);
        return null;
      } else {
        console.log(`  ✅ Created collection: ${result.data.collectionCreate.collection.title} (${result.data.collectionCreate.collection.id})`);
        return result.data.collectionCreate.collection;
      }
    } else if (result.errors) {
      console.error(`  GraphQL errors for ${collection.title}:`, result.errors);
      return null;
    } else {
      console.log(`  Unknown response format for ${collection.title}:`, result);
      return null;
    }
  } catch (error) {
    console.error(`  Error creating collection ${collection.title}:`, error.message);
    return null;
  }
}

// Main function
async function main() {
  console.log('Starting creation of Shopify collections...');
  
  const createdCollections = [];
  
  // Create all collections
  for (const collectionData of collections) {
    const collection = await createCollection(collectionData);
    if (collection) {
      createdCollections.push(collection);
    }
  }
  
  console.log('\nCollection creation complete.');
  console.log(`Created ${createdCollections.length} out of ${collections.length} collections.`);
  
  if (createdCollections.length > 0) {
    console.log('\nCreated collections:');
    createdCollections.forEach(collection => {
      console.log(`- ${collection.title} (${collection.id})`);
    });
  }
}

// Run the main function
main();