'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import AuthGuard from '@/components/AuthGuard';
import { useCreateItem } from '@/lib/api-utils';

const categories = ['Web Development', 'Data Science', 'AI & ML', 'DevOps', 'Design', 'Business'];

const itemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  shortDesc: z.string().min(10, 'Short description must be at least 10 characters'),
  fullDesc: z.string().min(20, 'Full description must be at least 20 characters'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  category: z.string().min(1, 'Please select a category'),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export default function AddItemPage() {
  const router = useRouter();
  const createItem = useCreateItem();
  const [form, setForm] = useState({ title: '', shortDesc: '', fullDesc: '', price: '', category: '', image: '' });
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const parsed = itemSchema.safeParse({
      ...form,
      price: form.price ? parseFloat(form.price) : 0,
      image: form.image || undefined,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    try {
      await createItem.mutateAsync(parsed.data as { title: string; shortDesc: string; fullDesc: string; price: number; category: string; image?: string });
      router.push('/items/manage');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to create item';
      setError(msg);
    }
  }

  return (
    <AuthGuard>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Add New Item</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl border border-border p-6">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Item title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Short Description</label>
            <input name="shortDesc" value={form.shortDesc} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Brief overview" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Full Description</label>
            <textarea name="fullDesc" value={form.fullDesc} onChange={handleChange} rows={5} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y" placeholder="Detailed description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Price ($)</label>
              <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">Select...</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Image URL (optional)</label>
            <input name="image" value={form.image} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="https://example.com/image.jpg" />
          </div>
          <button type="submit" disabled={createItem.isPending}
            className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {createItem.isPending ? 'Creating...' : 'Create Item'}
          </button>
        </form>
      </div>
    </AuthGuard>
  );
}
