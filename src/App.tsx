import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { CustomHamperBuilder } from './components/CustomHamperBuilder';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppReviewModal } from './components/WhatsAppReviewModal';
import { OurStory, DeliveryPolicySection, FaqSection, Footer } from './components/StoryAndFaq';
import { PRODUCTS } from './data/products';
import { CartItem, Product, ProductCustomisation } from './types';
import { generateSingleProductWhatsAppMessage } from './utils/whatsapp';
import { Sparkles, Heart, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dilsy_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'for-him' | 'for-her' | 'besties'>('all');
  const [activeSection, setActiveSection] = useState('hero');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // WhatsApp review modal state
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dilsy_cart_v1', JSON.stringify(cart));
    } catch {
      // fallback
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (product: Product, customisation: ProductCustomisation) => {
    setCart((prev) => {
      // Match by product ID and same recipient customisation
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.customisation.recipientName === customisation.recipientName &&
          item.customisation.personalNote === customisation.personalNote
      );

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].quantity += 1;
        return next;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity: 1,
          customisation,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added ${product.name} to your bag!`);
  };

  const handleOrderWhatsAppSingle = (product: Product, customisation: ProductCustomisation) => {
    const message = generateSingleProductWhatsAppMessage(product, customisation);
    setReviewModal({
      isOpen: true,
      title: `Order "${product.name}" via WhatsApp`,
      message,
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'shop') {
      setActiveFilter('all');
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'for-him') {
      setActiveFilter('for-him');
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'for-her') {
      setActiveFilter('for-her');
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'besties') {
      setActiveFilter('besties');
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.categories.includes(activeFilter);
  });

  const cartTotalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2A1E1A] flex flex-col font-sans">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2A1E1A] text-[#FAF7F2] px-4 py-3 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 border border-[#FAF7F2]/20 animate-in fade-in slide-in-from-bottom-2">
          <Heart className="w-4 h-4 text-[#D4A39A] fill-[#D4A39A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onShopClick={() => handleNavigate('shop')}
          onCustomClick={() => handleNavigate('custom-builder')}
        />

        {/* Featured Products Collection */}
        <section id="shop" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8C5A4F] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Signature Curations</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A1E1A] tracking-tight text-balance">
                The Launch Hampers
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#4A352F]/90 font-light max-w-xl">
                Three bespoke launch concepts crafted for birthdays, anniversaries, and hostel care packages. Each box is completely customizable upon WhatsApp verification.
              </p>
            </div>

            {/* Filter Tabs / Segmented Controls */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F5EFEB] rounded-xl border border-[#2A1E1A]/10 overflow-x-auto self-start md:self-auto">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeFilter === 'all'
                    ? 'bg-white text-[#2A1E1A] shadow-xs font-semibold'
                    : 'text-[#4A352F] hover:text-[#2A1E1A]'
                }`}
              >
                Shop All
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('for-him')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeFilter === 'for-him'
                    ? 'bg-white text-[#2A1E1A] shadow-xs font-semibold'
                    : 'text-[#4A352F] hover:text-[#2A1E1A]'
                }`}
              >
                For Him
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('for-her')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeFilter === 'for-her'
                    ? 'bg-white text-[#2A1E1A] shadow-xs font-semibold'
                    : 'text-[#4A352F] hover:text-[#2A1E1A]'
                }`}
              >
                For Her
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('besties')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeFilter === 'besties'
                    ? 'bg-white text-[#2A1E1A] shadow-xs font-semibold'
                    : 'text-[#4A352F] hover:text-[#2A1E1A]'
                }`}
              >
                Besties
              </button>
            </div>
          </div>

          {/* 3-Column Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onOrderWhatsApp={handleOrderWhatsAppSingle}
              />
            ))}
          </div>

          {/* Need custom notice banner */}
          <div className="mt-12 p-6 rounded-2xl bg-[#F5EFEB]/70 border border-[#2A1E1A]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E8D5CE] flex items-center justify-center text-[#8C5A4F] shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif font-bold text-base text-[#2A1E1A]">Want a custom combination or different budget?</p>
                <p className="text-xs text-[#4A352F]/80">Mix and match goodies, polaroids, scents, and keepsakes in our studio builder.</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('custom-builder')}
              className="px-5 py-2.5 bg-[#2A1E1A] text-[#FAF7F2] rounded-lg text-xs font-semibold hover:bg-[#3D2C26] transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Build Custom Hamper</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Custom Hamper Builder Section */}
        <CustomHamperBuilder
          onOpenReviewModal={(title, message) =>
            setReviewModal({ isOpen: true, title, message })
          }
        />

        {/* Brand Story Section */}
        <OurStory />

        {/* Official Delivery Policy Section */}
        <DeliveryPolicySection />

        {/* FAQs Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onBrowseProducts={() => handleNavigate('shop')}
        onOpenReviewModal={(title, message) => {
          setIsCartOpen(false);
          setReviewModal({ isOpen: true, title, message });
        }}
      />

      {/* WhatsApp Message Review Modal */}
      <WhatsAppReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, title: '', message: '' })}
        title={reviewModal.title}
        messageText={reviewModal.message}
      />
    </div>
  );
}
