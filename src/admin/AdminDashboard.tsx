import React, { useState, useEffect, useCallback } from 'react';
import {
  Heart,
  LayoutDashboard,
  Package,
  CheckCircle,
  Tag,
  Layers,
  Sparkles,
  ShoppingBag,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  Product,
  ThemeCategory,
  AddOnItem,
  Offer,
  StoreSettings,
  OrderRequest,
  StockStatus,
  OrderStatus,
} from '../types';
import {
  fetchAdminDashboard,
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  updateAdminProductStock,
  deleteAdminProduct,
  fetchAdminThemes,
  updateAdminTheme,
  fetchAdminAddons,
  createAdminAddon,
  updateAdminAddon,
  deleteAdminAddon,
  fetchAdminOffers,
  createAdminOffer,
  updateAdminOffer,
  deleteAdminOffer,
  fetchAdminOrders,
  updateAdminOrderStatus,
  fetchAdminSettings,
  updateAdminSettings,
  adminLogoutApi,
  DashboardStats,
} from '../utils/api';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminProducts } from './AdminProducts';
import { AdminStockManager } from './AdminStockManager';
import { AdminOffers } from './AdminOffers';
import { AdminThemes } from './AdminThemes';
import { AdminAddons } from './AdminAddons';
import { AdminOrders } from './AdminOrders';
import { AdminSettings } from './AdminSettings';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigateToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onNavigateToStore,
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Studio Data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [themes, setThemes] = useState<ThemeCategory[]>([]);
  const [addons, setAddons] = useState<AddOnItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadAllAdminData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const [dash, prodList, themeList, addonList, offerList, orderList, storeSettings] =
        await Promise.all([
          fetchAdminDashboard(),
          fetchAdminProducts(),
          fetchAdminThemes(),
          fetchAdminAddons(),
          fetchAdminOffers(),
          fetchAdminOrders(),
          fetchAdminSettings(),
        ]);

      setStats(dash.stats);
      setProducts(prodList);
      setThemes(themeList);
      setAddons(addonList);
      setOffers(offerList);
      setOrders(orderList);
      setSettings(storeSettings);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      showToast(err.message || 'Error loading studio data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllAdminData();
  }, [loadAllAdminData]);

  const handleLogout = async () => {
    await adminLogoutApi();
    onLogout();
  };

  // Product Actions
  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (productData.id) {
      await updateAdminProduct(productData.id, productData);
      showToast(`Updated "${productData.name}"`);
    } else {
      await createAdminProduct(productData);
      showToast(`Created new hamper "${productData.name}"`);
    }
    await loadAllAdminData();
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteAdminProduct(id);
    showToast('Hamper removed');
    await loadAllAdminData();
  };

  const handleQuickStockChange = async (id: string, stock: StockStatus) => {
    await updateAdminProductStock(id, stock);
    showToast(`Updated stock status to ${stock}`);
    await loadAllAdminData();
  };

  // Theme Actions
  const handleSaveTheme = async (themeData: Partial<ThemeCategory>) => {
    if (!themeData.id) return;
    await updateAdminTheme(themeData.id, themeData);
    showToast(`Updated collection "${themeData.name}"`);
    await loadAllAdminData();
  };

  // Addon Actions
  const handleSaveAddon = async (addonData: Partial<AddOnItem>) => {
    if (addonData.id) {
      await updateAdminAddon(addonData.id, addonData);
      showToast(`Updated add-on "${addonData.name}"`);
    } else {
      await createAdminAddon(addonData);
      showToast(`Created add-on "${addonData.name}"`);
    }
    await loadAllAdminData();
  };

  const handleDeleteAddon = async (id: string) => {
    await deleteAdminAddon(id);
    showToast('Add-on removed');
    await loadAllAdminData();
  };

  // Offer Actions
  const handleSaveOffer = async (offerData: Partial<Offer>) => {
    if (offerData.id) {
      await updateAdminOffer(offerData.id, offerData);
      showToast(`Updated offer "${offerData.title}"`);
    } else {
      await createAdminOffer(offerData);
      showToast(`Created offer "${offerData.title}"`);
    }
    await loadAllAdminData();
  };

  const handleDeleteOffer = async (id: string) => {
    await deleteAdminOffer(id);
    showToast('Offer removed');
    await loadAllAdminData();
  };

  // Order Actions
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    adminNotes?: string
  ) => {
    await updateAdminOrderStatus(orderId, status, adminNotes);
    showToast(`Updated order ${orderId} to ${status}`);
    await loadAllAdminData();
  };

  // Settings Actions
  const handleSaveSettings = async (updatedSettings: Partial<StoreSettings>) => {
    const saved = await updateAdminSettings(updatedSettings);
    setSettings(saved);
    showToast('Store settings saved successfully');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Hampers & Pricing', icon: Package, count: products.length },
    {
      id: 'stock',
      label: 'Stock Control',
      icon: CheckCircle,
      alert: stats?.outOfStockProducts ? `${stats.outOfStockProducts}` : undefined,
    },
    { id: 'offers', label: 'Discounts & Offers', icon: Tag, count: offers.filter((o) => o.isActive).length },
    { id: 'themes', label: 'Occasion Themes', icon: Layers, count: themes.length },
    { id: 'addons', label: 'Add-ons Catalogue', icon: Sparkles, count: addons.length },
    {
      id: 'orders',
      label: 'Order Inquiries',
      icon: ShoppingBag,
      alert: stats?.pendingOrdersCount ? `${stats.pendingOrdersCount}` : undefined,
    },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FCE7ED] text-[#3B2028] font-sans flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#9F2343] text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-[#72172F] animate-in fade-in slide-in-from-bottom-2">
          <Heart className="w-4 h-4 fill-white text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Studio Header */}
      <header className="sticky top-0 z-40 bg-[#FFFAF8]/95 backdrop-blur-md border-b border-[#F1C5D1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand & Studio Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#9F2343] text-white flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl text-[#3B2028]">DILSY</span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#9F2343] bg-[#FFF1F4] px-2 py-0.5 rounded-full border border-[#F1C5D1]">
                  Admin Studio
                </span>
              </div>
              <p className="text-[11px] text-[#79665C] hidden sm:block">
                Authenticated Studio Session
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={loadAllAdminData}
              disabled={isRefreshing}
              className="p-2 text-[#9F2343] hover:text-[#72172F] hover:bg-[#FFF1F4] rounded-xl transition-colors cursor-pointer border border-[#F1C5D1] shadow-2xs"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onNavigateToStore}
              className="px-3.5 py-2 text-xs font-semibold text-[#9F2343] hover:text-[#72172F] bg-[#FFFAF8] hover:bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Customer Store</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 text-xs font-semibold text-[#9F2343] hover:bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#F1C5D1] overflow-x-auto">
          <nav className="flex items-center gap-1 sm:gap-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#9F2343] text-white shadow-xs'
                      : 'text-[#79665C] hover:text-[#9F2343] hover:bg-[#FFF1F4]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                  {item.alert && (
                    <span className="w-4 h-4 rounded-full bg-[#E63946] text-white text-[10px] flex items-center justify-center font-bold">
                      {item.alert}
                    </span>
                  )}
                  {item.count !== undefined && !item.alert && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono tabular-nums ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#FFF1F4] text-[#79665C]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-3 border-[#9F2343] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#3B2028]">Loading DILSY Studio data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <AdminDashboardOverview
                stats={stats}
                recentOrders={orders.slice(0, 5)}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            )}

            {activeTab === 'products' && (
              <AdminProducts
                products={products}
                onSaveProduct={handleSaveProduct}
                onDeleteProduct={handleDeleteProduct}
                onQuickStockChange={handleQuickStockChange}
              />
            )}

            {activeTab === 'stock' && (
              <AdminStockManager
                products={products}
                onQuickStockChange={handleQuickStockChange}
              />
            )}

            {activeTab === 'offers' && (
              <AdminOffers
                offers={offers}
                onSaveOffer={handleSaveOffer}
                onDeleteOffer={handleDeleteOffer}
              />
            )}

            {activeTab === 'themes' && (
              <AdminThemes themes={themes} onSaveTheme={handleSaveTheme} />
            )}

            {activeTab === 'addons' && (
              <AdminAddons
                addons={addons}
                onSaveAddon={handleSaveAddon}
                onDeleteAddon={handleDeleteAddon}
              />
            )}

            {activeTab === 'orders' && (
              <AdminOrders
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            )}

            {activeTab === 'settings' && settings && (
              <AdminSettings
                settings={settings}
                onSaveSettings={handleSaveSettings}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};
