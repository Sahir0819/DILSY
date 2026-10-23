import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Product,
  ThemeCategory,
  AddOnItem,
  Offer,
  StoreSettings,
  OrderRequest,
} from '../types';
import { PRODUCTS, SERVICE_AREAS, TIME_WINDOWS } from '../data/products';
import { THEME_CATEGORIES } from '../data/themes';
import { ADD_ONS } from '../data/addons';
import { EXACT_DELIVERY_POLICY, WHATSAPP_PHONE_RAW, WHATSAPP_PHONE_INTERNATIONAL } from '../utils/whatsapp';
import { fetchPublicStoreData, submitPublicOrderInquiry } from '../utils/api';

interface StoreContextValue {
  products: Product[];
  themes: ThemeCategory[];
  addons: AddOnItem[];
  offers: Offer[];
  settings: StoreSettings;
  activeOffer: Offer | null;
  calculateDiscount: (amount: number) => { discountAmount: number; finalAmount: number; appliedOffer: Offer | null };
  recordOrderInquiry: (orderData: Partial<OrderRequest>) => Promise<string | null>;
  refreshStoreData: () => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: StoreSettings = {
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

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() =>
    PRODUCTS.map((p) => ({ ...p, stockStatus: 'available' }))
  );
  const [themes, setThemes] = useState<ThemeCategory[]>(THEME_CATEGORIES);
  const [addons, setAddons] = useState<AddOnItem[]>(ADD_ONS);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchPublicStoreData();
      if (data && data.success) {
        if (data.products?.length) setProducts(data.products);
        if (data.themes?.length) setThemes(data.themes);
        if (data.addons?.length) setAddons(data.addons);
        if (data.offers) setOffers(data.offers);
        if (data.settings) setSettings(data.settings);
      }
    } catch {
      // Graceful fallback to initial bundled data
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Find the most beneficial active offer
  const activeOffer = offers.find((o) => o.isActive) || null;

  const calculateDiscount = useCallback(
    (amount: number) => {
      if (!activeOffer || amount < activeOffer.minOrderAmount) {
        return { discountAmount: 0, finalAmount: amount, appliedOffer: null };
      }

      let discount = 0;
      if (activeOffer.discountType === 'percent') {
        discount = Math.round((amount * activeOffer.discountValue) / 100);
      } else {
        discount = activeOffer.discountValue;
      }

      // Safeguard: Ensure discount never exceeds total or creates negative price
      discount = Math.min(discount, Math.max(0, amount - 1));
      const finalAmount = Math.max(1, amount - discount);

      return {
        discountAmount: discount,
        finalAmount,
        appliedOffer: activeOffer,
      };
    },
    [activeOffer]
  );

  const recordOrderInquiry = useCallback(async (orderData: Partial<OrderRequest>): Promise<string | null> => {
    try {
      const res = await submitPublicOrderInquiry(orderData);
      return res.orderId;
    } catch {
      return null;
    }
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products,
        themes,
        addons,
        offers,
        settings,
        activeOffer,
        calculateDiscount,
        recordOrderInquiry,
        refreshStoreData: loadData,
        isLoading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
