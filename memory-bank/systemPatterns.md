# System Patterns: DifNotLess

## System Architecture
Modern web application using Next.js with focus on accessibility and performance. Hybrid approach leveraging server-side rendering and client-side interactivity.

### Key Architectural Decisions
1. **Next.js Framework**: Server-side rendering, static generation, API routes
2. **Headless Commerce**: Shopify backend with custom frontend
3. **Content Management**: Sanity CMS for structured content
4. **UI Component System**: Component-driven with Shadcn/UI foundation
5. **Make.com Integration**: For automation workflows, replacing n8n

## Design Patterns

### Component Patterns
1. **Compound Components**: For complex interactive elements
   ```tsx
   <A11yTools>
     <A11yTools.HighContrastToggle />
     <A11yTools.TextSizeAdjuster />
   </A11yTools>
   ```

2. **Provider Pattern**: For shared state
   ```tsx
   <CartProvider>
     <Header />
     <Main />
   </CartProvider>
   ```

3. **Custom Hooks**: For reusable logic
   ```tsx
   const prefersReducedMotion = useReducedMotion();
   ```

### State Management
1. **Local Component State**: Component-specific state
2. **Context API**: Global state (cart, theme, accessibility)
3. **Server State**: Data from external APIs with caching

### Accessibility Patterns
1. **Progressive Enhancement**: Core functionality works without JS
2. **ARIA Enhancements**: Improve screen reader experiences
3. **Focus Management**: Explicit focus for interactive elements
4. **Keyboard Navigation**: All interactive elements keyboard accessible

## Component Relationships

### Core Structure
- Layout (Header, Main, Footer)
- Pages (Home, Product, Collection, Checkout, Resource, Blog)
- Feature Components (nested under pages)

### Key Component Examples
1. **Product Details**: Images, Info, Variants, Inventory, Add to Cart
2. **Cart**: Header, Items, Summary, Checkout Button
3. **Accessibility Tools**: Contrast, Text Size, Motion Controls

## Critical Implementation Paths

### Product Data Flow
1. Client requests product page
2. Server fetches from Shopify
3. Server fetches enhanced content from Sanity
4. Server renders combined data
5. Client interactions update UI

### Checkout Flow
1. Client initiates checkout
2. App creates checkout in Shopify
3. Client redirects to checkout
4. Client completes purchase
5. App displays confirmation

### Accessibility Customization
1. User opens accessibility menu
2. User selects preferences
3. Changes applied immediately
4. Preferences saved to localStorage
4. Preferences applied on subsequent pages

## Technical Debt

### Current Issues
1. **Cart Implementation**: Local storage needs migration to Shopify's cart API
2. **Image Optimization**: Needs consistent Next.js Image implementation
3. **Make.com Migration**: Completing workflow transition from n8n

### Planned Refactoring
1. **State Management**: Consider React Query for server state
2. **Component Structure**: Break down larger components
3. **Performance**: Implement code splitting, optimize 3rd-party scripts

## Testing Strategy
- **Unit**: React Testing Library for components
- **Integration**: Critical user flows
- **Accessibility**: Axe-core automated + manual screen reader testing
- **Performance**: Lighthouse CI for metrics
