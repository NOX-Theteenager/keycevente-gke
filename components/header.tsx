'use client';

import Link from 'next/link';
import { ShoppingCart, Search } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  cartItemsCount: number;
}

export function Header({ cartItemsCount }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              keycevente
            </h1>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link href="/catalog" className="hover:text-cyan-400 transition font-medium">
              Catalogue
            </Link>
            <Link href="/cart" className="flex items-center gap-2 hover:text-cyan-400 transition">
              <ShoppingCart size={24} />
              <span className="font-semibold">{cartItemsCount}</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
