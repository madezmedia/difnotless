# Vercel Deployment Setup

Follow these steps to deploy DifNotLess to Vercel and link it with your GitHub repository.

## Step 1: Complete Vercel Login

First, complete the Vercel login process in your terminal:

```bash
vercel login
```

Select "Continue with GitHub" and follow the prompts to authenticate.

## Step 2: Link Project to Vercel

From your project directory, run:

```bash
vercel link
```

- Select "Create a new project" when prompted
- Confirm the project settings (NextJS framework detection should be automatic)
- When asked about your Build Command, press Enter to use `npm run build`
- When asked about your Development Command, press Enter to use `npm run dev`
- When asked about the Output Directory, press Enter to use `.next`

## Step 3: Set Up Environment Variables in Vercel

Go to [Vercel Dashboard](https://vercel.com/dashboard) and select your newly created project.

Navigate to Settings > Environment Variables and add the following variables:

```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=difnotless.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=c453b1fe8ce5365e46e7f4323a43a802
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=c453b1fe8ce5365e46e7f4323a43a802
NEXT_PUBLIC_SANITY_PROJECT_ID=qquhqgga
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-03-25
SANITY_API_TOKEN=[your_sanity_token]
AIRTABLE_API_KEY=[your_airtable_api_key]
PRINTIFY_API_TOKEN=[your_printify_api_token]
```

Make sure to replace any placeholder values with your actual secret tokens.

## Step 4: Deploy Your Project

After setting up environment variables, deploy your project with:

```bash
vercel --prod
```

This will start the deployment process. Vercel will build and deploy your project to production.

## Step 5: Set Up GitHub Integration

In your Vercel project dashboard:

1. Go to Settings > Git
2. Under "Git Integration", connect to your GitHub repository if not already connected
3. Enable automatic deployments from the main branch

With this setup, any push to the main branch of your GitHub repository will automatically trigger a new deployment on Vercel.

## Step 6: Configure Domain (Optional)

To add a custom domain:

1. Go to Settings > Domains
2. Add your domain and follow the verification steps

## Troubleshooting

If you encounter any issues:

1. Check the build logs in your Vercel dashboard
2. Verify that all environment variables are correctly set
3. Ensure your project has the correct framework settings (Next.js)
4. Check that your vercel.json configuration is valid