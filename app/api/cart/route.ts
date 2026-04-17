import { NextRequest, NextResponse } from 'next/server';
import { getCartWithProducts, clearCart } from '@/lib/db-helpers';

function getSessionId(request: NextRequest): string {
  const cookies = request.headers.get('cookie') || '';
  const sessionMatch = cookies.match(/sessionId=([^;]*)/);
  let sessionId = sessionMatch ? sessionMatch[1] : null;

  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  return sessionId;
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    const cart = await getCartWithProducts(sessionId);

    const response = NextResponse.json({
      success: true,
      data: cart,
    });

    response.headers.set('Set-Cookie', `sessionId=${sessionId}; Path=/; Max-Age=31536000`);
    return response;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    await clearCart(sessionId);

    return NextResponse.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
