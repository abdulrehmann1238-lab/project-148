import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { ToothArcMark } from '../ui/Icons';

export function SiteNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Trap body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [mobileMenuOpen]);

  return (
    <header className="relative z-30 bg-bg border-b border-line">
      <div className="max-w-content mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between">
        {/* Brand Wordmark & Mark */}
        <Link
          to="/"
          className="group flex items-center gap-3 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
        >
          <div className="w-8 h-8 rounded-sm bg-ink-bg flex items-center justify-center text-brass shadow-sm">
            <ToothArcMark className="w-5 h-5 text-brass" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-[1.35rem] sm:text-[1.5rem] font-medium leading-none tracking-tight text-ink">
              Dental News Network
            </span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-ink-3 font-semibold mt-0.5">
              The Trade Publication
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-ink-2" aria-label="Main Navigation">
          <Link to="/" className="hover:text-primary transition-colors nav-link-underline py-1">
            News
          </Link>
          <a href="#tips-section" className="hover:text-primary transition-colors nav-link-underline py-1">
            Dental Tips
          </a>
          <Link to="/find-a-dentist" className="hover:text-primary transition-colors nav-link-underline py-1">
            Directory
          </Link>
          <Link
            to="/find-a-dentist?mode=distinguished"
            className="hover:text-brass-ink transition-colors nav-link-underline py-1 font-semibold text-brass-ink"
          >
            Distinguished ★
          </Link>
          <Link to="/how-it-works" className="hover:text-primary transition-colors nav-link-underline py-1">
            How It Works
          </Link>
        </nav>

        {/* Right Action: Demo ⇄ Admin Switcher & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/wp-admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[12.5px] font-semibold bg-ink-bg text-bg hover:bg-ink transition-all shadow-sh-1 hover:shadow-sh-2 focus:ring-2 focus:ring-primary"
            title="Switch to WordPress Admin simulation"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brass" />
            <span>Demo ⇄ WP-Admin</span>
          </Link>

          {/* Mobile Drawer Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-sm text-ink hover:bg-surface border border-line"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-drawer lg:hidden">
          <div
            className="fixed inset-0 bg-ink-bg/60 backdrop-blur-none transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-surface border-l border-line p-6 flex flex-col justify-between shadow-sh-3">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-line">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-sm bg-ink-bg flex items-center justify-center text-brass">
                    <ToothArcMark className="w-4 h-4 text-brass" />
                  </div>
                  <span className="font-serif text-lg font-medium text-ink">DNN Menu</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="w-9 h-9 flex items-center justify-center rounded-sm text-ink-2 hover:text-ink hover:bg-elevated"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-4">
                <Link
                  to="/"
                  className="font-serif text-[1.25rem] text-ink hover:text-primary py-1"
                >
                  News
                </Link>
                <a
                  href="#tips-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-[1.25rem] text-ink hover:text-primary py-1"
                >
                  Dental Tips
                </a>
                <Link
                  to="/find-a-dentist"
                  className="font-serif text-[1.25rem] text-ink hover:text-primary py-1"
                >
                  Directory
                </Link>
                <Link
                  to="/find-a-dentist?mode=distinguished"
                  className="font-serif text-[1.25rem] text-brass-ink font-semibold py-1 flex items-center justify-between"
                >
                  <span>Distinguished Dentists</span>
                  <span className="text-xs bg-brass-t px-2 py-0.5 rounded-xs">★</span>
                </Link>
                <Link
                  to="/how-it-works"
                  className="font-serif text-[1.25rem] text-ink hover:text-primary py-1"
                >
                  Under the Hood
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-line space-y-3">
              <Link
                to="/wp-admin"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-sm bg-ink-bg text-bg font-sans font-semibold text-sm"
              >
                <span>Open WP-Admin</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-ink-3 text-center">
                Interactive Bid Prototype · WordPress 30-Day Project
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
