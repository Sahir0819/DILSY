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
const AUTH_TOKEN_KEY = 'dilsy_auth_token_v1';
const CUSTOMER_SESSION_KEY = 'dilsy_customer_session_v1';

export interface CustomerSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  deliveryAddress?: string;
  specificLandmark?: string;
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeAdminToken(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    sessionStorage.getItem(ADMIN_TOKEN_KEY)
  );
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(CUSTOMER_SESSION_KEY);
}

export function getCustomerSession(): CustomerSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CUSTOMER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCustomerSession(customer: CustomerSession): void {
  localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(customer));
}

export function removeCustomerSession(): void {
  localStorage.removeItem(CUSTOMER_SESSION_KEY);
}

function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Robust JSON fetch wrapper that never crashes on empty or non-JSON responses.
 * Diagnoses response status, content type, and body, providing clear error details.
 */
export async function safeFetchJson<T = any>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const method = init?.method || 'GET';
  let res: Response;

  try {
    res = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.headers || {}),
      },
    });
  } catch (networkErr: any) {
    console.error(`[DILSY API Network Failure] ${method} ${url}:`, networkErr);
    throw new Error(
      `Unable to connect to DILSY server. Please verify your internet connection or deployment status.`
    );
  }

  // Safely read response text first to prevent uncaught "Unexpected end of JSON input" errors
  const rawText = await res.text();
  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  let parsedJson: any = null;
  let isJsonValid = false;

  if (rawText && rawText.trim().length > 0) {
    try {
      parsedJson = JSON.parse(rawText);
      isJsonValid = true;
    } catch {
      isJsonValid = false;
    }
  }

  // Log diagnostic info for non-production or errors
  if (!res.ok || !isJsonValid) {
    console.log(
      `[DILSY API Diagnostic] ${method} ${url} -> Status: ${res.status} ${res.statusText}, Content-Type: "${contentType}", Body length: ${rawText.length}`
    );
    if (!isJsonValid && rawText.length > 0) {
      console.warn(`[DILSY API Diagnostic] Raw response preview:`, rawText.slice(0, 300));
    }
  }

  // Handle HTTP error statuses (4xx, 5xx)
  if (!res.ok) {
    let errorMessage = parsedJson?.error || parsedJson?.message;

    if (!errorMessage) {
      if (!rawText || rawText.trim().length === 0) {
        errorMessage = `The server returned an empty response (${res.status} ${res.statusText}). If running on Netlify, please ensure Netlify Functions are deployed and /api/* redirects are active.`;
      } else if (rawText.includes('<!DOCTYPE') || rawText.includes('<html')) {
        errorMessage = `The server returned an HTML page (${res.status} ${res.statusText}) instead of API JSON. The endpoint may not be routed to Netlify Functions.`;
      } else {
        errorMessage = `Server error ${res.status} (${res.statusText}): ${rawText.slice(0, 150)}`;
      }
    }

    throw new Error(errorMessage);
  }

  // Handle 2xx responses with missing or invalid JSON
  if (!isJsonValid) {
    if (!rawText || rawText.trim().length === 0) {
      // For empty 204 or 200 without body
      return {} as T;
    }
    if (rawText.includes('<!DOCTYPE') || rawText.includes('<html')) {
      throw new Error(
        `Received HTML document instead of JSON data (${res.status} ${res.statusText}). The request may have been redirected to the index page.`
      );
    }
    throw new Error(
      `Received non-JSON response from ${url} (${res.status} ${res.statusText}): ${rawText.slice(0, 100)}`
    );
  }

  return parsedJson as T;
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
  return safeFetchJson<BootstrapResponse>('/api/public/bootstrap');
}

export async function submitPublicOrderInquiry(
  orderData: Partial<OrderRequest>
): Promise<{ orderId: string }> {
  return safeFetchJson<{ orderId: string }>('/api/public/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
}

// ================= UNIFIED AUTH & CUSTOMER CALLS =================

export interface UnifiedLoginResult {
  success: boolean;
  role: 'admin' | 'customer';
  redirectTo: string;
  token: string;
  user?: {
    username: string;
    role: 'admin';
    displayName: string;
  };
  customer?: CustomerSession;
}

export async function unifiedLoginApi(
  identifier: string,
  password: string
): Promise<UnifiedLoginResult> {
  let data: any;
  try {
    data = await safeFetchJson<UnifiedLoginResult>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
  } catch (err: any) {
    // Netlify fallback if /api/auth/login hits legacy redirect
    if (err.message && (err.message.includes('404') || err.message.includes('not found'))) {
      data = await safeFetchJson<UnifiedLoginResult>('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
    } else {
      throw err;
    }
  }

  if (!data?.token) {
    throw new Error('Authentication succeeded but server returned no session token.');
  }

  setAuthToken(data.token);

  if (data.role === 'admin') {
    setAdminToken(data.token);
  } else if (data.role === 'customer' && data.customer) {
    setCustomerSession(data.customer);
  }

  return data;
}

export async function customerSignupApi(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  deliveryAddress?: string;
  specificLandmark?: string;
}): Promise<UnifiedLoginResult> {
  const res = await safeFetchJson<UnifiedLoginResult>('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res?.token) {
    throw new Error('Account created but no session token was issued.');
  }

  setAuthToken(res.token);
  if (res.customer) {
    setCustomerSession(res.customer);
  }

  return res;
}

export async function verifyUnifiedSessionApi(): Promise<{
  valid: boolean;
  role?: 'admin' | 'customer';
  customer?: CustomerSession;
}> {
  const token = getAuthToken();
  if (!token) return { valid: false };

  try {
    const res = await safeFetchJson<{
      valid: boolean;
      role?: 'admin' | 'customer';
      customer?: CustomerSession;
    }>('/api/auth/verify', {
      headers: authHeaders(),
    });
    if (res.valid && res.customer) {
      setCustomerSession(res.customer);
    }
    return res;
  } catch {
    return { valid: false };
  }
}

export async function fetchCustomerProfile(): Promise<CustomerSession> {
  const data = await safeFetchJson<{ success: boolean; customer: CustomerSession }>(
    '/api/customer/profile',
    {
      headers: authHeaders(),
    }
  );
  if (data.customer) {
    setCustomerSession(data.customer);
  }
  return data.customer;
}

export async function updateCustomerProfileApi(
  updates: Partial<CustomerSession>
): Promise<CustomerSession> {
  const data = await safeFetchJson<{ success: boolean; customer: CustomerSession }>(
    '/api/customer/profile',
    {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(updates),
    }
  );
  if (data.customer) {
    setCustomerSession(data.customer);
  }
  return data.customer;
}

export async function fetchCustomerOrders(): Promise<OrderRequest[]> {
  const data = await safeFetchJson<{ success: boolean; orders: OrderRequest[] }>(
    '/api/customer/orders',
    {
      headers: authHeaders(),
    }
  );
  return data.orders || [];
}

export async function unifiedLogoutApi(): Promise<void> {
  try {
    await safeFetchJson('/api/auth/logout', {
      method: 'POST',
      headers: authHeaders(),
    });
  } catch {
    // Non-fatal
  } finally {
    removeAuthToken();
    removeCustomerSession();
    removeAdminToken();
  }
}

// ================= ADMIN AUTH CALLS =================

export async function adminLoginApi(
  password: string
): Promise<{ success: boolean; token: string }> {
  const data = await safeFetchJson<{ success: boolean; token: string; message?: string }>(
    '/api/admin/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    }
  );

  if (!data.token) {
    throw new Error('Authentication succeeded but server returned no session token.');
  }

  setAdminToken(data.token);
  return data;
}

export async function adminVerifySessionApi(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;

  try {
    const data = await safeFetchJson<{ valid: boolean }>('/api/admin/verify', {
      headers: authHeaders(),
    });
    return !!data.valid;
  } catch (err) {
    console.warn('[DILSY Admin] Session verification failed:', err);
    return false;
  }
}

export async function adminLogoutApi(): Promise<void> {
  try {
    await safeFetchJson('/api/admin/logout', {
      method: 'POST',
      headers: authHeaders(),
    });
  } catch {
    // Non-fatal
  } finally {
    removeAdminToken();
  }
}

export async function adminChangePasswordApi(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await safeFetchJson('/api/admin/change-password', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
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
  return safeFetchJson<{ stats: DashboardStats; recentOrders: OrderRequest[] }>(
    '/api/admin/dashboard',
    {
      headers: authHeaders(),
    }
  );
}

// Products
export async function fetchAdminProducts(): Promise<Product[]> {
  const data = await safeFetchJson<{ products: Product[] }>('/api/admin/products', {
    headers: authHeaders(),
  });
  return data.products;
}

export async function createAdminProduct(product: Partial<Product>): Promise<Product> {
  const data = await safeFetchJson<{ product: Product }>('/api/admin/products', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(product),
  });
  return data.product;
}

export async function updateAdminProduct(
  id: string,
  product: Partial<Product>
): Promise<Product> {
  const data = await safeFetchJson<{ product: Product }>(
    `/api/admin/products/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(product),
    }
  );
  return data.product;
}

export async function updateAdminProductStock(
  id: string,
  stockStatus: StockStatus
): Promise<Product> {
  const data = await safeFetchJson<{ product: Product }>(
    `/api/admin/products/${encodeURIComponent(id)}/stock`,
    {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ stockStatus }),
    }
  );
  return data.product;
}

export async function deleteAdminProduct(id: string): Promise<void> {
  await safeFetchJson(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

// Themes
export async function fetchAdminThemes(): Promise<ThemeCategory[]> {
  const data = await safeFetchJson<{ themes: ThemeCategory[] }>('/api/admin/themes', {
    headers: authHeaders(),
  });
  return data.themes;
}

export async function updateAdminTheme(
  id: string,
  theme: Partial<ThemeCategory>
): Promise<ThemeCategory> {
  const data = await safeFetchJson<{ theme: ThemeCategory }>(
    `/api/admin/themes/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(theme),
    }
  );
  return data.theme;
}

// Addons
export async function fetchAdminAddons(): Promise<AddOnItem[]> {
  const data = await safeFetchJson<{ addons: AddOnItem[] }>('/api/admin/addons', {
    headers: authHeaders(),
  });
  return data.addons;
}

export async function createAdminAddon(addon: Partial<AddOnItem>): Promise<AddOnItem> {
  const data = await safeFetchJson<{ addon: AddOnItem }>('/api/admin/addons', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(addon),
  });
  return data.addon;
}

export async function updateAdminAddon(
  id: string,
  addon: Partial<AddOnItem>
): Promise<AddOnItem> {
  const data = await safeFetchJson<{ addon: AddOnItem }>(
    `/api/admin/addons/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(addon),
    }
  );
  return data.addon;
}

export async function deleteAdminAddon(id: string): Promise<void> {
  await safeFetchJson(`/api/admin/addons/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

// Offers
export async function fetchAdminOffers(): Promise<Offer[]> {
  const data = await safeFetchJson<{ offers: Offer[] }>('/api/admin/offers', {
    headers: authHeaders(),
  });
  return data.offers;
}

export async function createAdminOffer(offer: Partial<Offer>): Promise<Offer> {
  const data = await safeFetchJson<{ offer: Offer }>('/api/admin/offers', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(offer),
  });
  return data.offer;
}

export async function updateAdminOffer(
  id: string,
  offer: Partial<Offer>
): Promise<Offer> {
  const data = await safeFetchJson<{ offer: Offer }>(
    `/api/admin/offers/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(offer),
    }
  );
  return data.offer;
}

export async function deleteAdminOffer(id: string): Promise<void> {
  await safeFetchJson(`/api/admin/offers/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

// Orders
export async function fetchAdminOrders(): Promise<OrderRequest[]> {
  const data = await safeFetchJson<{ orders: OrderRequest[] }>('/api/admin/orders', {
    headers: authHeaders(),
  });
  return data.orders;
}

export async function updateAdminOrderStatus(
  id: string,
  status: OrderStatus,
  adminNotes?: string
): Promise<OrderRequest> {
  const data = await safeFetchJson<{ order: OrderRequest }>(
    `/api/admin/orders/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status, adminNotes }),
    }
  );
  return data.order;
}

// Settings
export async function fetchAdminSettings(): Promise<StoreSettings> {
  const data = await safeFetchJson<{ settings: StoreSettings }>('/api/admin/settings', {
    headers: authHeaders(),
  });
  return data.settings;
}

export async function updateAdminSettings(
  settings: Partial<StoreSettings>
): Promise<StoreSettings> {
  const data = await safeFetchJson<{ settings: StoreSettings }>('/api/admin/settings', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(settings),
  });
  return data.settings;
}

// Upload Image
export async function uploadAdminImage(base64: string, filename?: string): Promise<string> {
  const data = await safeFetchJson<{ url: string }>('/api/admin/upload-image', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ base64, filename }),
  });
  return data.url;
}
