'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useItems } from '@/lib/api-utils';
import type { Item } from '@/types';

const categories = ['All', 'Web Development', 'Data Science', 'AI & ML', 'DevOps', 'Design', 'Business'];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [erroredImages, setErroredImages] = useState<Set<string>>(new Set());
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleImageError = useCallback((src: string) => {
    setErroredImages(prev => new Set(prev).add(src));
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  const queryCategory = category && category !== 'All' ? category : undefined;
  const querySort = sort === 'popular' ? 'rating' : undefined;
  const querySearch = debouncedSearch.trim() || undefined;

  const { data, isLoading, error } = useItems({ search: querySearch, category: queryCategory, sort: querySort, page, limit: 8 });

  const items: Item[] = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Explore</h1>
          <div className="flex gap-3">
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {categories.map((c) => (
                <option key={c} value={c === 'All' ? '' : c}>{c}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-zinc-600 transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border overflow-hidden animate-pulse">
              <div className="h-48 bg-zinc-800" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-full" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 max-w-md mx-auto">
          <p className="text-lg text-red-500 mb-2">Failed to load items</p>
          <p className="text-text-muted text-sm mb-4">{(error as Error)?.message}</p>
          <p className="text-xs text-text-muted">Make sure the backend is running.</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <p className="text-lg">No items found</p>
          <p className="mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Link
                key={item._id}
                href={`/items/${item._id}`}
                className="rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow bg-zinc-900 group"
              >
                <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                  {item.image && !erroredImages.has(item.image) ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover"
                      unoptimized
                      onError={() => handleImageError(item.image!)}
                    />
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
            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-border rounded-2xl p-1.5 shadow-lg shadow-black/20">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-text hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.pages }).map((_, i) => {
                    const n = i + 1;
                    const isActive = page === n;
                    return (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`relative min-w-[36px] h-9 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-md shadow-primary/25 scale-105'
                            : 'text-text-muted hover:text-text hover:bg-zinc-800'
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                  disabled={page === pagination.pages}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-text hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-text-muted/60">
                Page {page} of {pagination.pages} &middot; {pagination.total} items total
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
