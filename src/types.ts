export interface ThemeCategory {
  id: string;
  name: string;
  description: string;
  visualDirection: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  badge: string;
  linkedProductIds: string[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  description: string;
  categories: Array<'all' | 'for-him' | 'for-her' | 'besties'>;
  themeIds: string[];
  idealFor: string;
  itemsOverview: string[];
  packaging: string;
  accentColor: string;
  illustrationType: 'little-affair' | 'dilsy-edit' | 'everything-box';
}

export interface ProductCustomisation {
  recipientName: string;
  personalNote: string;
  polaroidCaption?: string;
  specialInstructions?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customisation: ProductCustomisation;
}

export interface DeliveryDetails {
  customerName: string;
  customerPhone: string;
  deliveryArea: string;
  specificLandmark: string;
  deliveryDate: string;
  timeWindow: string;
  additionalNotes?: string;
}

export interface CustomHamperForm {
  recipientType: string;
  occasion: string;
  budget: string; // '₹999' | '₹1,249' | '₹1,499' | 'Custom Budget'
  customBudgetAmount?: string;
  giftCategories: string[];
  recipientName: string;
  personalNote: string;
  packagingStyle: string;
  specialInstructions: string;
  deliveryArea: string;
  specificLandmark: string;
  deliveryDate: string;
  timeWindow: string;
  customerName: string;
  customerPhone: string;
}
