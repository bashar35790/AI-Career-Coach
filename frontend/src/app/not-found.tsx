import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-5xl font-bold mb-2">404</h1>
        <p className="text-xl font-semibold mb-2">Page not found</p>
        <p className="text-text-muted text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
