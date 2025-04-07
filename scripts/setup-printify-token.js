// Script to add Printify API token to .env.local
// Run with: node scripts/setup-printify-token.js YOUR_PRINTIFY_API_TOKEN

const fs = require('fs');

// Get token from command line argument
const printifyToken = process.argv[2];

if (!printifyToken) {
  console.error('Error: Printify API token not provided');
  console.error('Usage: node scripts/setup-printify-token.js YOUR_PRINTIFY_API_TOKEN');
  process.exit(1);
}

// Read current .env.local file
console.log('Reading .env.local file...');
let envContent;
try {
  envContent = fs.readFileSync('.env.local', 'utf8');
} catch (error) {
  console.error('Error reading .env.local file:', error.message);
  process.exit(1);
}

// Check if PRINTIFY_API_TOKEN already exists
if (envContent.includes('PRINTIFY_API_TOKEN=')) {
  console.log('Updating existing PRINTIFY_API_TOKEN...');
  // Replace existing token
  envContent = envContent.replace(/PRINTIFY_API_TOKEN=.*/g, `PRINTIFY_API_TOKEN=${printifyToken}`);
} else {
  console.log('Adding new PRINTIFY_API_TOKEN...');
  // Add token to the end of the file, with a category header if it doesn't exist
  if (!envContent.includes('# Printify')) {
    envContent += '\n# Printify\n';
  }
  envContent += `PRINTIFY_API_TOKEN=${printifyToken}\n`;
}

// Write updated content back to .env.local
console.log('Writing updated .env.local file...');
try {
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Successfully added Printify API token to .env.local');
} catch (error) {
  console.error('Error writing to .env.local file:', error.message);
  process.exit(1);
}