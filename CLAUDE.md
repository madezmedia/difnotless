# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context
DifNotLess is an e-commerce platform for neurodivergent individuals, combining curated products with educational resources and accessibility features. It uses Next.js App Router with Shopify Storefront API integration and Sanity CMS for content.

## Build Commands
- Development: `npm run dev`
- Production build: `npm run build`
- Start production: `npm run start`
- Lint: `npm run lint`

## Test Commands
- Run single unit test: `vitest run [test-file-path]`
- Run e2e test: `playwright test [test-file-path]`
- Run Shopify tests: `ts-node scripts/run-shopify-tests.ts`

## Code Style Guidelines
- TypeScript with strict mode enabled
- React functional components with explicit return types
- "use client" directive for client components 
- PascalCase for components/types, camelCase for functions/variables
- Import order: React/external libraries first, then internal imports
- UI components use Radix primitives with Tailwind styling (shadcn/ui)
- Error handling: try/catch with specific error types and fallback mechanisms
- Network errors: Implement retry with exponential backoff
- Use React Context for global state (cart, theme)
- Accessibility: Prioritize WCAG 2.1 AA compliance in all components
- Data fetching: Use server components when possible for SEO and performance