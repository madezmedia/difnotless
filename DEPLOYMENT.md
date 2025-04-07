# Deployment Guide

This document outlines the steps to deploy DifNotLess using GitHub and Vercel.

## Setting up GitHub Secrets

For secure CI/CD, add the following secrets in your GitHub repository settings (Settings > Secrets and variables > Actions):

1. `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` - Your Shopify store domain
2. `SHOPIFY_STOREFRONT_ACCESS_TOKEN` - Your Shopify Storefront API access token
3. `SHOPIFY_ADMIN_ACCESS_TOKEN` - Your Shopify Admin API access token
4. `SHOPIFY_WEBHOOK_SECRET` - Your Shopify webhook secret
5. `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
6. `NEXT_PUBLIC_SANITY_DATASET` - Your Sanity dataset name (usually "production")
7. `SANITY_API_TOKEN` - Your Sanity API token
8. `MAKE_WEBHOOK_SECRET` - Your Make.com webhook secret
9. `VERCEL_TOKEN` - Your Vercel API token
10. `VERCEL_ORG_ID` - Your Vercel organization ID
11. `VERCEL_PROJECT_ID` - Your Vercel project ID

## Setting up Vercel

1. Create a new project in Vercel
   - Connect your GitHub repository
   - Set the framework preset to Next.js

2. Add the following environment variables in Vercel:
   - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
   - `SHOPIFY_ADMIN_ACCESS_TOKEN`
   - `SHOPIFY_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_TOKEN`
   - `MAKE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (set to your production URL)

3. Deploy settings
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`
   - Development Command: `npm run dev`

## Automated Deployments

With the GitHub Actions workflow configured, your application will automatically:

1. Lint and test on every push to main or PR
2. Build on push to main
3. Deploy to Vercel production on push to main

## Manual Deployments

If needed, you can also deploy manually from the Vercel dashboard.

## Getting Vercel Project Information

To obtain the Vercel token, organization ID, and project ID:

1. **Vercel Token**: Create in your Vercel account settings under "Tokens"
2. **Organization ID and Project ID**: Run these commands after installing Vercel CLI:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Link your project (if not already linked)
   vercel link

   # View project info
   vercel project ls
   ```

## Important Security Notes

- Never commit environment files (.env, .env.local) to your repository
- Rotate secrets periodically for enhanced security
- Use scoped tokens with minimal required permissions
- For local development, copy `.env.example` to `.env.local` and add your values