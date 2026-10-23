import fs from 'fs';
import path from 'path';
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
import { PRODUCTS, SERVICE_AREAS, TIME_WINDOWS } from '../data/products';
import { THEME_CATEGORIES } from '../data/themes';
import { ADD_ONS } from '../data/addons';
import { EXACT_DELIVERY_POLICY, WHATSAPP_PHONE_RAW, WHATSAPP_PHONE_INTERNATIONAL } from '../utils/whatsapp';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

export interface DatabaseSchema {
  products: Product[];
  themes: ThemeCategory[];
  addons: AddOnItem[];
  offers: Offer[];
  settings: StoreSettings;
  orders: OrderRequest[];
}

function ensureDirectories(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

/**
 * Default initial database state seeded from official configuration
 */
function createInitialDatabase(): DatabaseSchema {
  const initialProducts: Product[] = PRODUCTS.map((p) => ({
    ...p,
    stockStatus: 'available' as StockStatus,
    isFeatured: p.id === 'loved-box',
  }));

  const initialThemes: ThemeCategory[] = THEME_CATEGORIES.map((t) => ({
    ...t,
    // "i-love-you-for-him" is Coming Soon by default as per shop configuration
    isComingSoon: t.id === 'i-love-you-for-him' || !!t.isComingSoon,
    comingSoonMessage:
      t.id === 'i-love-you-for-him'
        ? 'Something special for him is on its way. Stay tuned!'
        : t.comingSoonMessage,
  }));

  const initialOffers: Offer[] = [
    {
      id: 'offer-welcome-50',
      title: 'First Gift Flat ₹50 Off',
      code: 'LOVE50',
      description: 'Get flat ₹50 off on orders above ₹799 when ordered with DILSY.',
      discountType: 'flat',
      discountValue: 50,
      minOrderAmount: 799,
      isActive: true,
      badgeText: '₹50 OFF on ₹799+',
    },
    {
      id: 'offer-love-10',
      title: 'Romantic Season 10% Off',
      code: 'DILSY10',
      description: 'Enjoy 10% off on Loved Box and custom hampers.',
      discountType: 'percent',
      discountValue: 10,
      minOrderAmount: 969,
      isActive: false,
      badgeText: '10% OFF Special',
    },
  ];

  const initialSettings: StoreSettings = {
    whatsappPhone: WHATSAPP_PHONE_RAW,
    whatsappPhoneInternational: WHATSAPP_PHONE_INTERNATIONAL,
    supportEmail: 'contact@dilsy.shop',
    instagramHandle: '@dilsygifts',
    deliveryPolicy: EXACT_DELIVERY_POLICY,
    deliveryAreas: SERVICE_AREAS,
    timeWindows: TIME_WINDOWS,
    announcement: {
      enabled: true,
      text: 'Thoughtful surprises, made personal with love.',
      secondaryText: '· Delivering across Chandigarh University & Mohali',
    },
    tagline: 'A Little Box Full of Feelings',
  };

  return {
    products: initialProducts,
    themes: initialThemes,
    addons: ADD_ONS,
    offers: initialOffers,
    settings: initialSettings,
    orders: [],
  };
}

/**
 * Initializes and reads the persistent database
 */
export function getDb(): DatabaseSchema {
  ensureDirectories();
  if (!fs.existsSync(DB_FILE)) {
    const initial = createInitialDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error('Error reading DB file, recreating fallback:', err);
    const initial = createInitialDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

/**
 * Atomically writes data back to disk
 */
export function saveDb(db: DatabaseSchema): void {
  ensureDirectories();
  const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_FILE);
}

// ================= PRODUCT REPOSITORY =================

export function getAllProducts(): Product[] {
  return getDb().products;
}

export function getPublicProducts(): Product[] {
  return getDb().products.filter((p) => p.stockStatus !== 'unpublished');
}

export function getProductById(id: string): Product | undefined {
  return getDb().products.find((p) => p.id === id);
}

export function createProduct(productData: Partial<Product>): Product {
  const db = getDb();
  const id = productData.id || `hamper-${Date.now()}`;

  const newProduct: Product = {
    id,
    name: productData.name || 'New Custom Hamper',
    size: productData.size || 'Medium',
    tagline: productData.tagline || 'Thoughtfully curated gift box.',
    price: Number(productData.price) || 969,
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
    description: productData.description || 'A little box, filled with thoughtful details.',
    positioning: productData.positioning || '',
    badge: productData.badge,
    categories: productData.categories || ['all', 'for-her', 'for-him', 'besties'],
    themeIds: productData.themeIds || ['valentine-box', 'anniversary'],
    idealFor: productData.idealFor || 'Special moments and sweet gestures.',
    packaging: productData.packaging || 'Thoughtfully styled gift presentation with ribbon and personal touches.',
    accentColor: productData.accentColor || '#C73858',
    illustrationType: productData.illustrationType || 'loved-box',
    customImage: productData.customImage,
    allowRecipientChoice: !!productData.allowRecipientChoice,
    stockStatus: productData.stockStatus || 'available',
    isFeatured: !!productData.isFeatured,
  };

  db.products.push(newProduct);
  saveDb(db);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const db = getDb();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.products[index] = {
    ...db.products[index],
    ...updates,
    id, // Preserve ID
    price: updates.price !== undefined ? Number(updates.price) : db.products[index].price,
  };

  saveDb(db);
  return db.products[index];
}

export function updateProductStock(id: string, stockStatus: StockStatus): Product | null {
  const db = getDb();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.products[index].stockStatus = stockStatus;
  saveDb(db);
  return db.products[index];
}

export function deleteProduct(id: string): boolean {
  const db = getDb();
  const originalLength = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length !== originalLength) {
    saveDb(db);
    return true;
  }
  return false;
}

// ================= THEME REPOSITORY =================

export function getAllThemes(): ThemeCategory[] {
  return getDb().themes;
}

export function updateTheme(id: string, updates: Partial<ThemeCategory>): ThemeCategory | null {
  const db = getDb();
  const index = db.themes.findIndex((t) => t.id === id || t.slug === id);
  if (index === -1) return null;

  db.themes[index] = {
    ...db.themes[index],
    ...updates,
  };

  saveDb(db);
  return db.themes[index];
}

// ================= ADDON REPOSITORY =================

export function getAllAddons(): AddOnItem[] {
  return getDb().addons;
}

export function createAddon(addonData: Partial<AddOnItem>): AddOnItem {
  const db = getDb();
  const id = addonData.id || `addon-${Date.now()}`;

  const newAddon: AddOnItem = {
    id,
    name: addonData.name || 'New Add-on',
    category: addonData.category || 'Cute Extras',
    price: Number(addonData.price) || 49,
    description: addonData.description || '',
    isAvailable: addonData.isAvailable !== undefined ? addonData.isAvailable : true,
    illustrationType: addonData.illustrationType || 'mini-keepsake',
    customImage: addonData.customImage,
  };

  db.addons.push(newAddon);
  saveDb(db);
  return newAddon;
}

export function updateAddon(id: string, updates: Partial<AddOnItem>): AddOnItem | null {
  const db = getDb();
  const index = db.addons.findIndex((a) => a.id === id);
  if (index === -1) return null;

  db.addons[index] = {
    ...db.addons[index],
    ...updates,
    id,
    price: updates.price !== undefined ? Number(updates.price) : db.addons[index].price,
  };

  saveDb(db);
  return db.addons[index];
}

export function deleteAddon(id: string): boolean {
  const db = getDb();
  const originalLength = db.addons.length;
  db.addons = db.addons.filter((a) => a.id !== id);
  if (db.addons.length !== originalLength) {
    saveDb(db);
    return true;
  }
  return false;
}

// ================= OFFERS REPOSITORY =================

export function getAllOffers(): Offer[] {
  return getDb().offers;
}

export function getActiveOffers(): Offer[] {
  return getDb().offers.filter((o) => o.isActive);
}

export function createOffer(offerData: Partial<Offer>): Offer {
  const db = getDb();
  const id = offerData.id || `offer-${Date.now()}`;

  const newOffer: Offer = {
    id,
    title: offerData.title || 'Promotional Offer',
    code: (offerData.code || 'DILSYLOVE').toUpperCase().trim(),
    description: offerData.description || '',
    discountType: offerData.discountType === 'percent' ? 'percent' : 'flat',
    discountValue: Math.max(0, Number(offerData.discountValue) || 10),
    minOrderAmount: Math.max(0, Number(offerData.minOrderAmount) || 0),
    startDate: offerData.startDate,
    endDate: offerData.endDate,
    isActive: offerData.isActive !== undefined ? offerData.isActive : true,
    badgeText: offerData.badgeText || 'SPECIAL OFFER',
  };

  db.offers.push(newOffer);
  saveDb(db);
  return newOffer;
}

export function updateOffer(id: string, updates: Partial<Offer>): Offer | null {
  const db = getDb();
  const index = db.offers.findIndex((o) => o.id === id);
  if (index === -1) return null;

  db.offers[index] = {
    ...db.offers[index],
    ...updates,
    id,
    discountValue:
      updates.discountValue !== undefined
        ? Math.max(0, Number(updates.discountValue))
        : db.offers[index].discountValue,
    minOrderAmount:
      updates.minOrderAmount !== undefined
        ? Math.max(0, Number(updates.minOrderAmount))
        : db.offers[index].minOrderAmount,
  };

  saveDb(db);
  return db.offers[index];
}

export function deleteOffer(id: string): boolean {
  const db = getDb();
  const originalLength = db.offers.length;
  db.offers = db.offers.filter((o) => o.id !== id);
  if (db.offers.length !== originalLength) {
    saveDb(db);
    return true;
  }
  return false;
}

// ================= SETTINGS REPOSITORY =================

export function getSettings(): StoreSettings {
  return getDb().settings;
}

export function updateSettings(updates: Partial<StoreSettings>): StoreSettings {
  const db = getDb();
  db.settings = {
    ...db.settings,
    ...updates,
    announcement: {
      ...db.settings.announcement,
      ...(updates.announcement || {}),
    },
  };
  saveDb(db);
  return db.settings;
}

// ================= ORDERS REPOSITORY =================

export function getAllOrders(): OrderRequest[] {
  return getDb().orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createOrderRequest(orderData: Partial<OrderRequest>): OrderRequest {
  const db = getDb();
  const id = `DILSY-${Date.now().toString().slice(-6)}`;

  const order: OrderRequest = {
    id,
    createdAt: new Date().toISOString(),
    source: orderData.source || 'cart',
    customerName: orderData.customerName || 'Anonymous Gifting Inquiry',
    customerPhone: orderData.customerPhone || '',
    deliveryArea: orderData.deliveryArea || 'Chandigarh University',
    specificLandmark: orderData.specificLandmark || '',
    deliveryDate: orderData.deliveryDate || 'As discussed on WhatsApp',
    timeWindow: orderData.timeWindow || 'Standard Day Delivery',
    items: orderData.items || [],
    addOns: orderData.addOns || [],
    appliedOffer: orderData.appliedOffer || null,
    subtotal: Number(orderData.subtotal) || 0,
    discountAmount: Number(orderData.discountAmount) || 0,
    total: Number(orderData.total) || 0,
    specialInstructions: orderData.specialInstructions || '',
    status: 'Pending',
    adminNotes: '',
    rawWhatsappMessage: orderData.rawWhatsappMessage || '',
  };

  db.orders.unshift(order);
  saveDb(db);
  return order;
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
  adminNotes?: string
): OrderRequest | null {
  const db = getDb();
  const index = db.orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  db.orders[index].status = status;
  if (adminNotes !== undefined) {
    db.orders[index].adminNotes = adminNotes;
  }

  saveDb(db);
  return db.orders[index];
}

// ================= IMAGE UPLOAD REPOSITORY =================

export function saveUploadedImage(base64Data: string, originalFilename?: string): string {
  ensureDirectories();

  // Strip header data:image/png;base64, if present
  let cleanData = base64Data;
  let extension = 'jpg';

  const matches = base64Data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (matches) {
    extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    cleanData = matches[2];
  } else if (originalFilename) {
    const ext = path.extname(originalFilename).replace('.', '');
    if (ext) extension = ext;
  }

  const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
  const filePath = path.join(UPLOADS_DIR, filename);

  fs.writeFileSync(filePath, Buffer.from(cleanData, 'base64'));
  return `/api/uploads/${filename}`;
}
