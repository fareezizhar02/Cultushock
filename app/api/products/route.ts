import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    
    const productsCollection = await getCollection('products');
    
    // Build query
    let query: any = {};
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    
    const products = await productsCollection.find(query).toArray();
    
    return NextResponse.json({
      success: true,
      products: products,
      count: products.length,
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}