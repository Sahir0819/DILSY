import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { getCustomerSession } from '../utils/api';

interface NavbarProps {
  cartCount: number;
  currentPath: string;
  onNavigate: (path: string) => void;
  announcement?: {
    enabled: boolean;
    text: string;
    secondaryText: string;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  currentPath,
  onNavigate,
  announcement,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const customer = getCustomerSession();
  const accountPath = customer ? '/account' : '/login';

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/themes', label: 'Shop by Theme' },
    { path: '/hampers', label: 'All Hampers' },
    { path: '/custom-hamper', label: 'Custom Hamper' },
    { path: '/our-story', label: 'Our Story' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  const isLinkActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/hampers?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F5]/95 backdrop-blur-md border-b border-[#EADBDB] transition-colors">
      {/* Editorial Announcement Bar */}
      {announcement?.enabled !== false && (
        <div className="bg-[#F5ECE7] text-[#4A1423] text-[10px] sm:text-[11px] py-2 px-4 text-center tracking-[0.18em] font-sans uppercase font-medium border-b border-[#EADBDB]">
          <span>
            {announcement?.text ||
              'COMPLIMENTARY ATELIER HANDWRITTEN WAX-SEALED CALLIGRAPHY WITH EVERY HAMPER'}
          </span>
          {announcement?.secondaryText && (
            <span className="hidden md:inline ml-2 text-[#7A5A63]">
              · {announcement.secondaryText}
            </span>
          )}
        </div>
      )}

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-6">
        {/* Brand Wordmark (Editorial Serif with Wide Tracking) */}
        <button
          onClick={() => handleLinkClick('/')}
          className="text-2xl sm:text-[26px] font-serif font-normal tracking-[0.25em] text-[#2A0D15] hover:opacity-85 transition-opacity whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2A0D15] cursor-pointer"
        >
          <span>DILSY</span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-sans tracking-[0.08em] text-[#4A2D35]">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`hover:text-[#2A0D15] transition-all whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                  active
                    ? 'border-b border-[#2A0D15] text-[#2A0D15] font-medium'
                    : 'border-b border-transparent text-[#6E565D] hover:border-[#6E565D]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Actions: Search, Sign In, Bag & Mobile menu toggle */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0 text-xs font-sans tracking-[0.08em]">
          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search hampers"
            className="text-[#4A2D35] hover:text-[#2A0D15] transition-colors p-1 cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Customer Account Button */}
          <button
            onClick={() => handleLinkClick(accountPath)}
            aria-label={customer ? 'View customer account' : 'Sign in or register'}
            className="hidden sm:inline-flex items-center gap-1.5 text-[#4A2D35] hover:text-[#2A0D15] transition-colors cursor-pointer"
          >
            <span>{customer ? customer.name.split(' ')[0] : 'Sign In'}</span>
          </button>

          {/* Bag Button */}
          <button
            onClick={() => handleLinkClick('/cart')}
            aria-label="View shopping bag"
            className="flex items-center gap-1.5 text-[#4A2D35] hover:text-[#2A0D15] transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#2A0D15]" />
            <span className="font-medium">BAG ({cartCount})</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-1.5 text-[#2A0D15] border border-[#EADBDB] hover:bg-[#F5ECE7] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Search Input Bar (Dropdown) */}
      {searchOpen && (
        <div className="bg-[#FAF7F5] border-t border-b border-[#EADBDB] px-4 py-3 animate-in fade-in slide-in-from-top-1">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center gap-3"
          >
            <Search className="w-4 h-4 text-[#7A5A63]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by occasion, box size (Small, Loved Box, Large)..."
              autoFocus
              className="w-full bg-transparent text-sm text-[#2A0D15] placeholder-[#7A5A63] focus:outline-none font-sans"
            />
            <button
              type="submit"
              className="text-[11px] uppercase tracking-[0.18em] font-sans font-semibold text-[#4A1423] hover:underline whitespace-nowrap cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-xs text-[#7A5A63] hover:text-[#2A0D15] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F5] border-b border-[#EADBDB] px-6 py-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 font-sans">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`block w-full text-left py-2 text-sm tracking-[0.08em] transition-colors cursor-pointer ${
                  active
                    ? 'font-medium text-[#2A0D15] border-b border-[#2A0D15]'
                    : 'text-[#6E565D] hover:text-[#2A0D15]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="pt-4 border-t border-[#EADBDB] space-y-3">
            <button
              onClick={() => handleLinkClick(accountPath)}
              className="w-full flex items-center justify-between py-2 text-sm text-[#2A0D15] font-medium tracking-[0.08em] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#4A1423]" />
                <span>{customer ? `Account (${customer.name.split(' ')[0]})` : 'Sign In / Register'}</span>
              </div>
            </button>
            <button
              onClick={() => handleLinkClick('/cart')}
              className="w-full flex items-center justify-between py-2 text-sm text-[#4A1423] font-medium tracking-[0.08em] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Shopping Bag</span>
              </div>
              <span className="text-xs font-semibold">({cartCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
