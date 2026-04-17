import { NextRequest, NextResponse } from 'next/server';
import {
  getProducts,
  getProductsByCategory,
  searchProducts,
} from '@/lib/db-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');

    let products;

    if (search) {
      products = await searchProducts(search);
    } else if (categoryId) {
      products = await getProductsByCategory(parseInt(categoryId));
    } else {
      products = await getProducts();
    }

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
