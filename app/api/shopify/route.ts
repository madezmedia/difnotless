import { NextResponse } from 'next/server';
import { shopifyClient, testShopifyConnection } from '@/lib/shopify';

export async function GET() {
  try {
    // Test the connection using server-side credentials
    const connectionTest = await testShopifyConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json(
        { error: 'Shopify connection failed' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Shopify API route error:', error);
    return NextResponse.json(
      { error: 'Shopify API error' },
      { status: 500 }
    );
  }
}
