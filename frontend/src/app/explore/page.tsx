'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useItems } from '@/lib/api-utils';
import type { Item } from '@/types';

const categories = ['All', 'Web Development', 'Data Science', 'AI & ML', 'DevOps', 'Design', 'Business'];

export default function ExplorePage() {
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const params: Record<string, string> = {};
  if (category && category !== 'All') params.category = category;
  if (sort === 'popular') params.sort = 'rating';
  params.page = String(page);

  const { data, isLoading } = useItems(params);

  const items: Item[] = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Explore</h1>
        <div className="flex gap-3">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {categories.map((c) => (
              <option key={c} value={c === 'All' ? '' : c}>{c}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <p className="text-lg">No items found</p>
          <p className="mt-2">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Link
                key={item._id}
                href={`/items/${item._id}`}
                className="rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow bg-white group"
              >
                <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                      {item.title[0]}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                  <h3 className="mt-2 font-semibold text-text group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted line-clamp-2">{item.shortDesc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-primary">${item.price}</span>
                    <div className="flex items-center gap-1 text-sm text-accent">
                      <span>★</span>
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-border rounded-lg text-sm disabled:opacity-50 hover:bg-surface-muted transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    page === i + 1
                      ? 'bg-primary text-white'
                      : 'border border-border hover:bg-surface-muted'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
                className="px-4 py-2 border border-border rounded-lg text-sm disabled:opacity-50 hover:bg-surface-muted transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
