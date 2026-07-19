'use client';

import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { useItems, useDeleteItem } from '@/lib/api-utils';
import type { Item } from '@/types';

export default function ManageItemsPage() {
  const { data, isLoading } = useItems();
  const deleteItem = useDeleteItem();
  const items: Item[] = data?.items ?? [];

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteItem.mutateAsync(id);
    } catch {
      alert('Failed to delete item');
    }
  }

  return (
    <AuthGuard>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Manage Items</h1>
          <Link
            href="/items/add"
            className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors text-sm"
          >
            + Add New
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-zinc-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <p className="text-lg">No items yet</p>
            <p className="mt-2">Create your first item to get started.</p>
            <Link href="/items/add" className="mt-4 inline-block text-primary hover:underline font-medium">
              Add Item
            </Link>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-2xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-muted text-left text-sm font-medium text-text-muted">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Price</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b border-border last:border-0 hover:bg-surface-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-text-muted line-clamp-1 sm:hidden">{item.category} &middot; ${item.price}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">{item.category}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell font-medium">${item.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/items/${item._id}`}
                          className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-surface-muted transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deleteItem.isPending}
                          className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-900 rounded-lg hover:bg-red-950/50 transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
