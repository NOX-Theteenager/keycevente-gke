'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartItem } from '@/components/cart-item';
import { CartWithProducts, Product, CartItem as CartItemType } from '@/lib/types';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState<CartWithProducts | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateQuantity(cartItemId: number, quantity: number) {
    try {
      const response = await fetch('/api/cart/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }

  async function handleRemoveItem(cartItemId: number) {
    try {
      const response = await fetch('/api/cart/items', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId }),
      });
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  const totalPrice =
    cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <Header cartItemsCount={cart?.items.length || 0} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-600">Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Header cartItemsCount={cart?.items.length || 0} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-6 font-medium"
        >
          <ArrowLeft size={18} />
          Continuer vos achats
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-8">Votre Panier</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingCart size={48} className="mx-auto text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Votre panier est vide</h2>
            <p className="text-slate-600 mb-6">
              Découvrez nos produits et commencez vos achats
            </p>
            <Link
              href="/catalog"
              className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Explorer le catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Résumé de la commande</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between text-slate-700">
                  <span>Sous-total ({cart.items.length} articles)</span>
                  <span className="font-semibold">{totalPrice.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Frais de livraison</span>
                  <span className="font-semibold text-green-600">Gratuit</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>TVA (20%)</span>
                  <span className="font-semibold">{(totalPrice * 0.2).toFixed(2)}€</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-slate-900">Total</span>
                <span className="text-3xl font-bold text-cyan-600">
                  {(totalPrice * 1.2).toFixed(2)}€
                </span>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition text-center"
              >
                Procéder au paiement
              </Link>

              <p className="text-xs text-slate-600 text-center mt-4">
                Livraison gratuite à partir de 50€
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
