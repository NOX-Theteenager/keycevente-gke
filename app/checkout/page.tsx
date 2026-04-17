'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartWithProducts } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartWithProducts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      if (data.success) {
        if (!data.data.items || data.data.items.length === 0) {
          router.push('/cart');
          return;
        }
        setCart(data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function validateForm() {
    const newErrors: { [key: string]: string } = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Le nom est requis';
    }
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Email invalide';
    }
    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = 'L\'adresse est requise';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Le code postal est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm() || !cart) {
      return;
    }

    setIsSubmitting(true);
    try {
      const items = cart.items.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
      }));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          shippingAddress: `${formData.shippingAddress}, ${formData.city} ${formData.postalCode}`,
          items,
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/order-confirmation/${data.data.order_number}`);
      } else {
        alert('Erreur lors de la création de la commande');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Erreur lors de la création de la commande');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <Header cartItemsCount={0} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-600">Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <Header cartItemsCount={0} />
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col items-center justify-center">
          <p className="text-slate-600 text-lg mb-4">Panier vide</p>
          <Link href="/catalog" className="text-cyan-600 hover:text-cyan-700 font-semibold">
            Retour au catalogue
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalWithTax = totalPrice * 1.2;

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Header cartItemsCount={cart.items.length} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-6 font-medium"
        >
          <ArrowLeft size={18} />
          Retour au panier
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-8">Finaliser votre commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Informations de livraison
              </h2>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      errors.customerName ? 'border-red-600' : 'border-slate-300'
                    }`}
                    placeholder="Jean Dupont"
                  />
                  {errors.customerName && (
                    <p className="text-red-600 text-sm mt-1">{errors.customerName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, customerEmail: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      errors.customerEmail ? 'border-red-600' : 'border-slate-300'
                    }`}
                    placeholder="jean@example.com"
                  />
                  {errors.customerEmail && (
                    <p className="text-red-600 text-sm mt-1">{errors.customerEmail}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, shippingAddress: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      errors.shippingAddress ? 'border-red-600' : 'border-slate-300'
                    }`}
                    placeholder="123 Rue de la Paix"
                  />
                  {errors.shippingAddress && (
                    <p className="text-red-600 text-sm mt-1">{errors.shippingAddress}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      errors.city ? 'border-red-600' : 'border-slate-300'
                    }`}
                    placeholder="Paris"
                  />
                  {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      errors.postalCode ? 'border-red-600' : 'border-slate-300'
                    }`}
                    placeholder="75001"
                  />
                  {errors.postalCode && (
                    <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
              >
                {isSubmitting ? 'Traitement...' : 'Confirmer la commande'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Résumé</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-slate-200 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-700">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-semibold">
                      {(item.product.price * item.quantity).toFixed(2)}€
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between text-slate-700">
                  <span>Sous-total</span>
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

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-3xl font-bold text-cyan-600">
                  {totalWithTax.toFixed(2)}€
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
