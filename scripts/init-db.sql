-- Create tables
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carts (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(cart_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert categories
INSERT INTO categories (name, description) VALUES
  ('Claviers Mécaniques', 'Claviers mécaniques haut de gamme pour gaming et bureau'),
  ('Keycaps', 'Ensembles de touches pour personnaliser votre clavier'),
  ('Switches', 'Switches et stabilisateurs mécaniques'),
  ('Accessoires', 'Câbles, tapis de souris et autres accessoires');

-- Insert products for Claviers Mécaniques
INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES
  ('Keychron K8 Pro', 'Clavier mécanique wireless 87 touches, Bluetooth et USB-C', 129.99, 15, 1, 'https://images.unsplash.com/photo-1587829191301-f2e78301c888?w=500&h=500&fit=crop'),
  ('GMMK Pro', 'Clavier mécanique 75% modulaire avec écran OLED', 169.99, 8, 1, 'https://images.unsplash.com/photo-1587634191298-54a830f5d64f?w=500&h=500&fit=crop'),
  ('Ducky One 3', 'Clavier mécanique 100% avec rétroéclairage RGB', 199.99, 12, 1, 'https://images.unsplash.com/photo-1587634191298-54a830f5d64f?w=500&h=500&fit=crop'),
  ('Anne Pro 2', 'Clavier compact 60% wireless et programmable', 79.99, 20, 1, 'https://images.unsplash.com/photo-1587829191301-f2e78301c888?w=500&h=500&fit=crop'),
  ('Varmilo VA87M', 'Clavier mécanique TKL premium avec stabilisateurs Costar', 149.99, 10, 1, 'https://images.unsplash.com/photo-1587634191298-54a830f5d64f?w=500&h=500&fit=crop');

-- Insert products for Keycaps
INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES
  ('SA Profile Keycaps', 'Ensemble 170 touches profil SA en ABS, coloris classique', 49.99, 25, 2, 'https://images.unsplash.com/photo-1587634191298-54a830f5d64f?w=500&h=500&fit=crop'),
  ('Cherry Profile PBT', 'Ensemble 104 touches PBT double shot, résistant à l''usure', 59.99, 18, 2, 'https://images.unsplash.com/photo-1587829191301-f2e78301c888?w=500&h=500&fit=crop'),
  ('GMK Minimal', 'Ensemble premium en ABS chromé 140 touches', 119.99, 7, 2, 'https://images.unsplash.com/photo-1587634191298-54a830f5d64f?w=500&h=500&fit=crop'),
  ('Keycap Modifiers Set', 'Ensemble 24 touches modifieurs compatibles tous profils', 19.99, 35, 2, 'https://images.unsplash.com/photo-1587829191301-f2e78301c888?w=500&h=500&fit=crop');

-- Insert products for Switches
INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES
  ('Gateron Yellow Linear', 'Pack de 90 switches linéaires lisses 50g', 39.99, 22, 3, 'https://images.unsplash.com/photo-1587634191298-54a830f5d64f?w=500&h=500&fit=crop'),
  ('Cherry MX Blue', 'Pack de 110 switches clicky MX Blue authentiques', 89.99, 9, 3, 'https://images.unsplash.com/photo-1587829191301-f2e78301c888?w=500&h=500&fit=crop'),
  ('Stabilisateurs PCB Mount', 'Ensemble 5 stabilisateurs pour PCB (2U et 6.25U)', 24.99, 30, 3, 'https://images.unsplash.com/photo-1587634191298-54a830f5d64f?w=500&h=500&fit=crop'),
  ('Holy Panda Switches', 'Pack de 70 switches tactiles modifiés, très recherchés', 64.99, 5, 3, 'https://images.unsplash.com/photo-1587829191301-f2e78301c888?w=500&h=500&fit=crop');

-- Insert products for Accessoires
INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES
  ('Câble USB-C Mécanique', 'Câble tressé 1.5m avec connecteurs dorés pour clavier', 14.99, 40, 4, 'https://images.unsplash.com/photo-1587634191298-54a830f5d64f?w=500&h=500&fit=crop'),
  ('Tapis de Souris Grande', 'Tapis 900x400mm en tissu premium pour clavier et souris', 34.99, 16, 4, 'https://images.unsplash.com/photo-1587829191301-f2e78301c888?w=500&h=500&fit=crop'),
  ('Repose-Poignet Mécanique', 'Repose-poignet gel pour clavier mécanique ergonomique', 29.99, 12, 4, 'https://images.unsplash.com/photo-1587634191298-54a830f5d64f?w=500&h=500&fit=crop');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON carts(session_id);
