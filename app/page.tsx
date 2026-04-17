'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { Product } from '@/lib/types';
import { Keyboard, Lightbulb, Zap } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCartCount();
  }, []);

  async function fetchFeaturedProducts() {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setFeaturedProducts(data.data.slice(0, 6));
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

  return (
    <div className="bg-slate-50">
      <Header cartItemsCount={cartCount} />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Les Meilleures Claviers Mécaniques
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-8">
            Découvrez notre sélection premium de claviers, keycaps et accessoires
          </p>
          <Link
            href="/catalog"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
          >
            Découvrir le catalogue
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <Keyboard className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Qualité Premium</h3>
            <p className="text-slate-600">
              Produits sélectionnés avec soin pour garantir une excellente qualité
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <Zap className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Livraison Rapide</h3>
            <p className="text-slate-600">
              Expédition rapide et sécurisée de vos commandes
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <Lightbulb className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Expert en Clavier</h3>
            <p className="text-slate-600">
              Conseils d&apos;experts pour trouver votre clavier idéal
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Produits en Vedette</h2>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-600">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
