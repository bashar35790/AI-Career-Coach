'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/store/auth-context';
import { Sparkles, FileText, FilePen, Briefcase, MessageSquare, Map, ChevronDown } from 'lucide-react';

const loggedOutLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/about', label: 'About' },
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Register' },
];

const aiToolLinks = [
  { href: '/ai/resume', icon: FileText, label: 'Resume Improver' },
  { href: '/ai/cover-letter', icon: FilePen, label: 'Cover Letter' },
  { href: '/ai/interview', icon: Briefcase, label: 'Interview Prep' },
  { href: '/ai/chat', icon: MessageSquare, label: 'AI Chat' },
  { href: '/ai/roadmap', icon: Map, label: 'Roadmap' },
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
  const [aiToolsOpen, setAiToolsOpen] = useState(false);
  const [mobileAiOpen, setMobileAiOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAiToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAiToolsActive = aiToolLinks.some((t) =>
    t.href === '/' ? pathname === '/' : pathname.startsWith(t.href),
  );

  const links = user ? loggedInLinks : loggedOutLinks;

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-black/80 backdrop-blur-lg shadow-sm'
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

          {/* ─── Desktop nav ─── */}
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

            {/* AI Tools dropdown (desktop) */}
            {user && (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setAiToolsOpen(!aiToolsOpen)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
                    isAiToolsActive
                      ? 'text-primary font-semibold'
                      : 'text-text-muted hover:text-primary'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  AI Tools
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${aiToolsOpen ? 'rotate-180' : ''}`} />
                </button>

                {aiToolsOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-zinc-900 shadow-2xl shadow-black/50 overflow-hidden py-2 z-50">
                    {aiToolLinks.map((tool) => {
                      const isToolActive = pathname.startsWith(tool.href);
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setAiToolsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            isToolActive
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'text-text-muted hover:bg-zinc-800 hover:text-text'
                          }`}
                        >
                          <tool.icon className="w-4 h-4" />
                          {tool.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {user ? (
              <button
                onClick={logout}
                className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors cursor-pointer"
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

        {/* ─── Mobile nav ─── */}
        {menuOpen && (
          <div className="sm:hidden space-y-1 bg-zinc-900/95 backdrop-blur-lg rounded-2xl border border-border p-3 mt-2">
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

            {/* AI Tools accordion (mobile) */}
            {user && (
              <div>
                <button
                  onClick={() => setMobileAiOpen(!mobileAiOpen)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                    isAiToolsActive
                      ? 'text-primary font-semibold bg-primary/5'
                      : 'text-text-muted hover:text-primary hover:bg-surface-muted'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Tools
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAiOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileAiOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-border pl-2">
                    {aiToolLinks.map((tool) => {
                      const isToolActive = pathname.startsWith(tool.href);
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => { setMenuOpen(false); setMobileAiOpen(false); }}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                            isToolActive
                              ? 'text-primary font-semibold bg-primary/5'
                              : 'text-text-muted hover:text-primary hover:bg-surface-muted'
                          }`}
                        >
                          <tool.icon className="w-4 h-4" />
                          {tool.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

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
