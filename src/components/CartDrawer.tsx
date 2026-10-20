import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, AlertCircle, MapPin, Phone, User, Calendar, Clock } from 'lucide-react';
import { CartItem, DeliveryDetails } from '../types';
import { EXACT_DELIVERY_POLICY, generateCartWhatsAppMessage } from '../utils/whatsapp';
import { SERVICE_AREAS, TIME_WINDOWS } from '../data/products';

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
  const [delivery, setDelivery] = useState<DeliveryDetails>({
    customerName: '',
    customerPhone: '',
    deliveryArea: 'Chandigarh University (North & South Gate)',
    specificLandmark: '',
    deliveryDate: '',
    timeWindow: 'Afternoon (12:00 PM – 4:00 PM)',
    additionalNotes: '',
  });

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'delivery'>('cart');
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleProceedToDelivery = () => {
    if (items.length === 0) return;
    setCheckoutStep('delivery');
  };

  const handleCheckoutWhatsApp = () => {
    if (!delivery.customerName.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!delivery.customerPhone.trim() || delivery.customerPhone.trim().length < 8) {
      setValidationError('Please enter a valid phone number for WhatsApp coordination.');
      return;
    }
    setValidationError('');

    const message = generateCartWhatsAppMessage(items, subtotal, delivery);
    onOpenReviewModal('Confirm Bag Order via WhatsApp', message);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between border-l border-[#2A1E1A]/10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-[#F5EFEB] border-b border-[#2A1E1A]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8C5A4F]" />
            <h2 className="font-serif font-bold text-xl text-[#2A1E1A]">
              {checkoutStep === 'cart' ? 'Your Shopping Bag' : 'Delivery & Coordination'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close bag drawer"
            className="p-1 rounded-md text-[#4A352F] hover:bg-[#EAE0D6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EAE0D6] flex items-center justify-center text-[#8C5A4F]">
                <ShoppingBag className="w-8 h-8 opacity-70" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#2A1E1A]">Your bag is empty</h3>
              <p className="text-sm text-[#4A352F]/80 max-w-xs font-light">
                Discover our signature launch hampers or build a custom hamper for someone special.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBrowseProducts();
                }}
                className="mt-2 px-6 py-2.5 bg-[#2A1E1A] text-white rounded-lg text-xs font-semibold hover:bg-[#3D2C26] transition-colors"
              >
                Browse Launch Hampers
              </button>
            </div>
          ) : checkoutStep === 'cart' ? (
            /* Items List View */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#4A352F] pb-2 border-b border-[#2A1E1A]/10">
                <span>{items.reduce((acc, i) => acc + i.quantity, 0)} Items Selected</span>
                <button
                  onClick={onClearCart}
                  className="text-red-700 hover:text-red-900 transition-colors"
                >
                  Clear Bag
                </button>
              </div>

              {items.map((item) => {
                const itemTotal = item.product.price * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-xl border border-[#2A1E1A]/10 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#2A1E1A]">
                          {item.product.name}
                        </h4>
                        <span className="text-xs text-[#8C5A4F] font-medium tabular-nums">
                          ₹{item.product.price.toLocaleString('en-IN')} each
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[#2A1E1A] tabular-nums">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Customisation Details */}
                    {(item.customisation.recipientName ||
                      item.customisation.personalNote ||
                      item.customisation.polaroidCaption) && (
                      <div className="p-2.5 bg-[#FAF7F2] rounded-lg text-xs space-y-1 border border-[#2A1E1A]/5">
                        {item.customisation.recipientName && (
                          <p className="text-[#2A1E1A]">
                            <strong className="font-medium text-[#4A352F]">For:</strong> {item.customisation.recipientName}
                          </p>
                        )}
                        {item.customisation.personalNote && (
                          <p className="text-[#4A352F] italic line-clamp-2">
                            "{item.customisation.personalNote}"
                          </p>
                        )}
                        {item.customisation.polaroidCaption && (
                          <p className="text-[#8C5A4F]">
                            Photo: {item.customisation.polaroidCaption}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Quantity Controls & Remove */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 border border-[#2A1E1A]/20 rounded-lg p-0.5 bg-[#FAF7F2]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center text-[#2A1E1A] hover:bg-[#EAE0D6] rounded"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold tabular-nums text-[#2A1E1A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center text-[#2A1E1A] hover:bg-[#EAE0D6] rounded"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        aria-label="Remove item"
                        className="text-neutral-400 hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Delivery Details Form View */
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="text-xs text-[#8C5A4F] hover:text-[#2A1E1A] font-medium flex items-center gap-1 mb-2"
              >
                ← Back to items
              </button>

              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#2A1E1A]/10 text-xs">
                <div>
                  <label className="block font-semibold text-[#2A1E1A] mb-1">
                    Your Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={delivery.customerName}
                    onChange={(e) => setDelivery({ ...delivery, customerName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#2A1E1A]/15 rounded-lg text-xs text-[#2A1E1A] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2A1E1A] mb-1">
                    Your Contact / WhatsApp Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={delivery.customerPhone}
                    onChange={(e) => setDelivery({ ...delivery, customerPhone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#2A1E1A]/15 rounded-lg text-xs text-[#2A1E1A] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2A1E1A] mb-1">
                    Delivery Area around CU / Mohali
                  </label>
                  <select
                    value={delivery.deliveryArea}
                    onChange={(e) => setDelivery({ ...delivery, deliveryArea: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#2A1E1A]/15 rounded-lg text-xs text-[#2A1E1A] outline-none"
                  >
                    {SERVICE_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#2A1E1A] mb-1">
                    Hostel / PG Name or Specific Address
                  </label>
                  <input
                    type="text"
                    value={delivery.specificLandmark}
                    onChange={(e) => setDelivery({ ...delivery, specificLandmark: e.target.value })}
                    placeholder="e.g. NC-4 Hostel, Green PG Gharuan, Sector 70 Mohali"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#2A1E1A]/15 rounded-lg text-xs text-[#2A1E1A] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-[#2A1E1A] mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={delivery.deliveryDate}
                      onChange={(e) => setDelivery({ ...delivery, deliveryDate: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#2A1E1A]/15 rounded-lg text-xs text-[#2A1E1A] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2A1E1A] mb-1">
                      Time Slot
                    </label>
                    <select
                      value={delivery.timeWindow}
                      onChange={(e) => setDelivery({ ...delivery, timeWindow: e.target.value })}
                      className="w-full px-2 py-1.5 bg-[#FAF7F2] border border-[#2A1E1A]/15 rounded-lg text-xs text-[#2A1E1A] outline-none"
                    >
                      {TIME_WINDOWS.map((win) => (
                        <option key={win} value={win}>
                          {win}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#2A1E1A] mb-1">
                    Additional Notes for Handover
                  </label>
                  <input
                    type="text"
                    value={delivery.additionalNotes}
                    onChange={(e) => setDelivery({ ...delivery, additionalNotes: e.target.value })}
                    placeholder="e.g. Please call before arriving, keep it a total surprise"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#2A1E1A]/15 rounded-lg text-xs text-[#2A1E1A] outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer with Calculations & Exact Delivery Policy */}
        {items.length > 0 && (
          <div className="p-6 bg-[#F5EFEB] border-t border-[#2A1E1A]/10 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#4A352F]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-sm text-[#2A1E1A] tabular-nums">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#4A352F]/70 text-[11px]">
                <span>Delivery Charges</span>
                <span>Calculated via WhatsApp based on exact PG/Campus spot</span>
              </div>
            </div>

            {/* Exact Delivery Policy Quote */}
            <div className="p-3 bg-[#FAF7F2] border border-[#2A1E1A]/10 rounded-xl text-[10px] text-[#4A352F] leading-tight">
              <span className="font-semibold text-[#2A1E1A] block mb-0.5">Delivery Policy:</span>
              "{EXACT_DELIVERY_POLICY}"
            </div>

            {/* Action Buttons */}
            {checkoutStep === 'cart' ? (
              <button
                type="button"
                onClick={handleProceedToDelivery}
                className="w-full py-3.5 px-4 bg-[#2A1E1A] hover:bg-[#3D2C26] text-[#FAF7F2] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Continue to Delivery & Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Review & Order on WhatsApp (+91 8360958844)</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
