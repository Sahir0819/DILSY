import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Heart, User } from 'lucide-react';
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
  };

  const isLinkActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFAF8]/95 backdrop-blur-md border-b border-[#F1C5D1] transition-colors shadow-2xs">
      {/* Announcement Bar with Dark Burgundy Palette */}
      {announcement?.enabled !== false && (
        <div className="bg-[#72172F] text-[#FFFAF8] text-xs py-2 px-4 text-center tracking-wider font-light flex items-center justify-center gap-2 border-b border-[#9F2343] shadow-inner">
          <Heart className="w-3.5 h-3.5 text-[#E88AA4] fill-[#E88AA4] animate-heart-pulse" />
          <span className="font-medium text-[#FFFAF8]">
            {announcement?.text || 'Thoughtful surprises, made personal with love.'}
          </span>
          <span className="hidden sm:inline text-[#E88AA4]">
            {announcement?.secondaryText || '· Delivering across Chandigarh University & Mohali'}
          </span>
          <Heart className="w-3.5 h-3.5 text-[#E88AA4] fill-[#E88AA4] animate-heart-pulse hidden sm:inline" />
        </div>
      )}

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Brand Wordmark */}
        <button
          onClick={() => handleLinkClick('/')}
          className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#3B2028] hover:text-[#9F2343] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2343] group cursor-pointer"
        >
          <span>DILSY</span>
          <span className="w-2 h-2 rounded-full bg-[#9F2343] inline-block mb-1 shadow-xs group-hover:scale-125 transition-transform" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#795A63]">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`hover:text-[#9F2343] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                  active
                    ? 'border-[#9F2343] text-[#9F2343] font-semibold'
                    : 'border-transparent text-[#795A63] hover:border-[#E88AA4]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Actions: Account button, Bag button & Mobile menu toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Customer Account Button */}
          <button
            onClick={() => handleLinkClick(accountPath)}
            aria-label={customer ? 'View customer account' : 'Sign in or register'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2343] shadow-2xs cursor-pointer border ${
              currentPath === '/account' || currentPath === '/login'
                ? 'bg-[#9F2343] text-white border-[#9F2343]'
                : 'bg-[#FFF1F4] hover:bg-[#FCE7ED] border-[#F1C5D1] text-[#3B2028]'
            }`}
          >
            <User
              className={`w-4 h-4 ${
                currentPath === '/account' || currentPath === '/login' ? 'text-white' : 'text-[#9F2343]'
              }`}
            />
            <span className="text-xs font-semibold tracking-wide hidden sm:inline">
              {customer ? customer.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* Bag Button */}
          <button
            onClick={() => handleLinkClick('/cart')}
            aria-label="View shopping bag"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2343] shadow-2xs cursor-pointer border ${
              currentPath === '/cart'
                ? 'bg-[#9F2343] text-white border-[#9F2343]'
                : 'bg-[#FFF1F4] hover:bg-[#FCE7ED] border-[#F1C5D1] text-[#3B2028]'
            }`}
          >
            <ShoppingBag className={`w-4 h-4 ${currentPath === '/cart' ? 'text-white' : 'text-[#9F2343]'}`} />
            <span className="text-xs font-semibold tracking-wide uppercase hidden sm:inline">
              Bag
            </span>
            <span
              className={`w-5 h-5 rounded-full text-xs font-semibold flex items-center justify-center tabular-nums shadow-xs ${
                currentPath === '/cart'
                  ? 'bg-white text-[#9F2343]'
                  : 'bg-[#9F2343] text-white'
              }`}
            >
              {cartCount}
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-[#3B2028] hover:bg-[#FCE7ED] rounded-xl border border-[#F1C5D1] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFAF8] border-b border-[#F1C5D1] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`block w-full text-left px-3 py-2.5 rounded-xl text-base transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#FFF1F4] font-semibold text-[#9F2343] border border-[#F1C5D1]'
                    : 'text-[#795A63] hover:bg-[#FFF1F4] hover:text-[#9F2343]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#F1C5D1] space-y-2">
            <button
              onClick={() => handleLinkClick(accountPath)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#FFF1F4] text-[#3B2028] font-semibold border border-[#F1C5D1] cursor-pointer text-sm"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#9F2343]" />
                <span>{customer ? `My Account (${customer.name.split(' ')[0]})` : 'Sign In / Register'}</span>
              </div>
            </button>
            <button
              onClick={() => handleLinkClick('/cart')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#FFF1F4] text-[#9F2343] font-semibold border border-[#F1C5D1] cursor-pointer text-sm"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>View Shopping Bag</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-[#9F2343] text-white text-xs flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
