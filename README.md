# DifNotLess

E-commerce platform designed for neurodivergent individuals, combining curated products with educational resources, accessibility features, and community support.

## Features

- Shopify Storefront API integration for product management
- Accessibility-first design approach (WCAG 2.1 AA compliant)
- Make.com workflows for order processing automation
- Dark mode and high contrast support
- Responsive design for all devices
- Educational resources and blog content via Sanity CMS

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Shopify store account
- Make.com account
- Sanity CMS account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/difnotless.git
   cd difnotless
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables
   Create a `.env.local` file based on the example below:
   ```
   # Shopify API
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
   SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-access-token

   # Sanity CMS
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your-sanity-api-token

   # Make.com Webhooks
   MAKE_WEBHOOK_SECRET=your-webhook-secret
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture

The application is built using Next.js 14 with App Router, Tailwind CSS, and TypeScript. It integrates with:

- Shopify Storefront API for product data
- Sanity CMS for blog and educational content
- Make.com for order processing automation

### Key Components

- `lib/shopify.ts`: Shopify Storefront API client
- `components/product/`: Product display components
- `components/cart/`: Shopping cart functionality
- `components/accessibility/`: Accessibility tools
- `app/api/`: API routes for webhooks and server operations

## Deployment

The application is deployed using Vercel with automatic deployments for PRs and production deployments for the main branch.

## Contributing

Please follow our branch naming conventions:
- `feature/` for new features
- `fix/` for bug fixes
- `refactor/` for code improvements
- `docs/` for documentation updates

## License

This project is licensed under the MIT License - see LICENSE file for details.