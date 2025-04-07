// Script to explore Airtable data structure
// Run with: node scripts/airtable-explorer.js

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

// Get Airtable credentials
const AIRTABLE_API_KEY = envVars.AIRTABLE_API_KEY;

// Check if we have the required credentials
if (!AIRTABLE_API_KEY) {
  console.error('Error: Missing Airtable API key in .env.local file');
  process.exit(1);
}

console.log(`Using Airtable API Key: ${AIRTABLE_API_KEY.slice(0, 4)}...${AIRTABLE_API_KEY.slice(-4)}`);

// Function to make a request to Airtable API
function makeAirtableRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.airtable.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    console.log(`Sending request to: https://api.airtable.com${path}`);

    const req = https.request(options, (res) => {
      let data = '';
      
      console.log(`Response status: ${res.statusCode}`);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (e) {
          console.log('Raw response:', data);
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`Request error: ${error}`);
      reject(error);
    });
    
    req.end();
  });
}

// Main function
async function exploreAirtable() {
  try {
    console.log('Exploring Airtable bases...');
    
    // First, get a list of bases
    const bases = await makeAirtableRequest('/v0/meta/bases');
    
    console.log('\n=== AIRTABLE BASES ===\n');
    
    if (bases.bases && bases.bases.length) {
      console.log(`Found ${bases.bases.length} bases:\n`);
      
      for (const base of bases.bases) {
        console.log(`- ${base.name}`);
        console.log(`  ID: ${base.id}`);
        console.log(`  Permission level: ${base.permissionLevel}`);
        
        // Get tables (tables) for this base
        console.log(`  Fetching tables for base ${base.id}...`);
        const tables = await makeAirtableRequest(`/v0/meta/bases/${base.id}/tables`);
        
        if (tables.tables && tables.tables.length) {
          console.log(`  Found ${tables.tables.length} tables:`);
          
          for (const table of tables.tables) {
            console.log(`    - ${table.name}`);
            console.log(`      ID: ${table.id}`);
            
            // Log field information
            console.log(`      Fields:`);
            for (const field of table.fields) {
              console.log(`        - ${field.name} (${field.type})`);
            }
            
            // Get sample records from this table
            console.log(`      Fetching sample records for table ${table.name}...`);
            const records = await makeAirtableRequest(`/v0/${base.id}/${encodeURIComponent(table.name)}?maxRecords=3`);
            
            if (records.records && records.records.length) {
              console.log(`      Sample records (${records.records.length}):`);
              for (const record of records.records) {
                console.log(`        - Record ID: ${record.id}`);
                console.log(`          Fields: ${JSON.stringify(record.fields, null, 2).substring(0, 100)}...`);
              }
            } else {
              console.log(`      No records found or error: ${JSON.stringify(records)}`);
            }
            
            console.log('');
          }
        } else {
          console.log(`  No tables found or error: ${JSON.stringify(tables)}`);
        }
        
        console.log('');
      }
    } else {
      console.log('No bases found or error:', bases);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the function
exploreAirtable();