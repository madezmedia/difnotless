# Security Guidelines

## API Keys and Secrets Management

### GitHub Secrets

All sensitive information should be stored as GitHub repository secrets. **NEVER commit API keys, tokens, or passwords to the repository.**

To set up GitHub Secrets:
1. Go to your repository on GitHub
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each required secret with appropriate naming

### Required Secrets

Store the following as GitHub secrets:

- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `SHOPIFY_ADMIN_ACCESS_TOKEN`
- `SHOPIFY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`
- `MAKE_WEBHOOK_SECRET`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Vercel Environment Variables

Ensure the same secrets are set in your Vercel project settings under Environment Variables.

## Security Best Practices

1. **Token Scope**: Use the least privilege principle when creating access tokens
2. **Token Rotation**: Rotate all access tokens quarterly
3. **Webhook Secrets**: Validate all incoming webhooks using HMAC signatures
4. **CORS Settings**: Restrict API access to known domains only
5. **Rate Limiting**: Implement API rate limiting to prevent abuse
6. **Input Validation**: Validate all user input both client and server-side
7. **Error Handling**: Use generic error messages in production to avoid leaking sensitive information

## API Security Implementation

### Shopify Webhook Validation

All Shopify webhooks must be validated using HMAC signatures:

```typescript
// Example webhook validation in route.ts
const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
const rawBody = await request.text();

// Verify webhook authenticity
if (!verifyWebhookHmac(rawBody, hmacHeader, process.env.SHOPIFY_WEBHOOK_SECRET)) {
  return Response.json({ error: 'Invalid signature' }, { status: 401 });
}
```

### Make.com Webhook Security

```typescript
// Example Make.com webhook validation
const signature = request.headers.get('x-make-signature');
const body = await request.text();

if (!verifyMakeSignature(body, signature, process.env.MAKE_WEBHOOK_SECRET)) {
  return Response.json({ error: 'Invalid webhook signature' }, { status: 401 });
}
```

## Local Development Security

1. Always use `.env.local` for local development (added to `.gitignore`)
2. Copy `.env.example` to `.env.local` and add your development values
3. Never use production tokens for local development; create separate development tokens
4. Regularly check dependencies for vulnerabilities with `npm audit`

## Reporting Security Issues

If you discover a security vulnerability, please email security@difnotless.com rather than using the public issue tracker.