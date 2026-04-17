'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Product } from '@/lib/types';
import { ShoppingCart, ArrowLeft, Star } from 'lucide-react';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchCartCount();
  }, [id]);

  async function fetchProduct() {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
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

  async function handleAddToCart() {
    setIsAdding(true);
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: parseInt(id), quantity }),
      });
      if (response.ok) {
        setQuantity(1);
        fetchCartCount();
        alert('Produit ajouté au panier!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <Header cartItemsCount={cartCount} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-600">Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <Header cartItemsCount={cartCount} />
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col items-center justify-center">
          <p className="text-slate-600 text-lg mb-4">Produit non trouvé</p>
          <Link href="/catalog" className="text-cyan-600 hover:text-cyan-700 font-semibold">
            Retour au catalogue
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const hasStock = product.stock_quantity > 0;

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Header cartItemsCount={cartCount} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Breadcrumb */}
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-6 font-medium"
        >
          <ArrowLeft size={18} />
          Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {product.image_url ? (
              <div className="relative w-full aspect-square bg-slate-100">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-square bg-slate-100 flex items-center justify-center text-slate-400">
                Pas d&apos;image
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600">(42 avis)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-5xl font-bold text-cyan-600 mb-2">
                  {product.price.toFixed(2)}€
                </p>
                <p className={`text-lg font-semibold ${hasStock ? 'text-green-600' : 'text-red-600'}`}>
                  {hasStock ? `${product.stock_quantity} en stock` : 'Rupture de stock'}
                </p>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Description</h2>
                <p className="text-slate-700 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Features (Example) */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Caractéristiques</h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                    Qualité premium garantie
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                    Livraison gratuite à partir de 50€
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                    Garantie 2 ans
                  </li>
                </ul>
              </div>
            </div>

            {/* Add to Cart Section */}
            {hasStock && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Quantité
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max={product.stock_quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 px-3 py-2 border border-slate-300 rounded text-center font-semibold"
                    />
                    <span className="text-slate-600">
                      {product.stock_quantity} disponible(s)
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingCart size={20} />
                  {isAdding ? 'Ajout...' : 'Ajouter au panier'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
