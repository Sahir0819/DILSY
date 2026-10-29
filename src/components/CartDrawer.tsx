import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, AlertCircle, MapPin, Phone, User, Calendar, Clock, Tag } from 'lucide-react';
import { CartItem, DeliveryDetails } from '../types';
import { EXACT_DELIVERY_POLICY, generateCartWhatsAppMessage } from '../utils/whatsapp';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenReviewModal: (title: string, message: string) => void;
  onBrowseProducts: () => void;
  onNavigateToCartPage?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenReviewModal,
  onBrowseProducts,
  onNavigateToCartPage,
}) => {
  const { settings, calculateDiscount, recordOrderInquiry } = useStore();

  const [delivery, setDelivery] = useState<DeliveryDetails>({
    customerName: '',
    customerPhone: '',
    deliveryArea: settings.deliveryAreas[0] || 'Chandigarh University (North & South Gate)',
    specificLandmark: '',
    deliveryDate: '',
    timeWindow: settings.timeWindows[0] || 'Afternoon (12:00 PM – 4:00 PM)',
    additionalNotes: '',
  });

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'delivery'>('cart');
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const { discountAmount, finalAmount, appliedOffer } = calculateDiscount(subtotal);

  const handleProceedToDelivery = () => {
    if (items.length === 0) return;
    setCheckoutStep('delivery');
  };

  const handleCheckoutWhatsApp = async () => {
    if (!delivery.customerName.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!delivery.customerPhone.trim() || delivery.customerPhone.trim().length < 8) {
      setValidationError('Please enter a valid phone number for WhatsApp coordination.');
      return;
    }
    setValidationError('');

    const discountInfo = appliedOffer
      ? { code: appliedOffer.code, amount: discountAmount, total: finalAmount }
      : null;

    const message = generateCartWhatsAppMessage(items, subtotal, delivery, discountInfo);

    // Record inquiry to persistent backend
    recordOrderInquiry({
      source: 'cart',
      customerName: delivery.customerName,
      customerPhone: delivery.customerPhone,
      deliveryArea: delivery.deliveryArea,
      specificLandmark: delivery.specificLandmark,
      deliveryDate: delivery.deliveryDate,
      timeWindow: delivery.timeWindow,
      items: items.map((i) => ({
        title: `${i.product.name} (${i.product.size})`,
        quantity: i.quantity,
        price: i.product.price,
        customisation: i.customisation as any,
      })),
      subtotal,
      discountAmount,
      total: finalAmount,
      appliedOffer: appliedOffer
        ? { code: appliedOffer.code, title: appliedOffer.title, discountAmount }
        : null,
      specialInstructions: delivery.additionalNotes,
      rawWhatsappMessage: message,
    });

    onOpenReviewModal('Confirm Bag Order via WhatsApp', message);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#EADBDB] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#EADBDB] flex items-center justify-between bg-[#FAF7F5]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#3E101D]" />
            <h3 className="font-serif text-lg text-[#2A0D15]">
              {checkoutStep === 'cart' ? 'Shopping Bag' : 'Delivery & Recipient Details'}
            </h3>
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
                  Discover our official curated hampers or design your own personalized gift box.
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
          ) : checkoutStep === 'cart' ? (
            <div className="space-y-4">
              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#FAF7F5] border border-[#EADBDB] flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#3E101D] bg-white px-2 py-0.5 border border-[#EADBDB]">
                          Size: {item.product.size}
                        </span>
                        {item.customisation.recipientChoice && (
                          <span className="text-[10px] font-medium text-[#7A5A63] bg-white px-2 py-0.5 border border-[#EADBDB]">
                            {item.customisation.recipientChoice}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-base text-[#2A0D15] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs font-serif font-medium text-[#3E101D] mt-0.5">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </p>

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
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#7A5A63] hover:text-[#3E101D] p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

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
                ))}
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
          ) : (
            <div className="space-y-4">
              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2A0D15] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={delivery.customerName}
                    onChange={(e) => setDelivery({ ...delivery, customerName: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:border-[#3E101D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2A0D15] mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={delivery.customerPhone}
                    onChange={(e) => setDelivery({ ...delivery, customerPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:border-[#3E101D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2A0D15] mb-1">
                    Delivery Area (CU & Mohali)
                  </label>
                  <select
                    value={delivery.deliveryArea}
                    onChange={(e) => setDelivery({ ...delivery, deliveryArea: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:border-[#3E101D] outline-none"
                  >
                    {settings.deliveryAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2A0D15] mb-1">
                    Specific Landmark / Hostel / PG
                  </label>
                  <input
                    type="text"
                    value={delivery.specificLandmark}
                    onChange={(e) => setDelivery({ ...delivery, specificLandmark: e.target.value })}
                    placeholder="e.g. CU South Gate, Sunny Enclave PG 2"
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:border-[#3E101D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2A0D15] mb-1">
                    Preferred Delivery Date
                  </label>
                  <input
                    type="date"
                    value={delivery.deliveryDate}
                    onChange={(e) => setDelivery({ ...delivery, deliveryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:border-[#3E101D] outline-none"
                  />
                </div>
              </div>
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
              {appliedOffer && (
                <div className="flex justify-between text-[#3E101D]">
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

            {checkoutStep === 'cart' ? (
              <button
                onClick={handleProceedToDelivery}
                className="w-full py-3.5 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Delivery & Notes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full py-3.5 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Review & Send WhatsApp Order</span>
                </button>
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="w-full py-2 text-center text-xs text-[#7A5A63] hover:text-[#2A0D15] cursor-pointer"
                >
                  ← Return to Bag Items
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
