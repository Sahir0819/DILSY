import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ShopByThemeSection } from './components/ShopByThemeSection';
import { CustomHamperBuilder } from './components/CustomHamperBuilder';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppReviewModal } from './components/WhatsAppReviewModal';
import { OurStory, DeliveryPolicySection, FaqSection, Footer } from './components/StoryAndFaq';
import { PRODUCTS } from './data/products';
import { THEME_CATEGORIES } from './data/themes';
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
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [customBuilderOccasion, setCustomBuilderOccasion] = useState<string>('Birthday Box');
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
    } else if (sectionId === 'shop-by-theme') {
      setSelectedThemeId(null);
      document.getElementById('shop-by-theme')?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'shop') {
      setActiveFilter('all');
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'for-him') {
      setSelectedThemeId('i-love-you-for-him');
      document.getElementById('shop-by-theme')?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'for-her') {
      setSelectedThemeId('i-love-you-for-her');
      document.getElementById('shop-by-theme')?.scrollIntoView({ behavior: 'smooth' });
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
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#801B30] to-[#99223A] text-[#FFF0F3] px-4 py-3 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 border border-[#FFCCD5]/40 animate-in fade-in slide-in-from-bottom-2">
          <Heart className="w-4 h-4 text-[#FF85A1] fill-[#FF85A1] animate-heart-pulse" />
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
          onShopByThemeClick={() => handleNavigate('shop-by-theme')}
          onCustomClick={() => handleNavigate('custom-builder')}
        />

        {/* Shop by Theme Section (Final 9 Business-Approved Categories) */}
        <ShopByThemeSection
          products={PRODUCTS}
          selectedThemeId={selectedThemeId}
          onSelectTheme={(themeId) => setSelectedThemeId(themeId)}
          onOpenCustomBuilder={(themeOccasion) => {
            if (themeOccasion) setCustomBuilderOccasion(themeOccasion);
            document.getElementById('custom-builder')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onAddToCart={handleAddToCart}
          onOrderWhatsApp={handleOrderWhatsAppSingle}
        />

        {/* Featured Products Collection */}
        <section id="shop" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#A32842] bg-[#FFEBF0] px-3 py-1 rounded-full border border-[#FFCCD5] mb-2 shadow-2xs">
                <Heart className="w-3.5 h-3.5 fill-[#C73858] text-[#C73858]" />
                <span>Handcrafted With Love</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D1B22] tracking-tight text-balance">
                The Launch Hampers
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#52333D] font-light max-w-xl">
                Three bespoke launch concepts crafted for romantic milestones, birthdays, anniversaries, and hostel care packages. Each box is completely customizable upon WhatsApp verification.
              </p>
            </div>

            {/* Filter Tabs / Segmented Controls with Love Hues */}
            <div className="flex items-center gap-1.5 p-1 bg-[#FAF0F3] rounded-xl border border-[#E8C2CC] overflow-x-auto self-start md:self-auto shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeFilter === 'all'
                    ? 'bg-gradient-to-r from-[#99223A] to-[#801B30] text-white shadow-xs font-semibold'
                    : 'text-[#6B3241] hover:text-[#99223A]'
                }`}
              >
                Shop All
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('for-him')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeFilter === 'for-him'
                    ? 'bg-gradient-to-r from-[#99223A] to-[#801B30] text-white shadow-xs font-semibold'
                    : 'text-[#6B3241] hover:text-[#99223A]'
                }`}
              >
                For Him
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('for-her')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeFilter === 'for-her'
                    ? 'bg-gradient-to-r from-[#99223A] to-[#801B30] text-white shadow-xs font-semibold'
                    : 'text-[#6B3241] hover:text-[#99223A]'
                }`}
              >
                For Her
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('besties')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeFilter === 'besties'
                    ? 'bg-gradient-to-r from-[#99223A] to-[#801B30] text-white shadow-xs font-semibold'
                    : 'text-[#6B3241] hover:text-[#99223A]'
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

          {/* Need custom notice banner with romantic love styling */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#FFEBF0] via-[#FFF0F4] to-[#FFE8EE] border border-[#FFCCD5] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm shadow-[#FFCCD5]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFD1DC] border border-[#FFB3C6] flex items-center justify-center text-[#99223A] shrink-0 shadow-2xs">
                <Heart className="w-5 h-5 fill-[#C73858] text-[#C73858]" />
              </div>
              <div>
                <p className="font-serif font-bold text-base text-[#2D1B22]">Want a custom love combination or specific budget?</p>
                <p className="text-xs text-[#6B424E]">Mix and match goodies, polaroids, scents, and keepsakes in our studio builder.</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('custom-builder')}
              className="px-5 py-2.5 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-xs shadow-[#99223A]/20"
            >
              <span>Build Custom Hamper</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Custom Hamper Builder Section */}
        <CustomHamperBuilder
          prefilledOccasion={customBuilderOccasion}
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
