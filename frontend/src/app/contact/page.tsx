'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-text-muted mb-8">Have a question or feedback? We&apos;d love to hear from you.</p>

      {sent ? (
        <div className="p-6 bg-emerald-950/50 border border-emerald-900 rounded-2xl text-center">
          <p className="text-emerald-400 font-medium">Message sent! We&apos;ll get back to you soon.</p>
          <button onClick={() => { setSent(false); setName(''); setEmail(''); setMessage(''); }} className="mt-4 text-sm text-primary hover:underline">
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900 rounded-2xl border border-border p-6">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y" />
          </div>
          <button type="submit" className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
