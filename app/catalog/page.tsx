'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { CategoryFilter } from '@/components/category-filter';
import { Product, Category } from '@/lib/types';

function CatalogContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchCartCount();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  async function fetchCategories() {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const categoryId = searchParams.get('categoryId');
      const search = searchParams.get('search');
      let url = '/api/products';
      const params = new URLSearchParams();

      if (categoryId) {
        params.append('categoryId', categoryId);
      }
      if (search) {
        params.append('search', search);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCartCount() {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      if (data.success && data.data.items) {
        setCartCount(data.data.items.length);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }

  async function handleAddToCart(productId: number, quantity: number) {
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      if (response.ok) {
        fetchCartCount();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  const searchTerm = searchParams.get('search');

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Header cartItemsCount={cartCount} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Catalogue</h1>
        {searchTerm && (
          <p className="text-slate-600 mb-6">
            Résultats pour : <span className="font-semibold">{searchTerm}</span>
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <CategoryFilter categories={categories} />
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-slate-600">Chargement...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-slate-600 text-lg">
                  Aucun produit trouvé pour cette recherche.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Chargement...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
