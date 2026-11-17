import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { CartItem } from '../types';
import { useStore } from '../context/StoreContext';
import { CartCheckoutModal } from './CartCheckoutModal';
import { getCartItemSubtotal, getCartItemUnitPrice } from '../utils/cart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenReviewModal?: (title: string, message: string) => void;
  onBrowseProducts: () => void;
  onNavigateToCartPage?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onBrowseProducts,
  onNavigateToCartPage,
}) => {
  const { calculateDiscount } = useStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen && !isCheckoutOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + getCartItemSubtotal(item), 0);
  const { discountAmount, finalAmount, appliedOffer } = calculateDiscount(subtotal);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#EADBDB] animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#EADBDB] flex items-center justify-between bg-[#FAF7F5]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#3E101D]" />
                <h3 className="font-serif text-lg text-[#2A0D15]">Shopping Bag</h3>
                <span className="text-[10px] bg-white text-[#3E101D] px-2 py-0.5 font-semibold border border-[#EADBDB]">
                  {items.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close cart"
                className="p-1 text-[#7A5A63] hover:text-[#2A0D15] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <div className="w-16 h-16 bg-[#FAF7F5] border border-[#EADBDB] flex items-center justify-center text-[#3E101D]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-serif text-lg text-[#2A0D15]">Your bag is empty</p>
                    <p className="text-xs text-[#7A5A63] mt-1 max-w-xs font-light">
                      Discover our curated occasion hampers or design your own personalized gift
                      box.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onBrowseProducts();
                    }}
                    className="px-6 py-3 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer"
                  >
                    Explore Hampers
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Items List */}
                  <div className="space-y-3">
                    {items.map((item) => {
                      const size = item.selectedSize || item.product.size;
                      const unitPrice = getCartItemUnitPrice(item);
                      const itemSubtotal = getCartItemSubtotal(item);

                      return (
                        <div
                          key={item.id}
                          className="p-4 bg-[#FAF7F5] border border-[#EADBDB] flex items-start justify-between gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-base text-[#2A0D15] truncate">
                              {item.product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#3E101D] bg-white px-2 py-0.5 border border-[#EADBDB]">
                                Size: {size}
                              </span>
                              <span className="text-xs font-serif font-medium text-[#3E101D] tabular-nums">
                                ₹{unitPrice.toLocaleString('en-IN')}
                              </span>
                            </div>

                            {item.customisation.recipientName && (
                              <p className="text-[11px] text-[#2A0D15] mt-1 truncate">
                                <strong>For:</strong> {item.customisation.recipientName}
                              </p>
                            )}
                            {item.customisation.personalNote && (
                              <p className="text-[10px] text-[#7A5A63] italic line-clamp-1 mt-0.5">
                                "{item.customisation.personalNote}"
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-[#2A0D15] tabular-nums">
                                ₹{itemSubtotal.toLocaleString('en-IN')}
                              </span>
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="text-[#7A5A63] hover:text-[#3E101D] p-1 cursor-pointer"
                                title="Remove"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5 bg-white p-1 border border-[#EADBDB]">
                              <button
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="p-1 text-[#7A5A63] hover:text-[#3E101D] cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-medium text-[#2A0D15] px-1 tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="p-1 text-[#7A5A63] hover:text-[#3E101D] cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {onNavigateToCartPage && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToCartPage();
                      }}
                      className="w-full py-2 text-center text-xs text-[#3E101D] hover:text-[#2A0D15] uppercase tracking-wider font-semibold cursor-pointer"
                    >
                      View Full Bag Details →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#EADBDB] bg-[#FAF7F5] space-y-4">
                <div className="space-y-1.5 text-xs text-[#7A5A63]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-[#2A0D15] tabular-nums">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {appliedOffer && discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-800">
                      <span>Discount ({appliedOffer.code}):</span>
                      <span className="font-semibold tabular-nums">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#EADBDB] text-sm">
                    <span className="font-serif text-[#2A0D15] text-base">Estimated Total:</span>
                    <span className="font-serif font-medium text-2xl text-[#3E101D] tabular-nums">
                      ₹{finalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Proceed to WhatsApp Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <CartCheckoutModal
        isOpen={isCheckoutOpen}
        items={items}
        subtotal={subtotal}
        discountAmount={discountAmount}
        finalAmount={finalAmount}
        appliedOffer={appliedOffer}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
};
