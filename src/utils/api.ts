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

const ADMIN_TOKEN_KEY = 'dilsy_admin_token_v1';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function removeAdminToken(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

function authHeaders(): HeadersInit {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ================= PUBLIC API CALLS =================

export interface BootstrapResponse {
  success: boolean;
  products: Product[];
  themes: ThemeCategory[];
  addons: AddOnItem[];
  offers: Offer[];
  settings: StoreSettings;
}

export async function fetchPublicStoreData(): Promise<BootstrapResponse> {
  const res = await fetch('/api/public/bootstrap');
  if (!res.ok) {
    throw new Error('Failed to load store catalog');
  }
  return res.json();
}

export async function submitPublicOrderInquiry(orderData: Partial<OrderRequest>): Promise<{ orderId: string }> {
  const res = await fetch('/api/public/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    throw new Error('Failed to register order request');
  }
  return res.json();
}

// ================= ADMIN AUTH CALLS =================

export async function adminLoginApi(password: string): Promise<{ success: boolean; token: string }> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Invalid credentials');
  }
  setAdminToken(data.token);
  return data;
}

export async function adminVerifySessionApi(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const res = await fetch('/api/admin/verify', {
      headers: authHeaders(),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.valid;
  } catch {
    return false;
  }
}

export async function adminLogoutApi(): Promise<void> {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: authHeaders(),
    });
  } finally {
    removeAdminToken();
  }
}

export async function adminChangePasswordApi(currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch('/api/admin/change-password', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update password');
  }
}

// ================= ADMIN DATA CALLS =================

export interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
  activeOffersCount: number;
  totalOrdersCount: number;
  pendingOrdersCount: number;
}

export async function fetchAdminDashboard(): Promise<{
  stats: DashboardStats;
  recentOrders: OrderRequest[];
}> {
  const res = await fetch('/api/admin/dashboard', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load dashboard metrics');
  return res.json();
}

// Products
export async function fetchAdminProducts(): Promise<Product[]> {
  const res = await fetch('/api/admin/products', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load products');
  const data = await res.json();
  return data.products;
}

export async function createAdminProduct(product: Partial<Product>): Promise<Product> {
  const res = await fetch('/api/admin/products', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(product),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create product');
  return data.product;
}

export async function updateAdminProduct(id: string, product: Partial<Product>): Promise<Product> {
  const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(product),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update product');
  return data.product;
}

export async function updateAdminProductStock(id: string, stockStatus: StockStatus): Promise<Product> {
  const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}/stock`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ stockStatus }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update stock status');
  return data.product;
}

export async function deleteAdminProduct(id: string): Promise<void> {
  const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

// Themes
export async function fetchAdminThemes(): Promise<ThemeCategory[]> {
  const res = await fetch('/api/admin/themes', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load themes');
  const data = await res.json();
  return data.themes;
}

export async function updateAdminTheme(id: string, theme: Partial<ThemeCategory>): Promise<ThemeCategory> {
  const res = await fetch(`/api/admin/themes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(theme),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update theme');
  return data.theme;
}

// Addons
export async function fetchAdminAddons(): Promise<AddOnItem[]> {
  const res = await fetch('/api/admin/addons', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load add-ons');
  const data = await res.json();
  return data.addons;
}

export async function createAdminAddon(addon: Partial<AddOnItem>): Promise<AddOnItem> {
  const res = await fetch('/api/admin/addons', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(addon),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create add-on');
  return data.addon;
}

export async function updateAdminAddon(id: string, addon: Partial<AddOnItem>): Promise<AddOnItem> {
  const res = await fetch(`/api/admin/addons/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(addon),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update add-on');
  return data.addon;
}

export async function deleteAdminAddon(id: string): Promise<void> {
  const res = await fetch(`/api/admin/addons/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete add-on');
}

// Offers
export async function fetchAdminOffers(): Promise<Offer[]> {
  const res = await fetch('/api/admin/offers', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load offers');
  const data = await res.json();
  return data.offers;
}

export async function createAdminOffer(offer: Partial<Offer>): Promise<Offer> {
  const res = await fetch('/api/admin/offers', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(offer),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create offer');
  return data.offer;
}

export async function updateAdminOffer(id: string, offer: Partial<Offer>): Promise<Offer> {
  const res = await fetch(`/api/admin/offers/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(offer),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update offer');
  return data.offer;
}

export async function deleteAdminOffer(id: string): Promise<void> {
  const res = await fetch(`/api/admin/offers/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete offer');
}

// Orders
export async function fetchAdminOrders(): Promise<OrderRequest[]> {
  const res = await fetch('/api/admin/orders', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load order inquiries');
  const data = await res.json();
  return data.orders;
}

export async function updateAdminOrderStatus(
  id: string,
  status: OrderStatus,
  adminNotes?: string
): Promise<OrderRequest> {
  const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status, adminNotes }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update order status');
  return data.order;
}

// Settings
export async function fetchAdminSettings(): Promise<StoreSettings> {
  const res = await fetch('/api/admin/settings', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load store settings');
  const data = await res.json();
  return data.settings;
}

export async function updateAdminSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const res = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(settings),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update store settings');
  return data.settings;
}

// Upload Image
export async function uploadAdminImage(base64: string, filename?: string): Promise<string> {
  const res = await fetch('/api/admin/upload-image', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ base64, filename }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Image upload failed');
  return data.url;
}
