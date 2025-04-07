// Comprehensive script to set up a Shopify store for DifNotLess
// Run with: node scripts/setup-shopify-store.js

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
    description: '<p>Tools and products designed to help with sensory processing needs, providing comfort and support for various sensory experiences.</p>',
    productType: 'SENSORY'
  },
  {
    title: 'ADHD Support',
    handle: 'adhd-support',
    description: '<p>Products designed to assist with focus, organization, and daily functioning for individuals with ADHD.</p>',
    productType: 'ADHD'
  },
  {
    title: 'Autism Essentials',
    handle: 'autism-essentials',
    description: '<p>Essential products for autistic individuals focusing on communication, sensory needs, and daily living support.</p>',
    productType: 'AUTISM'
  },
  {
    title: 'Anxiety Relief',
    handle: 'anxiety-relief',
    description: '<p>Products designed to help manage and reduce anxiety through various therapeutic approaches.</p>',
    productType: 'ANXIETY'
  }
];

// Sample products to create
const sampleProducts = [
  // Sensory Tools
  {
    title: 'Weighted Blanket - Comfort Series',
    handle: 'weighted-blanket-comfort-series',
    description: '<p>A premium weighted blanket designed to provide deep pressure stimulation for better sleep and anxiety reduction. Features a breathable cotton cover and glass bead filling for even weight distribution.</p><ul><li>Available in 10lb, 15lb, and 20lb options</li><li>Breathable cotton cover</li><li>Even weight distribution</li><li>Removable, machine-washable cover</li></ul>',
    productType: 'SENSORY',
    tags: ['sensory', 'sleep', 'anxiety relief', 'weighted'],
    vendor: 'SensoryCalm',
    price: '129.99',
    compareAtPrice: '149.99',
    options: [
      {
        name: 'Weight',
        values: ['10lb', '15lb', '20lb']
      },
      {
        name: 'Color',
        values: ['Navy Blue', 'Light Gray', 'Sage Green']
      }
    ],
    primaryCollectionTitle: 'Sensory Tools',
    additionalCollections: ['Anxiety Relief']
  },
  {
    title: 'Sensory Fidget Cube Pro',
    handle: 'sensory-fidget-cube-pro',
    description: '<p>The ultimate fidget cube designed specifically for neurodivergent individuals. Features six different tactile activities to help with focus, attention, and anxiety reduction.</p><ul><li>Six different fidget activities</li><li>Silent operation for classroom/office use</li><li>Durable construction</li><li>Compact size fits in pocket</li></ul>',
    productType: 'SENSORY',
    tags: ['sensory', 'fidget', 'focus', 'desk', 'classroom', 'office'],
    vendor: 'FidgetFocus',
    price: '24.99',
    compareAtPrice: '29.99',
    options: [
      {
        name: 'Color',
        values: ['Black', 'Blue', 'Red', 'Green', 'Purple']
      }
    ],
    primaryCollectionTitle: 'Sensory Tools',
    additionalCollections: ['ADHD Support']
  },
  // ADHD Support
  {
    title: 'Time Timer Plus',
    handle: 'time-timer-plus',
    description: '<p>Visual timer designed to help with time management and transitions. The disappearing red disk makes time visible, helping individuals with ADHD understand and manage time more effectively.</p><ul><li>Visual time representation</li><li>Silent operation (optional ticking)</li><li>Portable design</li><li>60-minute timer</li><li>Optional audible alert</li></ul>',
    productType: 'ADHD',
    tags: ['ADHD', 'time management', 'executive function', 'classroom', 'office'],
    vendor: 'TimeWise',
    price: '39.99',
    compareAtPrice: '45.99',
    options: [
      {
        name: 'Size',
        values: ['5-inch', '7-inch', '12-inch']
      }
    ],
    primaryCollectionTitle: 'ADHD Support',
    additionalCollections: []
  },
  // Autism Essentials
  {
    title: 'Visual Schedule System',
    handle: 'visual-schedule-system',
    description: '<p>Comprehensive visual schedule system with magnetic board and 50+ activity cards. Helps create predictable routines and smooth transitions for autistic individuals.</p><ul><li>Magnetic board with stand</li><li>50+ illustrated activity cards</li><li>Customizable routines</li><li>Morning, afternoon, and evening sections</li><li>Includes blank cards for custom activities</li></ul>',
    productType: 'AUTISM',
    tags: ['autism', 'visual supports', 'routine', 'transitions', 'communication'],
    vendor: 'VisualSupports',
    price: '49.99',
    compareAtPrice: '59.99',
    options: [
      {
        name: 'Size',
        values: ['Standard', 'Deluxe (extra cards)']
      }
    ],
    primaryCollectionTitle: 'Autism Essentials',
    additionalCollections: []
  },
  // Anxiety Relief
  {
    title: 'Calming Aromatherapy Diffuser - Serenity',
    handle: 'calming-aromatherapy-diffuser-serenity',
    description: '<p>Ultrasonic aromatherapy diffuser with soft, color-changing lights designed to create a calming sensory environment. Includes three essential oil blends formulated for anxiety relief.</p><ul><li>Ultrasonic diffuser with 300ml capacity</li><li>Gentle, color-changing LED lights</li><li>Auto-shutoff safety feature</li><li>3 essential oil blends (Calm, Focus, Sleep)</li><li>Timer settings for 1, 3, or 6 hours</li></ul>',
    productType: 'ANXIETY',
    tags: ['anxiety', 'aromatherapy', 'sensory', 'sleep', 'relaxation'],
    vendor: 'SensoryCalm',
    price: '69.99',
    compareAtPrice: '79.99',
    options: [
      {
        name: 'Color',
        values: ['White', 'Natural Wood']
      }
    ],
    primaryCollectionTitle: 'Anxiety Relief',
    additionalCollections: ['Sensory Tools']
  }
];

// GraphQL mutations
const CREATE_COLLECTION_MUTATION = `
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

const CREATE_PRODUCT_MUTATION = `
  mutation productCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
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

const ADD_PRODUCT_TO_COLLECTION = `
  mutation collectionAddProducts($id: ID!, $productIds: [ID!]!) {
    collectionAddProducts(id: $id, productIds: $productIds) {
      collection {
        id
        title
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
    const result = await makeGraphQLRequest(CREATE_COLLECTION_MUTATION, variables);
    
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

// Function to create a product
async function createProduct(product) {
  console.log(`Creating product: ${product.title}...`);
  
  try {
    // Build variant input
    const variants = [];
    
    if (product.options.length === 1) {
      // Handle single option products
      for (const value of product.options[0].values) {
        variants.push({
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          options: [value],
          inventoryQuantities: {
            availableQuantity: 25,
            locationId: "gid://shopify/Location/1"
          }
        });
      }
    } else if (product.options.length === 2) {
      // Handle products with two options
      for (const value1 of product.options[0].values) {
        for (const value2 of product.options[1].values) {
          variants.push({
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            options: [value1, value2],
            inventoryQuantities: {
              availableQuantity: 25,
              locationId: "gid://shopify/Location/1"
            }
          });
        }
      }
    }

    const variables = {
      input: {
        title: product.title,
        handle: product.handle,
        descriptionHtml: product.description,
        productType: product.productType,
        vendor: product.vendor,
        tags: product.tags,
        published: true,
        options: product.options.map(option => option.name),
        variants
      }
    };

    const result = await makeGraphQLRequest(CREATE_PRODUCT_MUTATION, variables);
    
    if (result.data && result.data.productCreate) {
      if (result.data.productCreate.userErrors.length > 0) {
        console.error(`  Error creating product ${product.title}:`, result.data.productCreate.userErrors);
        return null;
      } else {
        console.log(`  ✅ Created product: ${result.data.productCreate.product.title} (${result.data.productCreate.product.id})`);
        return result.data.productCreate.product;
      }
    } else if (result.errors) {
      console.error(`  GraphQL errors for ${product.title}:`, result.errors);
      return null;
    } else {
      console.log(`  Unknown response format for ${product.title}:`, result);
      return null;
    }
  } catch (error) {
    console.error(`  Error creating product ${product.title}:`, error.message);
    return null;
  }
}

// Function to add a product to a collection
async function addProductToCollection(collectionId, productId, collectionTitle, productTitle) {
  console.log(`Adding product "${productTitle}" to collection "${collectionTitle}"...`);
  
  try {
    const variables = {
      id: collectionId,
      productIds: [productId]
    };

    const result = await makeGraphQLRequest(ADD_PRODUCT_TO_COLLECTION, variables);
    
    if (result.data && result.data.collectionAddProducts) {
      if (result.data.collectionAddProducts.userErrors.length > 0) {
        console.error(`  Error adding product to collection:`, result.data.collectionAddProducts.userErrors);
        return false;
      } else {
        console.log(`  ✅ Added product to collection: ${result.data.collectionAddProducts.collection.title}`);
        return true;
      }
    } else if (result.errors) {
      console.error(`  GraphQL errors:`, result.errors);
      return false;
    } else {
      console.log(`  Unknown response format:`, result);
      return false;
    }
  } catch (error) {
    console.error(`  Error adding product to collection:`, error.message);
    return false;
  }
}

// Main function to create all collections and products
async function main() {
  console.log('Starting setup of Shopify store...');
  
  // Create all collections first
  const collectionMap = {};
  for (const categoryData of collections) {
    const collection = await createCollection(categoryData);
    if (collection) {
      collectionMap[categoryData.title] = collection.id;
    }
  }
  
  console.log('\nCollection creation complete. Collection IDs:');
  console.log(collectionMap);
  
  // Create all products
  console.log('\nCreating products...');
  for (const productData of sampleProducts) {
    const product = await createProduct(productData);
    
    if (product && productData.primaryCollectionTitle in collectionMap) {
      // Add to primary collection
      await addProductToCollection(
        collectionMap[productData.primaryCollectionTitle], 
        product.id,
        productData.primaryCollectionTitle,
        product.title
      );
      
      // Add to additional collections if specified
      for (const additionalCollection of productData.additionalCollections || []) {
        if (additionalCollection in collectionMap) {
          await addProductToCollection(
            collectionMap[additionalCollection], 
            product.id,
            additionalCollection,
            product.title
          );
        }
      }
    }
  }
  
  console.log('\n✅ Shopify store setup complete!');
}

// Run the main function
main().catch(error => {
  console.error('An error occurred during store setup:', error);
  process.exit(1);
});