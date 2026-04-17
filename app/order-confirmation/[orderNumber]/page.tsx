'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Order } from '@/lib/types';
import { CheckCircle, Package } from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  async function fetchOrder() {
    try {
      const response = await fetch(`/api/orders/${orderNumber}`);
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setIsLoading(false);
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

  if (!order) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <Header cartItemsCount={0} />
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col items-center justify-center">
          <p className="text-slate-600 text-lg mb-4">Commande non trouvée</p>
          <Link href="/catalog" className="text-cyan-600 hover:text-cyan-700 font-semibold">
            Retour au catalogue
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Header cartItemsCount={0} />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Commande confirmée!
          </h1>
          <p className="text-lg text-slate-600">
            Merci pour votre achat. Voici les détails de votre commande.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-200">
            <div>
              <p className="text-sm text-slate-600 mb-1">Numéro de commande</p>
              <p className="text-2xl font-bold text-slate-900">{order.order_number}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Date</p>
              <p className="text-lg font-semibold text-slate-900">
                {new Date(order.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-8 pb-8 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Informations client</h2>
            <div className="space-y-2">
              <p className="text-slate-700">
                <span className="font-semibold">Nom:</span> {order.customer_name}
              </p>
              <p className="text-slate-700">
                <span className="font-semibold">Email:</span> {order.customer_email}
              </p>
              <p className="text-slate-700">
                <span className="font-semibold">Adresse de livraison:</span>{' '}
                {order.shipping_address}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8 pb-8 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Articles commandés</h2>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-900">{item.product_name}</p>
                      <p className="text-sm text-slate-600">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {(item.unit_price * item.quantity).toFixed(2)}€
                      </p>
                      <p className="text-sm text-slate-600">{item.unit_price.toFixed(2)}€ x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600">Aucun article trouvé</p>
            )}
          </div>

          {/* Total */}
          <div className="space-y-3">
            <div className="flex justify-between text-slate-700">
              <span>Sous-total</span>
              <span className="font-semibold">{(order.total_amount).toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Frais de livraison</span>
              <span className="font-semibold text-green-600">Gratuit</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>TVA (20%)</span>
              <span className="font-semibold">{(order.total_amount * 0.2).toFixed(2)}€</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="text-lg font-bold text-slate-900">Total</span>
              <span className="text-2xl font-bold text-cyan-600">
                {(order.total_amount * 1.2).toFixed(2)}€
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Package className="text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Statut de votre commande</h3>
              <p className="text-blue-800">
                Votre commande est <span className="font-semibold">{order.status}</span>. Vous
                recevrez un email de confirmation avec les détails de suivi très bientôt.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Prochaines étapes</h2>
          <ol className="space-y-3 text-slate-700">
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-cyan-600 text-white rounded-full flex-shrink-0 text-sm font-bold">
                1
              </span>
              <span>Vous recevrez un email de confirmation à {order.customer_email}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-cyan-600 text-white rounded-full flex-shrink-0 text-sm font-bold">
                2
              </span>
              <span>Votre commande sera préparée et emballée avec soin</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-cyan-600 text-white rounded-full flex-shrink-0 text-sm font-bold">
                3
              </span>
              <span>Un email de suivi vous sera envoyé dès l&apos;expédition</span>
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="flex gap-4 mt-12 justify-center">
          <Link
            href="/catalog"
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Continuer vos achats
          </Link>
          <Link
            href="/"
            className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold py-3 px-6 rounded-lg transition"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
