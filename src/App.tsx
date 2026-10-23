import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ShopByThemeSection } from './components/ShopByThemeSection';
import { CollectionPage } from './components/CollectionPage';
import { CustomHamperBuilder } from './components/CustomHamperBuilder';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppReviewModal } from './components/WhatsAppReviewModal';
import { OurStory, DeliveryPolicySection, FaqSection, Footer } from './components/StoryAndFaq';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartItem, Product, ProductCustomisation } from './types';
import { generateSingleProductWhatsAppMessage } from './utils/whatsapp';
import { adminVerifySessionApi, getAdminToken } from './utils/api';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { Heart, ArrowRight } from 'lucide-react';

function StorefrontApp({ onNavigateToAdmin }: { onNavigateToAdmin?: () => void }) {
  const { products, themes, settings, activeOffer, calculateDiscount, recordOrderInquiry } = useStore();

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

  // URL / Collection route state
  const [currentCollectionSlug, setCurrentCollectionSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/collections/')) {
        const slug = path.replace('/collections/', '').replace(/\/$/, '');
        return slug;
      }
    }
    return null;
  });

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

  // Listen for browser Back / Forward buttons (HTML5 history)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/collections/')) {
        const slug = path.replace('/collections/', '').replace(/\/$/, '');
        setCurrentCollectionSlug(slug);
      } else {
        setCurrentCollectionSlug(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.customisation.recipientName === customisation.recipientName &&
          item.customisation.recipientChoice === customisation.recipientChoice &&
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
    const { discountAmount, finalAmount, appliedOffer } = calculateDiscount(product.price);
    const discountInfo = appliedOffer
      ? { code: appliedOffer.code, amount: discountAmount, finalPrice: finalAmount }
      : null;

    const message = generateSingleProductWhatsAppMessage(
      product,
      customisation,
      undefined,
      discountInfo
    );

    // Save order request to backend
    recordOrderInquiry({
      source: 'single_product',
      customerName: customisation.recipientName || 'Gifting Customer',
      customerPhone: '',
      deliveryArea: 'Chandigarh University / Mohali Area',
      specificLandmark: '',
      deliveryDate: 'Standard Delivery',
      timeWindow: 'Afternoon',
      items: [
        {
          title: `${product.name} (${product.size})`,
          quantity: 1,
          price: product.price,
          customisation: customisation as any,
        },
      ],
      subtotal: product.price,
      discountAmount,
      total: finalAmount,
      appliedOffer: appliedOffer
        ? { code: appliedOffer.code, title: appliedOffer.title, discountAmount }
        : null,
      specialInstructions: customisation.specialInstructions,
      rawWhatsappMessage: message,
    });

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

  // Navigate to a dedicated collection page
  const navigateToCollection = (slugOrId: string) => {
    const matched = themes.find((t) => t.slug === slugOrId || t.id === slugOrId);
    const slug = matched ? matched.slug : slugOrId;
    window.history.pushState({}, '', `/collections/${slug}`);
    setCurrentCollectionSlug(slug);
    setActiveSection('shop-by-theme');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate back to all themes
  const navigateBackToThemes = () => {
    window.history.pushState({}, '', '/');
    setCurrentCollectionSlug(null);
    setActiveSection('shop-by-theme');
    setTimeout(() => {
      document.getElementById('shop-by-theme')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // General Navbar and link navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);

    if (currentCollectionSlug) {
      window.history.pushState({}, '', '/');
      setCurrentCollectionSlug(null);
    }

    setTimeout(() => {
      if (sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (sectionId === 'shop-by-theme') {
        document.getElementById('shop-by-theme')?.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'shop') {
        setActiveFilter('all');
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'for-him') {
        navigateToCollection('i-love-you-for-him');
      } else if (sectionId === 'for-her') {
        navigateToCollection('i-love-you-for-her');
      } else if (sectionId === 'besties') {
        setActiveFilter('besties');
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Filter products excluding unpublished
  const publishedProducts = products.filter((p) => p.stockStatus !== 'unpublished');
  const filteredProducts = publishedProducts.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.categories.includes(activeFilter);
  });

  const cartTotalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  // Active collection object if on a collection page
  const currentCollection = currentCollectionSlug
    ? themes.find((t) => t.slug === currentCollectionSlug || t.id === currentCollectionSlug) || null
    : null;

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
        activeSection={currentCollection ? 'shop-by-theme' : activeSection}
        onNavigate={handleNavigate}
        onNavigateToAdmin={onNavigateToAdmin}
        announcement={settings.announcement}
      />

      <main className="flex-1">
        {currentCollection ? (
          <CollectionPage
            collection={currentCollection}
            allProducts={publishedProducts}
            onBackToThemes={navigateBackToThemes}
            onNavigateToCollection={navigateToCollection}
            onOpenCustomBuilder={(occasionTitle) => {
              setCustomBuilderOccasion(occasionTitle);
              window.history.pushState({}, '', '/');
              setCurrentCollectionSlug(null);
              setTimeout(() => {
                document.getElementById('custom-builder')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            onAddToCart={handleAddToCart}
            onOrderWhatsApp={handleOrderWhatsAppSingle}
          />
        ) : (
          <>
            {/* Hero Section */}
            <Hero
              onShopClick={() => handleNavigate('shop')}
              onShopByThemeClick={() => handleNavigate('shop-by-theme')}
              onCustomClick={() => handleNavigate('custom-builder')}
            />

            {/* Shop by Theme Section (9 Category Cards with View Collection) */}
            <ShopByThemeSection
              products={publishedProducts}
              themes={themes}
              onSelectTheme={navigateToCollection}
              onOpenCustomBuilder={(themeOccasion) => {
                if (themeOccasion) setCustomBuilderOccasion(themeOccasion);
                document.getElementById('custom-builder')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Official Box Hampers & Curations */}
            <section id="shop" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#A32842] bg-[#FFEBF0] px-3 py-1 rounded-full border border-[#FFCCD5] mb-2 shadow-2xs">
                    <Heart className="w-3.5 h-3.5 fill-[#C73858] text-[#C73858]" />
                    <span>Curated With Love</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D1B22] tracking-tight text-balance">
                    Official Box Hampers & Curations
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-[#52333D] font-light max-w-xl">
                    Featuring our recommended Loved Box (Medium — ₹969) alongside our official Small Box (₹799) and Large Box (₹1,199). Every box is personal, carefully assembled, and confirmed directly with you on WhatsApp before dispatch.
                  </p>
                </div>

                {/* Filter Tabs / Segmented Controls */}
                <div className="flex items-center gap-1.5 p-1 bg-[#FAF0F3] rounded-xl border border-[#E8C2CC] overflow-x-auto self-start md:self-auto shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setActiveFilter('all')}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
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
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
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
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
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
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      activeFilter === 'besties'
                        ? 'bg-gradient-to-r from-[#99223A] to-[#801B30] text-white shadow-xs font-semibold'
                        : 'text-[#6B3241] hover:text-[#99223A]'
                    }`}
                  >
                    Besties
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onOrderWhatsApp={handleOrderWhatsAppSingle}
                    activePromoText={activeOffer?.badgeText}
                  />
                ))}
              </div>

              {/* Custom notice banner */}
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
                  className="px-5 py-2.5 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-xs shadow-[#99223A]/20 cursor-pointer"
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
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onNavigateToAdmin={onNavigateToAdmin} />

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
        whatsappPhone={settings.whatsappPhone}
      />
    </div>
  );
}

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/admin');
    }
    return false;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState<boolean>(true);

  // Check admin session on load or URL changes
  useEffect(() => {
    const handleLocationChange = async () => {
      const isAdmin = window.location.pathname.startsWith('/admin');
      setIsAdminRoute(isAdmin);

      if (isAdmin) {
        setIsVerifyingAdmin(true);
        const valid = await adminVerifySessionApi();
        setIsAdminAuthenticated(valid);
        setIsVerifyingAdmin(false);
      } else {
        setIsVerifyingAdmin(false);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
  };

  const handleNavigateToStore = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
  };

  const handleNavigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
    setIsVerifyingAdmin(true);
    adminVerifySessionApi().then((valid) => {
      setIsAdminAuthenticated(valid);
      setIsVerifyingAdmin(false);
    });
  };

  if (isAdminRoute) {
    if (isVerifyingAdmin) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-sans">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-[#99223A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-[#6B424E]">Verifying DILSY Studio Session...</p>
          </div>
        </div>
      );
    }

    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToStore={handleNavigateToStore}
        />
      );
    }

    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
        onNavigateToStore={handleNavigateToStore}
      />
    );
  }

  return (
    <StoreProvider>
      <StorefrontApp onNavigateToAdmin={handleNavigateToAdmin} />
    </StoreProvider>
  );
}
