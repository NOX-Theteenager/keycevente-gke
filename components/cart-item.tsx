'use client';

import Image from 'next/image';
import { CartItem as CartItemType, Product } from '@/lib/types';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

interface CartItemProps {
  item: CartItemType & { product: Product };
  onUpdateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  onRemove: (cartItemId: number) => Promise<void>;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsLoading(true);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await onRemove(item.id);
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = item.product.price * item.quantity;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex gap-4 items-start">
      {/* Product Image */}
      {item.product.image_url ? (
        <div className="relative w-24 h-24 flex-shrink-0 bg-slate-100 rounded">
          <Image
            src={item.product.image_url}
            alt={item.product.name}
            fill
            className="object-cover rounded"
          />
        </div>
      ) : (
        <div className="w-24 h-24 flex-shrink-0 bg-slate-100 rounded flex items-center justify-center text-slate-400">
          Pas d&apos;image
        </div>
      )}

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="font-bold text-lg text-slate-900 mb-1">
          {item.product.name}
        </h3>
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
          {item.product.description}
        </p>
        <p className="text-sm font-semibold text-cyan-600">
          {item.product.price.toFixed(2)}€ par unité
        </p>
      </div>

      {/* Quantity and Total */}
      <div className="flex flex-col items-end gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isLoading || item.quantity === 1}
            className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-50"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isLoading || item.quantity >= item.product.stock_quantity}
            className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-50"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <p className="text-xs text-slate-600 mb-1">Sous-total</p>
          <p className="text-2xl font-bold text-cyan-600">
            {subtotal.toFixed(2)}€
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isLoading}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition disabled:opacity-50"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
