'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/store/auth-context';

const loggedOutLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/about', label: 'About' },
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Register' },
];

const loggedInLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/explore', label: 'Explore' },
  { href: '/profile', label: 'Profile' },
  { href: '/items/add', label: 'Add Item' },
  { href: '/items/manage', label: 'Manage Items' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = user ? loggedInLinks : loggedOutLinks;

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-black/80 backdrop-blur-lg border-b border-border shadow-sm'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent"
          >
            AI Career Coach
          </Link>

          <button
            className="sm:hidden p-2 rounded-md text-text-muted hover:text-text hover:bg-surface-muted"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="hidden sm:flex items-center gap-6">
            {links.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${isActive
                    ? 'text-primary font-semibold'
                    : 'text-text-muted hover:text-primary'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {user ? (
              <button
                onClick={logout}
                className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/register"
                className="text-sm font-semibold px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden pb-4 space-y-2">
            {links.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                    ? 'text-primary font-semibold bg-primary/5'
                    : 'text-text-muted hover:text-primary hover:bg-surface-muted'
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            {user ? (
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-red-500 hover:bg-surface-muted rounded-md transition-colors cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/register"
                className="block px-3 py-2 text-sm font-semibold text-primary hover:bg-surface-muted rounded-md transition-colors cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
