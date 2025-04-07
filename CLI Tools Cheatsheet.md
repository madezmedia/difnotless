I'll help you develop a comprehensive CLI workflow document in Markdown format. The attachment you provided is already a well-structured CLI reference guide, but I'll create a more comprehensive version that includes additional tools and more detailed workflows.

```markdown file="cli-workflow-guide.md"
...
```

2. **WSL (Windows Subsystem for Linux)**

```shellscript
# Enable WSL
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Enable Virtual Machine feature
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Install Ubuntu
wsl --install -d Ubuntu
```




#### macOS

1. **Terminal.app** (Pre-installed)
2. **iTerm2** (Enhanced terminal)

```shellscript
# Using Homebrew
brew install --cask iterm2
```




#### Linux

Most Linux distributions come with a terminal emulator pre-installed.

### Shell Configuration

#### Bash

```shellscript
# Edit bash configuration
nano ~/.bashrc

# Example configuration
export PATH="$HOME/.local/bin:$PATH"
alias ll="ls -la"
alias gs="git status"

# Apply changes
source ~/.bashrc
```

#### Zsh (with Oh My Zsh)

```shellscript
# Install Oh My Zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Edit zsh configuration
nano ~/.zshrc

# Example configuration
plugins=(git node npm docker)
ZSH_THEME="robbyrussell"

# Apply changes
source ~/.zshrc
```

### Package Managers

#### Homebrew (macOS/Linux)

```shellscript
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Update Homebrew
brew update

# Install packages
brew install node git python
```

#### Chocolatey (Windows)

```shellscript
# Install Chocolatey (run in admin PowerShell)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install packages
choco install nodejs git python
```

## Development Workflows

### Node.js & npm

**Installation:**

```shellscript
# Using nvm (recommended for version management)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
nvm install node # Latest version
nvm install 18.17.1 # Specific version

# Direct installation
# macOS/Linux with Homebrew
brew install node

# Windows with Chocolatey
choco install nodejs
```

**Version Information:**

- Node.js: v20.10.0 (or latest LTS)
- npm: v10.2.3 (comes with Node.js)


**Common Commands:**

| Command | Description
|-----|-----
| `node -v` | Check Node.js version
| `npm -v` | Check npm version
| `npm init` | Initialize a new Node.js project
| `npm install <package>` | Install a package locally
| `npm install -g <package>` | Install a package globally
| `npm run <script>` | Run a script defined in package.json
| `npm update` | Update packages
| `npm audit` | Check for vulnerabilities
| `npm publish` | Publish a package to npm registry


**Use Cases:**

1. **Creating a New Node.js Project:**

```shellscript
mkdir my-project
cd my-project
npm init -y
npm install express dotenv
```


2. **Setting Up a TypeScript Project:**

```shellscript
mkdir ts-project
cd ts-project
npm init -y
npm install typescript ts-node @types/node --save-dev
npx tsc --init
```


3. **Creating a package.json with Custom Scripts:**

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "lint": "eslint ."
  }
}
```


4. **Managing Dependencies:**

```shellscript
# Install exact version
npm install express@4.18.2

# Install development dependencies
npm install jest --save-dev

# Remove a package
npm uninstall moment

# List installed packages
npm list --depth=0
```




### Git & GitHub

**Installation:**

```shellscript
# macOS
brew install git

# Ubuntu/Debian
sudo apt update
sudo apt install git

# Windows
choco install git
```

**Common Commands:**

| Command | Description
|-----|-----
| `git init` | Initialize a new Git repository
| `git clone <url>` | Clone a repository
| `git add <file>` | Add file to staging area
| `git commit -m "message"` | Commit changes
| `git push` | Push changes to remote
| `git pull` | Pull changes from remote
| `git branch` | List branches
| `git checkout <branch>` | Switch to branch
| `git merge <branch>` | Merge branch into current branch
| `git status` | Show working tree status
| `git log` | Show commit history


**GitHub CLI:**

```shellscript
# Install GitHub CLI
# macOS
brew install gh

# Windows
choco install gh

# Login
gh auth login

# Create a repository
gh repo create my-project --public

# Create a pull request
gh pr create --title "Feature: Add user authentication" --body "Implements user login and registration"

# List pull requests
gh pr list

# Check repository status
gh repo view
```

**Workflow Example:**

```shellscript
# Start a new feature
git checkout -b feature/user-auth

# Make changes and commit
git add .
git commit -m "Add user authentication"

# Push to remote and create PR
git push -u origin feature/user-auth
gh pr create

# After review, merge PR
gh pr merge
```

### Shopify CLI

**Installation:**

```shellscript
# Using npm
npm install -g @shopify/cli @shopify/theme

# Verify installation
shopify version
```

**Version Information:**

- Shopify CLI: v3.49.0


**Common Commands:**

| Command | Description
|-----|-----
| `shopify version` | Check Shopify CLI version
| `shopify login` | Log in to your Shopify account
| `shopify theme init` | Create a new theme project
| `shopify theme dev` | Start a local development server
| `shopify theme push` | Push theme to Shopify store
| `shopify theme pull` | Pull theme from Shopify store
| `shopify app create` | Create a new Shopify app
| `shopify app dev` | Start local development server for an app
| `shopify app deploy` | Deploy app to Shopify


**Use Cases:**

1. **Creating and Developing a New Shopify Theme:**

```shellscript
# Create a new theme
shopify theme init my-new-theme
cd my-new-theme

# Start development server
shopify theme dev --store=your-store.myshopify.com

# Push theme to store
shopify theme push --store=your-store.myshopify.com
```


2. **Creating a Shopify App:**

```shellscript
# Create a new app
shopify app create

# Select app type (Node.js, Ruby, PHP, etc.)
# Follow the prompts

# Start development server
cd my-shopify-app
shopify app dev
```


3. **Working with Theme Variants:**

```shellscript
# Create a new theme variant
shopify theme variant create --name="Summer Sale"

# Push a specific variant
shopify theme push --theme-id=12345
```




### Vercel CLI

**Installation:**

```shellscript
# Using npm
npm install -g vercel

# Login
vercel login
```

**Version Information:**

- Vercel CLI: v32.5.0


**Common Commands:**

| Command | Description
|-----|-----
| `vercel --version` | Check Vercel CLI version
| `vercel login` | Log in to Vercel
| `vercel` | Deploy current directory to Vercel
| `vercel dev` | Start development server
| `vercel env add` | Add environment variable
| `vercel env ls` | List environment variables
| `vercel domains ls` | List domains
| `vercel logs` | Display deployment logs
| `vercel inspect <deployment>` | Inspect a deployment
| `vercel project add` | Add a new project


**Use Cases:**

1. **Deploying a Next.js Project:**

```shellscript
# Navigate to project directory
cd my-nextjs-project

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```


2. **Setting Up Environment Variables:**

```shellscript
# Add a secret environment variable
vercel env add API_KEY production

# List environment variables
vercel env ls
```


3. **Working with Domains:**

```shellscript
# Add a custom domain
vercel domains add example.com

# List domains
vercel domains ls
```


4. **Viewing Deployment Logs:**

```shellscript
# View logs for the latest deployment
vercel logs

# View logs for a specific deployment
vercel logs deployment-url.vercel.app
```




### Next.js

**Creating a New Project:**

```shellscript
# Using create-next-app
npx create-next-app@latest my-next-app
cd my-next-app

# With TypeScript
npx create-next-app@latest my-next-app --typescript

# With specific template
npx create-next-app@latest my-next-app --example with-tailwindcss
```

**Common Commands:**

| Command | Description
|-----|-----
| `npm run dev` | Start development server
| `npm run build` | Build for production
| `npm start` | Start production server
| `npm run lint` | Run ESLint
| `npx next telemetry disable` | Disable telemetry


**Use Cases:**

1. **Adding a New Page:**

```shellscript
# Create a new page file
touch pages/about.js

# Or for App Router
mkdir -p app/about
touch app/about/page.js
```


2. **Generating Static Pages:**

```shellscript
# Build static site
npm run build
npm run export
```


3. **Installing Common Dependencies:**

```shellscript
# UI libraries
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

# State management
npm install zustand

# Forms
npm install react-hook-form zod @hookform/resolvers
```




### React

**Creating a New Project:**

```shellscript
# Using create-react-app
npx create-react-app my-react-app
cd my-react-app

# With TypeScript
npx create-react-app my-react-app --template typescript

# Using Vite (recommended for faster development)
npm create vite@latest my-react-app -- --template react
npm create vite@latest my-react-app -- --template react-ts
```

**Common Commands:**

| Command | Description
|-----|-----
| `npm start` | Start development server (CRA)
| `npm run dev` | Start development server (Vite)
| `npm run build` | Build for production
| `npm test` | Run tests
| `npm run eject` | Eject from CRA (irreversible)


**Use Cases:**

1. **Adding Components:**

```shellscript
mkdir -p src/components/Button
touch src/components/Button/index.js
touch src/components/Button/Button.js
touch src/components/Button/Button.css
```


2. **Installing UI Libraries:**

```shellscript
# Material UI
npm install @mui/material @emotion/react @emotion/styled

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```


3. **Setting Up State Management:**

```shellscript
# Redux Toolkit
npm install @reduxjs/toolkit react-redux

# Context API (no installation needed)
touch src/context/AppContext.js
```




## Testing & Quality Assurance

### Jest

**Installation:**

```shellscript
npm install --save-dev jest
```

**Configuration:**

```shellscript
# Create Jest config
npx jest --init
```

**Common Commands:**

| Command | Description
|-----|-----
| `npx jest` | Run all tests
| `npx jest --watch` | Run tests in watch mode
| `npx jest --coverage` | Generate coverage report
| `npx jest path/to/test` | Run specific test file
| `npx jest -t "test name"` | Run tests matching name


**Example Test:**

```javascript
// sum.js
function sum(a, b) {
  return a + b;
}
module.exports = sum;

// sum.test.js
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

### Cypress

**Installation:**

```shellscript
npm install --save-dev cypress
```

**Common Commands:**

| Command | Description
|-----|-----
| `npx cypress open` | Open Cypress Test Runner
| `npx cypress run` | Run Cypress tests headlessly
| `npx cypress run --spec "path/to/spec"` | Run specific test
| `npx cypress verify` | Verify Cypress installation


**Example Test:**

```javascript
// cypress/e2e/home.cy.js
describe('Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/')
    cy.contains('Welcome')
    cy.get('nav').should('be.visible')
  })
})
```

### Lighthouse

**Installation:**

```shellscript
npm install -g lighthouse
```

**Version Information:**

- Lighthouse: v11.0.0


**Common Commands:**

| Command | Description
|-----|-----
| `lighthouse --version` | Check Lighthouse version
| `lighthouse <url>` | Audit a URL with default settings
| `lighthouse <url> --output=html --output-path=./report.html` | Save audit as HTML
| `lighthouse <url> --only-categories=performance,accessibility` | Run specific audit categories
| `lighthouse <url> --view` | Open report in browser after audit


**Use Cases:**

1. **Auditing a Website's Performance:**

```shellscript
lighthouse https://example.com --output=html --output-path=./report.html --view
```


2. **Testing Mobile Performance:**

```shellscript
lighthouse https://example.com --emulated-form-factor=mobile
```


3. **Generating JSON Reports for CI/CD:**

```shellscript
lighthouse https://example.com --output=json --output-path=./report.json
```




### ESLint & Prettier

**Installation:**

```shellscript
# ESLint
npm install --save-dev eslint

# Prettier
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

**Configuration:**

```shellscript
# Initialize ESLint
npx eslint --init

# Create Prettier config
echo '{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}' > .prettierrc
```

**Common Commands:**

| Command | Description
|-----|-----
| `npx eslint .` | Lint all files
| `npx eslint . --fix` | Fix linting issues
| `npx prettier --write .` | Format all files
| `npx prettier --check .` | Check formatting


**Integration with package.json:**

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## Deployment & DevOps

### Docker

**Installation:**
Follow the [official Docker installation guide](https://docs.docker.com/get-docker/)

**Common Commands:**

| Command | Description
|-----|-----
| `docker --version` | Check Docker version
| `docker build -t myapp .` | Build an image
| `docker run -p 3000:3000 myapp` | Run a container
| `docker ps` | List running containers
| `docker images` | List images
| `docker-compose up` | Start services defined in docker-compose.yml
| `docker-compose down` | Stop services
| `docker exec -it <container> bash` | Access container shell


**Example Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Example docker-compose.yml:**

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
  db:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_USER: user
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### AWS CLI

**Installation:**

```shellscript
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Windows
choco install awscli
```

**Configuration:**

```shellscript
aws configure
# Enter AWS Access Key ID
# Enter AWS Secret Access Key
# Enter Default region name
# Enter Default output format
```

**Common Commands:**

| Command | Description
|-----|-----
| `aws --version` | Check AWS CLI version
| `aws s3 ls` | List S3 buckets
| `aws s3 cp file.txt s3://bucket/` | Upload file to S3
| `aws s3 sync . s3://bucket/` | Sync directory to S3
| `aws ec2 describe-instances` | List EC2 instances
| `aws lambda list-functions` | List Lambda functions
| `aws cloudformation deploy` | Deploy CloudFormation stack


**Use Cases:**

1. **Deploying a Static Website to S3:**

```shellscript
# Create bucket
aws s3 mb s3://my-website

# Configure for static website hosting
aws s3 website s3://my-website --index-document index.html

# Upload files
aws s3 sync ./build s3://my-website --acl public-read
```


2. **Managing EC2 Instances:**

```shellscript
# Launch instance
aws ec2 run-instances --image-id ami-12345678 --instance-type t2.micro --key-name MyKeyPair

# Stop instance
aws ec2 stop-instances --instance-ids i-1234567890abcdef0
```




### Google Cloud Tools

**Installation:**

```shellscript
# Install Google Cloud SDK
# macOS
brew install --cask google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash

# Windows
choco install gcloudsdk
```

**Configuration:**

```shellscript
gcloud init
```

**Common Commands:**

| Command | Description
|-----|-----
| `gcloud --version` | Check gcloud version
| `gcloud auth login` | Authenticate with Google Cloud
| `gcloud config list` | List configuration
| `gcloud projects list` | List projects
| `gcloud app deploy` | Deploy to App Engine
| `gcloud functions deploy` | Deploy Cloud Function
| `gcloud compute instances list` | List Compute Engine instances
| `gsutil ls` | List Cloud Storage buckets


**Use Cases:**

1. **Deploying to App Engine:**

```shellscript
# Navigate to app directory
cd my-app

# Deploy
gcloud app deploy
```


2. **Working with Cloud Storage:**

```shellscript
# Create bucket
gsutil mb gs://my-bucket

# Upload file
gsutil cp file.txt gs://my-bucket/

# Set permissions
gsutil iam ch allUsers:objectViewer gs://my-bucket
```




### CI/CD Tools

#### GitHub Actions

**Example workflow file (.github/workflows/main.yml):**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      if: github.ref == 'refs/heads/main'
      run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

#### CircleCI

**Example config.yml:**

```yaml
version: 2.1
jobs:
  build:
    docker:
      - image: cimg/node:18.17
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "package.json" }}
      - run: npm install
      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package.json" }}
      - run: npm test
      - run: npm run build
```

## Database Tools

### MongoDB

**Installation:**

```shellscript
# MongoDB Shell
npm install -g mongodb-js/mongosh
```

**Common Commands:**

| Command | Description
|-----|-----
| `mongosh` | Connect to local MongoDB
| `mongosh "mongodb+srv://..."` | Connect to MongoDB Atlas
| `show dbs` | Show databases
| `use <database>` | Switch to database
| `show collections` | Show collections
| `db.collection.find()` | Query documents
| `db.collection.insertOne()` | Insert document
| `db.collection.updateOne()` | Update document
| `db.collection.deleteOne()` | Delete document


**Example Script:**

```javascript
// Connect to MongoDB
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("sample_db");
    const collection = database.collection("users");
    
    // Insert a document
    const result = await collection.insertOne({
      name: "John Doe",
      email: "john@example.com"
    });
    console.log(`Inserted document with _id: ${result.insertedId}`);
    
    // Find documents
    const users = await collection.find({}).toArray();
    console.log("Found documents:", users);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
```

### PostgreSQL

**Installation:**

```shellscript
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Windows
choco install postgresql
```

**Common Commands:**

| Command | Description
|-----|-----
| `psql --version` | Check PostgreSQL version
| `psql -U postgres` | Connect as postgres user
| `\l` | List databases
| `\c database_name` | Connect to database
| `\dt` | List tables
| `\d table_name` | Describe table
| `\q` | Quit psql


**Example SQL Commands:**

```sql
-- Create database
CREATE DATABASE myapp;

-- Connect to database
\c myapp

-- Create table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data
INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');

-- Query data
SELECT * FROM users;
```

## API Development & Testing

### cURL

**Version Information:**

- cURL: v8.1.2


**Common Commands:**

| Command | Description
|-----|-----
| `curl --version` | Check cURL version
| `curl <url>` | Make a GET request
| `curl -I <url>` | Get only headers
| `curl -o file.html <url>` | Save output to a file
| `curl -X POST <url> -d "key=value"` | Make a POST request
| `curl -X POST <url> -H "Content-Type: application/json" -d '{"key":"value"}'` | POST with JSON
| `curl -u username:password <url>` | Basic authentication
| `curl -H "Authorization: Bearer token" <url>` | Bearer token auth


**Use Cases:**

1. **Testing a REST API:**

```shellscript
# GET request
curl https://api.example.com/users

# POST request with JSON
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# PUT request
curl -X PUT https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated"}'

# DELETE request
curl -X DELETE https://api.example.com/users/123
```


2. **Working with Authentication:**

```shellscript
# Basic auth
curl -u username:password https://api.example.com/secure

# Bearer token
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  https://api.example.com/secure
```


3. **Downloading Files:**

```shellscript
# Download file
curl -O https://example.com/file.zip

# Download with progress bar
curl -# -O https://example.com/large-file.zip

# Resume download
curl -C - -O https://example.com/large-file.zip
```




### Postman CLI (Newman)

**Installation:**

```shellscript
npm install -g newman
```

**Common Commands:**

| Command | Description
|-----|-----
| `newman --version` | Check Newman version
| `newman run collection.json` | Run a Postman collection
| `newman run collection.json -e environment.json` | Run with environment
| `newman run collection.json --folder "Folder Name"` | Run specific folder
| `newman run collection.json -r cli,html` | Generate reports


**Use Cases:**

1. **Running a Collection:**

```shellscript
# Export collection from Postman
# Then run it with Newman
newman run MyCollection.postman_collection.json
```


2. **Automating API Tests in CI/CD:**

```shellscript
# In GitHub Actions workflow
- name: Run API Tests
  run: |
    npm install -g newman
    newman run ./tests/api-tests.postman_collection.json -e ./tests/env.json
```


3. **Generating Test Reports:**

```shellscript
# Install reporter
npm install -g newman-reporter-htmlextra

# Run with reporter
newman run collection.json -r htmlextra
```




## Performance & SEO Tools

### PageSpeed Insights

**Installation:**

```shellscript
npm install -g psi
```

**Common Commands:**

| Command | Description
|-----|-----
| `psi --version` | Check PageSpeed Insights version
| `psi <url>` | Analyze URL with default settings
| `psi | Check PageSpeed Insights version
| `psi <url>` | Analyze URL with default settings
| `psi <url> --strategy=mobile` | Run mobile analysis
| `psi <url> --strategy=desktop` | Run desktop analysis
| `psi <url> --json` | Output results as JSON
| `psi <url> --key=<API_KEY>` | Use Google API key


**Use Cases:**

1. **Analyzing Mobile Performance:**

```shellscript
psi https://example.com --strategy=mobile
```


2. **Generating a Performance Report:**

```shellscript
psi https://example.com --json > performance-report.json
```


3. **Comparing Mobile and Desktop Performance:**

```shellscript
psi https://example.com --strategy=mobile
psi https://example.com --strategy=desktop
```




### Sitemap Generator

**Installation:**

```shellscript
npm install -g sitemap-generator-cli
```

**Common Commands:**

| Command | Description
|-----|-----
| `sitemap-generator --version` | Check Sitemap Generator version
| `sitemap-generator <url>` | Generate sitemap for a website
| `sitemap-generator <url> --filepath=./sitemap.xml` | Specify output file
| `sitemap-generator <url> --verbose` | Show detailed information
| `sitemap-generator <url> --max-depth=10` | Set crawl depth
| `sitemap-generator <url> --user-agent='Custom Bot'` | Set user agent


**Use Cases:**

1. **Generating a Basic Sitemap:**

```shellscript
sitemap-generator https://example.com --filepath=./sitemap.xml
```


2. **Creating a Sitemap with Restricted Depth:**

```shellscript
sitemap-generator https://example.com --max-depth=3 --filepath=./sitemap.xml
```


3. **Running a Verbose Crawl:**

```shellscript
sitemap-generator https://example.com --verbose --filepath=./sitemap.xml
```




### Puppeteer

**Installation:**

```shellscript
npm install puppeteer
```

**Common Commands:**
Puppeteer is primarily used in scripts rather than direct CLI commands.

**Use Cases (Node.js Script Examples):**

1. **Taking Screenshots of Websites:**

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'example.png' });
  await browser.close();
})();
```


2. **Generating PDFs from Webpages:**

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.pdf({ path: 'example.pdf', format: 'A4' });
  await browser.close();
})();
```


3. **Web Scraping:**

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  
  const data = await page.evaluate(() => {
    const title = document.querySelector('h1').innerText;
    const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.innerText);
    return { title, paragraphs };
  });
  
  console.log(data);
  await browser.close();
})();
```


4. **Performance Testing:**

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Enable performance metrics
  await page.setCacheEnabled(false);
  await page.coverage.startJSCoverage();
  await page.coverage.startCSSCoverage();
  
  // Navigate to page
  const start = Date.now();
  await page.goto('https://example.com');
  const navigationTime = Date.now() - start;
  
  // Get coverage data
  const jsCoverage = await page.coverage.stopJSCoverage();
  const cssCoverage = await page.coverage.stopCSSCoverage();
  
  // Calculate unused bytes
  const jsUsed = jsCoverage.reduce((acc, entry) => acc + entry.text.length, 0);
  const cssUsed = cssCoverage.reduce((acc, entry) => acc + entry.text.length, 0);
  
  console.log(`Navigation time: ${navigationTime}ms`);
  console.log(`JS used: ${jsUsed} bytes`);
  console.log(`CSS used: ${cssUsed} bytes`);
  
  await browser.close();
})();
```




## Automation & Scripting

### Bash Scripting

**Basic Script Structure:**

```shellscript
#!/bin/bash

# Variables
NAME="World"
CURRENT_DATE=$(date +%Y-%m-%d)

# Functions
greet() {
  echo "Hello, $1!"
}

# Main script
echo "Today is $CURRENT_DATE"
greet "$NAME"

# Conditionals
if [ -f "config.json" ]; then
  echo "Config file exists"
else
  echo "Config file not found"
fi

# Loops
for i in {1..5}; do
  echo "Count: $i"
done
```

**Common Use Cases:**

1. **Automating Deployment:**

```shellscript
#!/bin/bash

# Build the application
echo "Building application..."
npm run build

# Deploy to server
echo "Deploying to server..."
rsync -avz --delete ./build/ user@server:/var/www/html/

echo "Deployment completed successfully!"
```


2. **Database Backup:**

```shellscript
#!/bin/bash

# Variables
DB_NAME="myapp"
BACKUP_DIR="/backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
pg_dump "$DB_NAME" > "$BACKUP_DIR/$DB_NAME-$DATE.sql"

# Remove backups older than 7 days
find "$BACKUP_DIR" -name "$DB_NAME-*.sql" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/$DB_NAME-$DATE.sql"
```


3. **Project Setup Script:**

```shellscript
#!/bin/bash

# Check if project name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <project-name>"
  exit 1
fi

PROJECT_NAME="$1"

# Create project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Initialize Git repository
git init

# Create basic structure
mkdir -p src/{components,pages,utils,styles}
touch src/index.js

# Initialize npm project
npm init -y

# Install dependencies
npm install react react-dom
npm install --save-dev webpack webpack-cli babel-loader @babel/core @babel/preset-react

echo "Project $PROJECT_NAME created successfully!"
```




### Task Runners

#### npm Scripts

**Example package.json:**

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "webpack --mode production",
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write .",
    "deploy": "npm run build && vercel --prod",
    "db:migrate": "knex migrate:latest",
    "db:seed": "knex seed:run",
    "prepare": "husky install"
  }
}
```

#### Make (Makefile)

**Example Makefile:**

```makefile
.PHONY: setup build test deploy clean

setup:
	npm install

build:
	npm run build

test:
	npm test

deploy: build
	aws s3 sync ./build s3://my-website --acl public-read

clean:
	rm -rf node_modules
	rm -rf build

all: setup build test deploy
```

## Troubleshooting & Debugging

### Common Issues and Solutions

1. **Node.js Version Conflicts:**

```shellscript
# Check current Node.js version
node -v

# Install and use nvm to manage versions
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
nvm install 18
nvm use 18
```


2. **Permission Issues:**

```shellscript
# Fix npm permissions
npm config set prefix ~/.npm
echo 'export PATH=~/.npm/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Alternative: use sudo (not recommended)
sudo npm install -g package-name
```


3. **Port Already in Use:**

```shellscript
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Alternative: use a different port
PORT=3001 npm start
```


4. **Git Merge Conflicts:**

```shellscript
# Check status
git status

# Resolve conflicts manually in editor

# After resolving
git add .
git commit -m "Resolve merge conflicts"

# Abort merge if needed
git merge --abort
```




### Debugging Tools

1. **Node.js Debugging:**

```shellscript
# Start app with inspector
node --inspect server.js

# Break on first line
node --inspect-brk server.js

# Then open Chrome and navigate to chrome://inspect
```


2. **React DevTools:**

```shellscript
# Install globally
npm install -g react-devtools

# Launch
react-devtools
```


3. **Network Debugging:**

```shellscript
# Check connectivity
ping example.com

# Trace route
traceroute example.com

# Check DNS
dig example.com

# Monitor HTTP requests
curl -v https://example.com
```




## Best Practices

### Security

1. **Environment Variables:**

```shellscript
# Store secrets in .env file (never commit to git)
echo "API_KEY=your_secret_key" >> .env

# Add to .gitignore
echo ".env" >> .gitignore

# Use dotenv to load in Node.js
require('dotenv').config()
```


2. **Dependency Auditing:**

```shellscript
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```


3. **Code Signing:**

```shellscript
# Generate GPG key
gpg --full-generate-key

# Configure Git to use GPG
git config --global user.signingkey YOUR_GPG_KEY_ID
git config --global commit.gpgsign true

# Sign commits
git commit -S -m "Signed commit message"
```




### Performance

1. **Optimizing Build Process:**

```shellscript
# Analyze webpack bundle
npx webpack-bundle-analyzer

# Use production mode
NODE_ENV=production npm run build
```


2. **Caching:**

```shellscript
# Set cache headers in server
res.setHeader('Cache-Control', 'public, max-age=86400');

# Use service worker for offline caching
npx create-react-app my-app --template cra-template-pwa
```


3. **Code Splitting:**

```javascript
// Dynamic import in React
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// In webpack config
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
```




### Workflow Efficiency

1. **Aliases and Functions:**

```shellscript
# Add to .bashrc or .zshrc
alias gs="git status"
alias gc="git commit -m"
alias gl="git log --oneline"

# Function to create and enter directory
mkcd() {
  mkdir -p "$1" && cd "$1"
}
```


2. **Git Hooks:**

```shellscript
# Install husky
npm install --save-dev husky lint-staged

# Configure in package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write"]
  }
}
```


3. **Project Templates:**

```shellscript
# Create template
npx create-next-app --example with-tailwindcss my-template

# Save as template
git clone https://github.com/yourusername/my-template.git

# Use template
npx degit yourusername/my-template my-new-project
```




## Additional Resources

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [npm Documentation](https://docs.npmjs.com/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Shopify CLI Documentation](https://shopify.dev/docs/themes/tools/cli)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Jest Documentation](https://jestjs.io/docs)
- [Cypress Documentation](https://docs.cypress.io)
- [Docker Documentation](https://docs.docker.com/)
- [AWS CLI Documentation](https://awscli.amazonaws.com/v2/documentation/api/latest/index.html)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [cURL Documentation](https://curl.se/docs/)
- [Bash Scripting Guide](https://tldp.org/LDP/abs/html/)


```plaintext

This comprehensive CLI workflow guide covers all the essential tools and commands for modern web development, from environment setup to deployment and automation. It includes detailed instructions, examples, and best practices to help streamline your development workflow.
```