'use client';

import { Category } from '@/lib/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('categoryId');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Catégories</h2>
      <ul className="space-y-2">
        <li>
          <Link
            href="/catalog"
            className={`block px-3 py-2 rounded transition ${
              !selectedId
                ? 'bg-cyan-600 text-white font-semibold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Tous les produits
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/catalog?categoryId=${category.id}`}
              className={`block px-3 py-2 rounded transition ${
                selectedId === category.id.toString()
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
