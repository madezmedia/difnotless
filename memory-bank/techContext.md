# Technical Context: DifNotLess

## Technology Stack

### Core Technologies
- **Next.js 14**: React framework with App Router
- **React 18**: UI component library
- **TypeScript 5**: Type-safe JavaScript
- **Tailwind CSS 3**: Utility-first CSS
- **Shadcn/UI**: Component library on Radix primitives

### E-commerce
- **Shopify Storefront API**: Headless commerce backend
- **Shopify Webhooks**: Real-time inventory updates

### Automation
- **Make.com**: Workflow automation (replacing n8n)
  - Order processing scenarios
  - Inventory management
  - Customer communications
  - Marketing integrations

### Content Management
- **Sanity CMS**: Structured content
- **Portable Text**: Rich text format
- **GROQ**: Query language for Sanity

### State Management
- **React Context**: Global state (cart, theme)
- **React Hooks**: Component-level state
- **localStorage**: User preferences persistence

### Testing
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Cypress**: E2E testing
- **Axe**: Accessibility testing

## Development Setup

### Prerequisites
- Node.js v18+
- npm v9+ or pnpm v8+
- Git

### Environment Variables
```
# Shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
SHOPIFY_WEBHOOK_SECRET=your-secret

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-id
NEXT_PUBLIC_SANITY_DATASET=production

# Make.com
MAKE_API_KEY=your-key

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Local Development
```bash
git clone https://github.com/your-org/difnotless.git
cd difnotless
pnpm install
cp .env.example .env.local
# Edit .env.local with credentials
pnpm dev
```

## Technical Constraints

### Performance Targets
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

### Accessibility Requirements
- WCAG 2.1 AA minimum (AAA for key flows)
- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Full keyboard navigation
- Minimum contrast ratio: 4.5:1 normal, 3:1 large text

### Browser Support
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- iOS Safari, Android Chrome (latest 2 versions)

## Tool Usage Patterns

### Next.js Patterns
```typescript
// Server Component
export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);
  return <ProductDetails product={product} />;
}

// API Route
export async function GET(request) {
  const products = await getProducts();
  return Response.json({ products });
}
```

### Shopify Integration
```typescript
// Fetching Products
export async function getProducts() {
  const client = createStorefrontClient();
  const response = await client.query({
    query: PRODUCTS_QUERY,
    variables: { first: 10 }
  });
  return response.data.products.edges.map(edge => edge.node);
}
```

### Make.com Integration
```typescript
// Webhook handling
export async function POST(request) {
  // Verify webhook authenticity
  const body = await request.text();
  const hmac = request.headers.get('x-make-signature');
  
  if (!verifyWebhook(body, hmac)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  // Process webhook
  const data = JSON.parse(body);
  await processOrderUpdate(data);
  
  return Response.json({ success: true });
}
```

### Accessibility Implementation
```typescript
// Reduced motion hook
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
}
```

## CI/CD Pipeline
- GitHub Actions for automated testing
- Vercel for preview and production deployments
- Branch strategy: main (prod), develop (integration), feature branches
