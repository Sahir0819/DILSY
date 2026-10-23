import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Heart, Lock } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onNavigateToAdmin?: () => void;
  announcement?: {
    enabled: boolean;
    text: string;
    secondaryText: string;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  activeSection,
  onNavigate,
  onNavigateToAdmin,
  announcement,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'shop-by-theme', label: 'Shop by Theme' },
    { id: 'shop', label: 'Launch Hampers' },
    { id: 'custom-builder', label: 'Custom Hampers' },
    { id: 'our-story', label: 'Our Story' },
    { id: 'delivery-policy', label: 'Delivery Policy' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDF9F7]/95 backdrop-blur-md border-b border-[#E8D0D6] transition-colors shadow-2xs">
      {/* Announcement Bar with Romantic Love Colors */}
      {announcement?.enabled !== false && (
        <div className="bg-gradient-to-r from-[#3D141C] via-[#631B29] to-[#3D141C] text-[#FFF0F3] text-xs py-2 px-4 text-center tracking-wider font-light flex items-center justify-center gap-2 border-b border-[#802235]/40 shadow-inner">
          <Heart className="w-3.5 h-3.5 text-[#FF85A1] fill-[#FF85A1] animate-heart-pulse" />
          <span className="font-medium text-[#FFE5EC]">
            {announcement?.text || 'Thoughtful surprises, made personal with love.'}
          </span>
          <span className="hidden sm:inline text-[#FFB3C6]">
            {announcement?.secondaryText || '· Delivering across Chandigarh University & Mohali'}
          </span>
          <Heart className="w-3.5 h-3.5 text-[#FF85A1] fill-[#FF85A1] animate-heart-pulse hidden sm:inline" />
        </div>
      )}

      {/* Main Top Bar - 3 Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark with Love Accent */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#2D1B22] hover:text-[#B33951] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B33951] group"
        >
          <span>DILSY</span>
          <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#B33951] to-[#E56B85] inline-block mb-1 shadow-xs group-hover:scale-125 transition-transform" />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4D2D37]">
          {navLinks.slice(0, 6).map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`hover:text-[#B33951] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeSection === link.id
                  ? 'border-[#B33951] text-[#7A1E31] font-semibold'
                  : 'border-transparent text-[#5C3843]/85 hover:border-[#E89CAE]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions (Admin Portal link + Bag button) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onNavigateToAdmin && (
            <button
              onClick={onNavigateToAdmin}
              aria-label="Admin Studio Portal"
              title="Admin Studio Login (/admin)"
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium text-[#7A1E31] bg-[#FFF0F3] hover:bg-[#FFE0E6] border border-[#F2BDC8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B33951] shadow-2xs"
            >
              <Lock className="w-3.5 h-3.5 text-[#99223A]" />
              <span className="hidden sm:inline">Admin Studio</span>
            </button>
          )}

          <button
            onClick={onOpenCart}
            aria-label="View shopping bag"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#FAF0F3] hover:bg-[#F5E1E7] border border-[#E8C2CC] text-[#3D141C] transition-colors whitespace-nowrap shrink-0 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B33951] shadow-2xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#8C243B]" />
            <span className="text-xs font-semibold tracking-wide uppercase hidden sm:inline text-[#6B1B2C]">Bag</span>
            <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#99223A] to-[#C73858] text-[#FFF0F3] text-xs font-semibold flex items-center justify-center tabular-nums shadow-xs">
              {cartCount}
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 text-[#2A1E1A] hover:bg-[#F5EFEB] rounded-lg border border-[#2A1E1A]/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#2A1E1A]/15 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-base ${
                activeSection === link.id
                  ? 'bg-[#EAE0D6] font-semibold text-[#2A1E1A]'
                  : 'text-[#4A352F] hover:bg-[#F5EFEB]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#2A1E1A]/10 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenCart();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 bg-[#2A1E1A] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Review Bag ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
            </button>
            {onNavigateToAdmin && (
              <button
                onClick={() => {
                  onNavigateToAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 bg-[#FFF0F3] text-[#7A1E31] border border-[#F2BDC8] hover:bg-[#FFE0E6] rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Lock className="w-4 h-4 text-[#99223A]" />
                <span>Open Admin Studio (/admin)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
