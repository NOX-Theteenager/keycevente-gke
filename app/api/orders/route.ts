import { NextRequest, NextResponse } from 'next/server';
import { createOrder, clearCart } from '@/lib/db-helpers';

function getSessionId(request: NextRequest): string {
  const cookies = request.headers.get('cookie') || '';
  const sessionMatch = cookies.match(/sessionId=([^;]*)/);
  return sessionMatch ? sessionMatch[1] : '';
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    const {
      customerEmail,
      customerName,
      shippingAddress,
      items,
    } = await request.json();

    if (!customerEmail || !customerName || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const order = await createOrder(
      customerEmail,
      customerName,
      shippingAddress,
      items
    );

    // Clear the cart after successful order
    if (sessionId) {
      await clearCart(sessionId);
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
