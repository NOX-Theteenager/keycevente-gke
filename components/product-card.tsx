'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number, quantity: number) => Promise<void>;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(product.id, quantity);
      setQuantity(1);
    } finally {
      setIsLoading(false);
    }
  };

  const hasStock = product.stock_quantity > 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden h-full flex flex-col">
      {/* Image Container */}
      <Link href={`/product/${product.id}`} className="relative w-full h-48 bg-slate-100 overflow-hidden group">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            Pas d&apos;image
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-lg text-slate-900 hover:text-cyan-600 transition line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        {/* Price and Stock */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-cyan-600 mb-1">
            {product.price.toFixed(2)}€
          </p>
          <p className={`text-sm font-medium ${hasStock ? 'text-green-600' : 'text-red-600'}`}>
            {hasStock ? `${product.stock_quantity} en stock` : 'Rupture de stock'}
          </p>
        </div>

        {/* Add to Cart */}
        {hasStock && (
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={product.stock_quantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 px-2 py-2 border border-slate-300 rounded text-center text-sm"
            />
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              {isLoading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
