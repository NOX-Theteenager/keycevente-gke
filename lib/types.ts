// Category type
export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

// Product type
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// Cart Item type
export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  product?: Product;
}

// Cart type
export interface Cart {
  id: number;
  session_id: string;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
}

// Order type
export interface Order {
  id: number;
  order_number: string;
  customer_email: string;
  customer_name: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  shipping_address?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

// Order Item type
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Cart with products
export interface CartWithProducts {
  id: number;
  session_id: string;
  items: (CartItem & { product: Product })[];
  created_at: string;
  updated_at: string;
}
