import { query } from './db';
import { Product, Category, Cart, CartItem, Order, OrderItem } from './types';

// Categories
export async function getCategories(): Promise<Category[]> {
  const result = await query('SELECT * FROM categories ORDER BY name');
  return result.rows;
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
  return result.rows[0] || null;
}

// Products
export async function getProducts(): Promise<Product[]> {
  const result = await query(
    'SELECT * FROM products ORDER BY category_id, name'
  );
  return result.rows;
}

export async function getProductById(id: number): Promise<Product | null> {
  const result = await query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getProductsByCategory(
  categoryId: number
): Promise<Product[]> {
  const result = await query(
    'SELECT * FROM products WHERE category_id = $1 ORDER BY name',
    [categoryId]
  );
  return result.rows;
}

export async function searchProducts(searchTerm: string): Promise<Product[]> {
  const result = await query(
    'SELECT * FROM products WHERE LOWER(name) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($2) ORDER BY name',
    [`%${searchTerm}%`, `%${searchTerm}%`]
  );
  return result.rows;
}

// Cart operations
export async function getOrCreateCart(sessionId: string): Promise<Cart> {
  let result = await query('SELECT * FROM carts WHERE session_id = $1', [
    sessionId,
  ]);

  if (result.rows.length === 0) {
    result = await query(
      'INSERT INTO carts (session_id) VALUES ($1) RETURNING *',
      [sessionId]
    );
  }

  return result.rows[0];
}

export async function getCartWithProducts(sessionId: string) {
  const cart = await getOrCreateCart(sessionId);

  const result = await query(
    `SELECT ci.*, p.* FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id = $1`,
    [cart.id]
  );

  return {
    ...cart,
    items: result.rows.map((row) => ({
      id: row.id,
      cart_id: row.cart_id,
      product_id: row.product_id,
      quantity: row.quantity,
      created_at: row.created_at,
      product: {
        id: row.product_id,
        name: row.name,
        price: row.price,
        stock_quantity: row.stock_quantity,
        category_id: row.category_id,
        image_url: row.image_url,
        description: row.description,
        created_at: row.created_at,
        updated_at: row.updated_at,
      },
    })),
  };
}

export async function addToCart(
  sessionId: string,
  productId: number,
  quantity: number
): Promise<CartItem> {
  const cart = await getOrCreateCart(sessionId);

  const result = await query(
    `INSERT INTO cart_items (cart_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (cart_id, product_id) 
     DO UPDATE SET quantity = quantity + $3
     RETURNING *`,
    [cart.id, productId, quantity]
  );

  return result.rows[0];
}

export async function updateCartItemQuantity(
  cartItemId: number,
  quantity: number
): Promise<CartItem> {
  if (quantity <= 0) {
    return await removeFromCart(cartItemId);
  }

  const result = await query(
    'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
    [quantity, cartItemId]
  );

  return result.rows[0];
}

export async function removeFromCart(cartItemId: number): Promise<CartItem> {
  const result = await query(
    'DELETE FROM cart_items WHERE id = $1 RETURNING *',
    [cartItemId]
  );

  return result.rows[0];
}

export async function clearCart(sessionId: string): Promise<void> {
  const cart = await getOrCreateCart(sessionId);
  await query('DELETE FROM cart_items WHERE cart_id = $1', [cart.id]);
}

// Orders
export async function createOrder(
  customerEmail: string,
  customerName: string,
  shippingAddress: string,
  items: Array<{ productId: number; quantity: number }>
): Promise<Order> {
  // Calculate total
  let totalAmount = 0;
  const orderItems: OrderItem[] = [];

  for (const item of items) {
    const product = await getProductById(item.productId);
    if (product) {
      totalAmount += product.price * item.quantity;
      orderItems.push({
        id: 0,
        order_id: 0,
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: product.price,
        created_at: new Date().toISOString(),
      });
    }
  }

  // Create order
  const orderNumber = `ORD-${Date.now()}`;
  const result = await query(
    `INSERT INTO orders (order_number, customer_email, customer_name, total_amount, shipping_address, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [orderNumber, customerEmail, customerName, totalAmount, shippingAddress, 'pending']
  );

  const order = result.rows[0];

  // Add order items
  for (const item of orderItems) {
    await query(
      `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        order.id,
        item.product_id,
        item.product_name,
        item.quantity,
        item.unit_price,
      ]
    );
  }

  return order;
}

export async function getOrder(orderId: number): Promise<Order | null> {
  const result = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
  return result.rows[0] || null;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const result = await query(
    'SELECT * FROM orders WHERE order_number = $1',
    [orderNumber]
  );
  return result.rows[0] || null;
}

export async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  const result = await query(
    'SELECT * FROM order_items WHERE order_id = $1',
    [orderId]
  );
  return result.rows;
}

export async function updateOrderStatus(
  orderId: number,
  status: string
): Promise<Order> {
  const result = await query(
    'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [status, orderId]
  );
  return result.rows[0];
}
