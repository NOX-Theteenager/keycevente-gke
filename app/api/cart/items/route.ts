import { NextRequest, NextResponse } from 'next/server';
import { addToCart, updateCartItemQuantity, removeFromCart } from '@/lib/db-helpers';

function getSessionId(request: NextRequest): string {
  const cookies = request.headers.get('cookie') || '';
  const sessionMatch = cookies.match(/sessionId=([^;]*)/);
  return sessionMatch ? sessionMatch[1] : `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    const { productId, quantity } = await request.json();

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid product or quantity' },
        { status: 400 }
      );
    }

    const cartItem = await addToCart(sessionId, productId, quantity);

    const response = NextResponse.json({
      success: true,
      data: cartItem,
    });

    response.headers.set('Set-Cookie', `sessionId=${sessionId}; Path=/; Max-Age=31536000`);
    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { cartItemId, quantity } = await request.json();

    if (!cartItemId || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      );
    }

    const cartItem = await updateCartItemQuantity(cartItemId, quantity);

    return NextResponse.json({
      success: true,
      data: cartItem,
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { cartItemId } = await request.json();

    if (!cartItemId) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      );
    }

    const cartItem = await removeFromCart(cartItemId);

    return NextResponse.json({
      success: true,
      data: cartItem,
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
