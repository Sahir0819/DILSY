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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-[#FFFCFD] h-full shadow-2xl flex flex-col justify-between border-l border-[#FFCCD5] animate-in slide-in-from-right duration-300">
        {/* Drawer Header with Romantic Accent */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#FFF0F4] via-[#FFEBF0] to-[#FFF5F8] border-b border-[#FFCCD5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#99223A]" />
            <h2 className="font-serif font-bold text-xl text-[#2D1B22]">
              {checkoutStep === 'cart' ? 'Your Shopping Bag' : 'Delivery & Coordination'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close bag drawer"
            className="p-1 rounded-md text-[#7A1E31] hover:bg-[#FFE5EC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FFE5EC] border border-[#FFCCD5] flex items-center justify-center text-[#99223A]">
                <ShoppingBag className="w-8 h-8 opacity-80" />
              </div>
              <p className="text-sm text-[#4D2D37] font-medium">Your shopping bag is currently empty.</p>
              <button
                onClick={() => {
                  onClose();
                  onBrowseProducts();
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-[#99223A] to-[#801B30] text-[#FFF0F3] rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Explore Curated Hampers
              </button>
            </div>
          ) : checkoutStep === 'cart' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8D0D6]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6B424E]">
                  Hampers ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-xs text-[#99223A] hover:underline cursor-pointer"
                >
                  Clear Bag
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-white border border-[#E8C2CC] shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-base text-[#2D1B22]">
                          {item.product.name}
                        </h4>
                        <span className="text-[10px] font-sans font-semibold text-[#7A1E31] bg-[#FFF0F4] px-1.5 py-0.5 rounded border border-[#FFCCD5]">
                          {item.product.size}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#99223A] mt-0.5 tabular-nums">
                        ₹{item.product.price.toLocaleString('en-IN')} each
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#8C6B75] hover:text-[#991B1B] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Personalisation details */}
                  {(item.customisation.recipientName ||
                    item.customisation.recipientChoice ||
                    item.customisation.personalNote) && (
                    <div className="p-2.5 rounded-lg bg-[#FAF0F3] border border-[#FFCCD5] text-[11px] text-[#4D2D37] space-y-0.5">
                      {item.customisation.recipientChoice && (
                        <div>• Selection: {item.customisation.recipientChoice}</div>
                      )}
                      {item.customisation.recipientName && (
                        <div>• For: {item.customisation.recipientName}</div>
                      )}
                      {item.customisation.personalNote && (
                        <div className="italic line-clamp-2">
                          • Card: "{item.customisation.personalNote}"
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 border border-[#E8C2CC] rounded-lg px-2 py-1 bg-[#FAF7F2]">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="text-[#6B3241] hover:text-[#99223A] p-0.5 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-semibold tabular-nums px-2">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="text-[#6B3241] hover:text-[#99223A] p-0.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-semibold text-sm text-[#2D1B22] tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="text-xs text-[#99223A] font-semibold flex items-center gap-1 hover:underline cursor-pointer mb-2"
              >
                ← Back to Review Items
              </button>

              {validationError && (
                <div className="p-3 bg-[#FFF0F3] border border-[#FFCCD5] rounded-xl text-xs text-[#801B30] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#3D141C] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={delivery.customerName}
                    onChange={(e) => setDelivery({ ...delivery, customerName: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 bg-white border border-[#E8C2CC] rounded-lg text-xs text-[#2D1B22] outline-none focus:ring-1 focus:ring-[#99223A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D141C] mb-1">
                    Your Contact Phone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={delivery.customerPhone}
                    onChange={(e) => setDelivery({ ...delivery, customerPhone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 bg-white border border-[#E8C2CC] rounded-lg text-xs text-[#2D1B22] outline-none focus:ring-1 focus:ring-[#99223A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D141C] mb-1">
                    Delivery Area
                  </label>
                  <select
                    value={delivery.deliveryArea}
                    onChange={(e) => setDelivery({ ...delivery, deliveryArea: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E8C2CC] rounded-lg text-xs text-[#2D1B22] outline-none"
                  >
                    {settings.deliveryAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#3D141C] mb-1">
                    Specific Hostel / PG / Flat / Landmark
                  </label>
                  <input
                    type="text"
                    value={delivery.specificLandmark}
                    onChange={(e) => setDelivery({ ...delivery, specificLandmark: e.target.value })}
                    placeholder="e.g. NC4 Hostel, Gate 2, or Sunny Enclave Flat"
                    className="w-full px-3 py-2 bg-white border border-[#E8C2CC] rounded-lg text-xs text-[#2D1B22] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#3D141C] mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={delivery.deliveryDate}
                      onChange={(e) => setDelivery({ ...delivery, deliveryDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#E8C2CC] rounded-lg text-xs text-[#2D1B22] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3D141C] mb-1">
                      Preferred Time Window
                    </label>
                    <select
                      value={delivery.timeWindow}
                      onChange={(e) => setDelivery({ ...delivery, timeWindow: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#E8C2CC] rounded-lg text-xs text-[#2D1B22] outline-none"
                    >
                      {settings.timeWindows.map((win) => (
                        <option key={win} value={win}>
                          {win}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#3D141C] mb-1">
                    Additional Notes for Handover
                  </label>
                  <input
                    type="text"
                    value={delivery.additionalNotes || ''}
                    onChange={(e) => setDelivery({ ...delivery, additionalNotes: e.target.value })}
                    placeholder="e.g. Please call before arriving, keep it a surprise"
                    className="w-full px-3 py-2 bg-white border border-[#E8C2CC] rounded-lg text-xs text-[#2D1B22] outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer with Calculations & Exact Delivery Policy */}
        {items.length > 0 && (
          <div className="p-6 bg-gradient-to-t from-[#FFF0F4] to-[#FFF8FA] border-t border-[#FFCCD5] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#52333D]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-sm text-[#2D1B22] tabular-nums">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {discountAmount > 0 && appliedOffer && (
                <div className="flex items-center justify-between text-[#2D6A4F] font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Promo ({appliedOffer.code})</span>
                  </span>
                  <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-[#FFCCD5]">
                <span className="font-serif font-bold text-sm text-[#2D1B22]">Order Total</span>
                <span className="font-serif font-bold text-base text-[#99223A] tabular-nums">
                  ₹{finalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#6B424E] text-[11px]">
                <span>Delivery Charges</span>
                <span>Calculated via WhatsApp based on exact PG/Campus spot</span>
              </div>
            </div>

            {/* Exact Delivery Policy Quote */}
            <div className="p-3 bg-white border border-[#FFCCD5] rounded-xl text-[10px] text-[#52333D] leading-tight shadow-2xs">
              <span className="font-semibold text-[#99223A] block mb-0.5">Delivery Policy:</span>
              "{EXACT_DELIVERY_POLICY}"
            </div>

            {/* Action Buttons */}
            {checkoutStep === 'cart' ? (
              <button
                type="button"
                onClick={handleProceedToDelivery}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#99223A] via-[#A82841] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#99223A]/25 cursor-pointer"
              >
                <span>Continue to Delivery & Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Review & Order on WhatsApp (+91 {settings.whatsappPhone})</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
