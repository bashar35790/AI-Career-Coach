'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useItem, useItems } from '@/lib/api-utils';
import { Package, ArrowLeft, RefreshCw } from 'lucide-react';

export default function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [imageError, setImageError] = useState(false);
  const { data: item, isLoading, error, refetch } = useItem(id);
  const { data: relatedData } = useItems(
    item ? { category: item.category, page: 1 } : undefined,
  );

  const isNotFound =
    error &&
    ((error as { response?: { status?: number } })?.response?.status === 404 ||
      (error as Error)?.message?.toLowerCase().includes('not found'));

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-zinc-800 rounded w-32 mb-8" />
        <div className="h-64 bg-zinc-800 rounded-2xl mb-8" />
        <div className="h-8 bg-zinc-800 rounded w-1/2 mb-4" />
        <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
        <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
        <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-primary" />
        </div>

        {isNotFound ? (
          <>
            <h1 className="text-4xl font-bold mb-2">Item not found</h1>
            <p className="text-text-muted mb-2">
              This item doesn&apos;t exist or has been removed.
            </p>
            <p className="text-xs text-zinc-600 mb-8">
              The ID <code className="text-primary/60">{id}</code> doesn&apos;t match any item in our database.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-2">Something went wrong</h1>
            <p className="text-text-muted mb-2">
              We couldn&apos;t load this item. Please try again.
            </p>
            <p className="text-xs text-red-400/60 mb-8">
              {(error as Error)?.message || 'An unexpected error occurred'}
            </p>
          </>
        )}

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-text font-medium rounded-xl hover:bg-zinc-800 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Items
          </Link>
          {!isNotFound && (
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  const related = relatedData?.items?.filter((r) => r._id !== item._id).slice(0, 4) ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Explore
      </Link>

      <div className="bg-zinc-900 rounded-2xl border border-border overflow-hidden">
        <div className="h-64 sm:h-80 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
          {item.image && !imageError ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl">
              {item.title[0]}
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              {item.category}
            </span>
            <div className="flex items-center gap-1 text-accent">
              <span>★</span>
              <span className="font-medium text-text">{item.rating.toFixed(1)}</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
          <p className="text-text-muted mb-6">{item.shortDesc}</p>

          <div className="flex items-center justify-between mb-6 p-4 bg-surface-muted rounded-xl">
            <div>
              <p className="text-sm text-text-muted">Price</p>
              <p className="text-2xl font-bold text-primary">${item.price}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-muted">Created by</p>
              <p className="font-medium">{item.createdBy?.name || 'Unknown'}</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-text-muted leading-relaxed whitespace-pre-line">{item.fullDesc}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => (
              <Link
                key={r._id}
                href={`/items/${r._id}`}
                className="rounded-xl border border-border p-4 hover:shadow-md transition-shadow bg-zinc-900"
              >
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {r.category}
                </span>
                <h3 className="mt-2 font-semibold text-sm">{r.title}</h3>
                <p className="mt-1 text-xs text-text-muted line-clamp-2">{r.shortDesc}</p>
                <div className="mt-2 font-bold text-primary text-sm">${r.price}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
