export interface ThemeCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  visualDirection: string;
  heroHeadline?: string;
  heroStory?: string;
  giftingTips?: string[];
  accentBg: string;
  accentBorder: string;
  accentText: string;
  badge: string;
  linkedProductIds: string[];
  relatedThemeIds?: string[];
  isComingSoon?: boolean;
  comingSoonMessage?: string;
}

export type BoxSize = 'Small' | 'Medium' | 'Large';

export interface Product {
  id: string;
  name: string;
  size: BoxSize;
  tagline: string;
  price: number;
  description: string;
  positioning?: string;
  badge?: string;
  categories: Array<'all' | 'for-him' | 'for-her' | 'besties'>;
  themeIds: string[];
  idealFor: string;
  itemsOverview: string[];
  packaging: string;
  accentColor: string;
  illustrationType: 'loved-box' | 'little-affair' | 'dilsy-edit' | 'everything-box';
  allowRecipientChoice?: boolean;
}

export interface ProductCustomisation {
  recipientName: string;
  recipientChoice?: 'For Him' | 'For Her';
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

export type AddOnCategory = 'Flowers' | 'Chocolates & Treats' | 'Cute Extras';

export interface AddOnItem {
  id: string;
  name: string;
  category: AddOnCategory;
  price: number;
  description?: string;
  isAvailable: boolean;
  illustrationType:
    | 'single-rose'
    | 'small-rose-bunch'
    | 'chocolate-treat'
    | 'assorted-chocolate'
    | 'gourmet-snack'
    | 'cookies-brownie'
    | 'photo-print'
    | 'cute-keychain'
    | 'greeting-card'
    | 'mini-keepsake';
}

export interface SelectedAddOn {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomHamperForm {
  recipientType: string;
  occasion: string;
  budget: string; // 'Small Box — ₹799' | 'Medium Box — ₹969' | 'Large Box — ₹1,199' | 'Custom Budget'
  customBudgetAmount?: string;
  selectedAddOns: SelectedAddOn[];
  giftCategories?: string[];
  recipientName: string;
  personalNote: string;
  packagingStyle?: string;
  specialInstructions: string;
  deliveryArea: string;
  specificLandmark: string;
  deliveryDate: string;
  timeWindow: string;
  customerName: string;
  customerPhone: string;
}

