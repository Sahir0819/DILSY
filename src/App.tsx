import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/StoryAndFaq';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppReviewModal } from './components/WhatsAppReviewModal';
import { HomePage } from './pages/HomePage';
import { ThemesPage } from './pages/ThemesPage';
import { AllHampersPage } from './pages/AllHampersPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { OurStoryPage } from './pages/OurStoryPage';
import { DeliveryPolicyPage } from './pages/DeliveryPolicyPage';
import { LoginPage } from './pages/LoginPage';
import { AccountPage } from './pages/AccountPage';
import { CollectionPage } from './components/CollectionPage';
import { CustomHamperBuilder } from './components/CustomHamperBuilder';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartItem, Product, ProductCustomisation } from './types';
import { generateSingleProductWhatsAppMessage } from './utils/whatsapp';
import {
  adminVerifySessionApi,
  adminLogoutApi,
  getCustomerSession,
  removeCustomerSession,
  removeAdminToken,
  UnifiedLoginResult,
} from './utils/api';
import { AdminDashboard } from './admin/AdminDashboard';
import { Heart } from 'lucide-react';
import { getThemeBySlugOrId } from './data/themes';

function StorefrontApp() {
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
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

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

  // Listen for browser Back / Forward history events
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dilsy_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Central Navigation Handler
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (result: UnifiedLoginResult) => {
    if (result.role === 'admin' || result.redirectTo === '/admin') {
      window.history.pushState({}, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      window.history.pushState({}, '', '/account');
      setCurrentPath('/account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCustomerLogout = () => {
    removeCustomerSession();
    removeAdminToken();
    window.history.pushState({}, '', '/login');
    setCurrentPath('/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const cartTotalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  // ROUTE PARSING & RESOLUTION
  const cleanPath = currentPath.split('?')[0].replace(/\/$/, '') || '/';
  const queryParams = new URLSearchParams(currentPath.split('?')[1] || '');

  // 1. Collection Detail Route: /collections/:slug
  let selectedCollection = null;
  if (cleanPath.startsWith('/collections/')) {
    const slug = cleanPath.replace('/collections/', '');
    selectedCollection = getThemeBySlugOrId(slug) || themes.find((t) => t.slug === slug || t.id === slug) || null;
  }

  // 2. Product Detail Route: /product/:id or /hampers/:id
  let selectedProduct: Product | null = null;
  if (cleanPath.startsWith('/product/')) {
    const productId = cleanPath.replace('/product/', '');
    selectedProduct = products.find((p) => p.id === productId) || null;
  } else if (cleanPath.startsWith('/hampers/') && cleanPath !== '/hampers') {
    const productId = cleanPath.replace('/hampers/', '');
    selectedProduct = products.find((p) => p.id === productId) || null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2A0D15] flex flex-col font-sans">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3E101D] text-white px-5 py-3.5 shadow-2xl text-xs font-sans tracking-wide uppercase flex items-center gap-2.5 border border-[#EADBDB]/40 animate-in fade-in slide-in-from-bottom-2">
          <Heart className="w-3.5 h-3.5 text-white fill-white animate-heart-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        cartCount={cartTotalItems}
        currentPath={currentPath}
        onNavigate={navigate}
        announcement={settings.announcement}
      />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {selectedCollection ? (
          <CollectionPage
            collection={selectedCollection}
            allProducts={products.filter((p) => p.stockStatus !== 'unpublished')}
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
            onOrderWhatsApp={handleOrderWhatsAppSingle}
            onViewProductDetails={(prod) => navigate(`/product/${prod.id}`)}
          />
        ) : selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
            onOrderWhatsApp={handleOrderWhatsAppSingle}
            activePromoText={activeOffer?.badgeText}
          />
        ) : cleanPath === '/themes' ? (
          <ThemesPage
            themes={themes}
            onNavigate={navigate}
          />
        ) : cleanPath === '/hampers' ? (
          <AllHampersPage
            products={products}
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
            onOrderWhatsApp={handleOrderWhatsAppSingle}
            onViewProductDetails={(prod) => navigate(`/product/${prod.id}`)}
            activePromoText={activeOffer?.badgeText}
          />
        ) : cleanPath === '/custom-hamper' ? (
          <CustomHamperBuilder
            prefilledOccasion={queryParams.get('occasion') || undefined}
            onOpenReviewModal={(title, message) =>
              setReviewModal({ isOpen: true, title, message })
            }
            onNavigate={navigate}
            isStandalonePage={true}
          />
        ) : cleanPath === '/cart' ? (
          <CartPage
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onNavigate={navigate}
            onOpenReviewModal={(title, message) =>
              setReviewModal({ isOpen: true, title, message })
            }
          />
        ) : cleanPath === '/our-story' ? (
          <OurStoryPage onNavigate={navigate} />
        ) : cleanPath === '/delivery-policy' ? (
          <DeliveryPolicyPage onNavigate={navigate} />
        ) : cleanPath === '/login' ? (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigate={navigate}
          />
        ) : cleanPath === '/account' ? (
          <AccountPage
            onNavigate={navigate}
            onLogout={handleCustomerLogout}
          />
        ) : (
          /* Default: Homepage */
          <HomePage
            products={products}
            themes={themes}
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
            onOrderWhatsApp={handleOrderWhatsAppSingle}
            onViewProductDetails={(prod) => navigate(`/product/${prod.id}`)}
            activePromoText={activeOffer?.badgeText}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Quick Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onBrowseProducts={() => {
          setIsCartOpen(false);
          navigate('/hampers');
        }}
        onNavigateToCartPage={() => {
          setIsCartOpen(false);
          navigate('/cart');
        }}
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

        // Security requirement: If unauthenticated visitor visits /admin directly,
        // redirect immediately to the common customer login page at /login.
        if (!valid) {
          window.history.replaceState({}, '', '/login');
          setIsAdminRoute(false);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      } else {
        setIsVerifyingAdmin(false);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleAdminLogout = async () => {
    await adminLogoutApi();
    setIsAdminAuthenticated(false);
    setIsAdminRoute(false);
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleNavigateToStore = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (isAdminRoute) {
    if (isVerifyingAdmin) {
      return (
        <div className="min-h-screen bg-[#FCE7ED] flex items-center justify-center font-sans">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-[#9F2343] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-[#795A63]">Verifying DILSY Studio Session...</p>
          </div>
        </div>
      );
    }

    // If verified admin, display Admin Dashboard
    if (isAdminAuthenticated) {
      return (
        <AdminDashboard
          onLogout={handleAdminLogout}
          onNavigateToStore={handleNavigateToStore}
        />
      );
    }

    // Unauthenticated: redirect already triggered to /login, render null while navigating
    return null;
  }

  return (
    <StoreProvider>
      <StorefrontApp />
    </StoreProvider>
  );
}
