import React, { useState } from 'react';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  EyeOff,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { Product, StockStatus } from '../types';
import { ProductArtwork } from '../components/ProductArtwork';

interface AdminStockManagerProps {
  products: Product[];
  onQuickStockChange: (id: string, stock: StockStatus) => Promise<void>;
}

export const AdminStockManager: React.FC<AdminStockManagerProps> = ({
  products,
  onQuickStockChange,
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: StockStatus) => {
    try {
      setUpdatingId(id);
      await onQuickStockChange(id, status);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOptions: Array<{
    id: StockStatus;
    label: string;
    description: string;
    colorClasses: string;
  }> = [
    {
      id: 'available',
      label: 'Available (In Stock)',
      description: 'Purchasable by customers with active Add to Bag & WhatsApp ordering.',
      colorClasses: 'bg-[#EBF7EE] text-[#1B4332] border-[#B7E4C7]',
    },
    {
      id: 'out_of_stock',
      label: 'Out of Stock',
      description: 'Displays "OUT OF STOCK" badge on customer site and disables checkout.',
      colorClasses: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
    },
    {
      id: 'coming_soon',
      label: 'Coming Soon',
      description: 'Displays "COMING SOON" badge, visible on site but orders are disabled.',
      colorClasses: 'bg-[#F3E8FF] text-[#581C87] border-[#E9D5FF]',
    },
    {
      id: 'unpublished',
      label: 'Unpublished',
      description: 'Hidden entirely from customer listings and search.',
      colorClasses: 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Overview Info Banner */}
      <div className="p-5 rounded-2xl bg-[#FAF0F3] border border-[#E8C2CC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFE5EC] border border-[#FFCCD5] flex items-center justify-center text-[#99223A] shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#2D1B22]">Rapid Inventory & Availability Control</h3>
            <p className="text-xs text-[#6B424E] mt-0.5">
              Instantly toggle item availability across your storefront. Marking an item "Out of Stock" immediately displays a customer badge and disables Add to Bag to prevent accidental orders.
            </p>
          </div>
        </div>

        <div className="text-xs text-[#801B30] font-medium bg-white/70 px-3 py-1.5 rounded-xl border border-[#FFCCD5] shrink-0">
          💡 For Him collection is currently <strong>Coming Soon</strong>
        </div>
      </div>

      {/* Hampers Stock List */}
      <div className="bg-white rounded-2xl border border-[#E8D0D6] shadow-xs overflow-hidden divide-y divide-[#F2E4E8]">
        {products.map((product) => {
          const currentStatus = product.stockStatus || 'available';

          return (
            <div
              key={product.id}
              className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-[#FCF9F7] transition-colors"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 min-w-[280px]">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF0F3] border border-[#E8C2CC] overflow-hidden flex items-center justify-center shrink-0">
                  {product.customImage ? (
                    <img
                      src={product.customImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ProductArtwork
                      type={product.illustrationType}
                      className="w-9 h-9 object-contain"
                    />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-base text-[#2D1B22]">
                      {product.name}
                    </h4>
                    <span className="text-[10px] font-sans font-semibold text-[#4D2D37] bg-[#FAF0F3] px-2 py-0.5 rounded-md border border-[#E8C2CC]">
                      {product.size}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#99223A] mt-0.5 tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-[#7A4E5A] line-clamp-1 max-w-sm mt-0.5">
                    {product.tagline}
                  </p>
                </div>
              </div>

              {/* Status Selector Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {statusOptions.map((opt) => {
                  const isSelected = currentStatus === opt.id;
                  const isBusy = updatingId === product.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleStatusChange(product.id, opt.id)}
                      disabled={isBusy}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                        isSelected
                          ? `${opt.colorClasses} ring-2 ring-offset-1 ring-[#99223A]/30 shadow-xs font-bold`
                          : 'bg-white text-[#6B424E] border-[#E8D0D6] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      ) : opt.id === 'available' ? (
                        <CheckCircle className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
                      ) : opt.id === 'out_of_stock' ? (
                        <AlertCircle className="w-3.5 h-3.5 text-[#C84B31] shrink-0" />
                      ) : opt.id === 'coming_soon' ? (
                        <Clock className="w-3.5 h-3.5 text-[#6D28D9] shrink-0" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
                      )}
                      <span>{opt.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
