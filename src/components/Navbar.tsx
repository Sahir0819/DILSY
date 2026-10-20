import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Heart } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'shop', label: 'Shop All' },
    { id: 'for-him', label: 'For Him' },
    { id: 'for-her', label: 'For Her' },
    { id: 'custom-builder', label: 'Custom Hampers' },
    { id: 'our-story', label: 'Our Story' },
    { id: 'delivery-policy', label: 'Delivery Policy' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#2A1E1A]/10 transition-colors">
      {/* Announcement Bar */}
      <div className="bg-[#2A1E1A] text-[#FAF7F2] text-xs py-2 px-4 text-center tracking-wider font-light flex items-center justify-center gap-2">
        <Heart className="w-3 h-3 text-[#D4A39A] fill-[#D4A39A]" />
        <span>Thoughtful surprises, made personal. Delivering across Chandigarh University & Mohali.</span>
      </div>

      {/* Main Top Bar - 3 Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#2A1E1A] hover:text-[#B87A68] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B87A68]"
        >
          <span>DILSY</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#B87A68] inline-block mb-1" />
        </button>

        {/* Zone 2: Navigation Links (Single line, text with hover underlines) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A352F]">
          {navLinks.slice(0, 6).map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`hover:text-[#2A1E1A] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeSection === link.id
                  ? 'border-[#B87A68] text-[#2A1E1A] font-semibold'
                  : 'border-transparent text-[#4A352F]/80 hover:border-[#D4A39A]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action (Bag button with count) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            aria-label="View shopping bag"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F5EFEB] hover:bg-[#EAE0D6] border border-[#2A1E1A]/10 text-[#2A1E1A] transition-colors whitespace-nowrap shrink-0 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B87A68]"
          >
            <ShoppingBag className="w-4 h-4 text-[#2A1E1A]" />
            <span className="text-xs font-semibold tracking-wide uppercase hidden sm:inline">Bag</span>
            <span className="w-5 h-5 rounded-full bg-[#2A1E1A] text-[#FAF7F2] text-xs font-medium flex items-center justify-center tabular-nums">
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
          </div>
        </div>
      )}
    </header>
  );
};
