'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useItem, useItems } from '@/lib/api-utils';

export default function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: item, isLoading, error } = useItem(id);
  const { data: relatedData } = useItems(
    item ? { category: item.category, page: 1 } : undefined
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-2xl mb-8" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Item not found</h2>
        <p className="text-text-muted mb-6">The item you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/explore" className="text-primary hover:underline font-medium">
          Back to Explore
        </Link>
      </div>
    );
  }

  const related = relatedData?.items?.filter((r) => r._id !== item._id).slice(0, 4) ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/explore" className="text-sm text-text-muted hover:text-primary transition-colors mb-6 inline-block">
        &larr; Back to Explore
      </Link>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="h-64 sm:h-80 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
          {item.image ? (
            <Image src={item.image} alt={item.title} fill className="object-cover" />
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
                className="rounded-xl border border-border p-4 hover:shadow-md transition-shadow bg-white"
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
